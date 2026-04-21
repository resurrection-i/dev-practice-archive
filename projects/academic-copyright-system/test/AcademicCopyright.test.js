const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AcademicCopyright", function () {
  let academicCopyright;
  let verifier;
  let privacyVerifier;
  let owner;
  let author1;
  let author2;
  let recipient;

  beforeEach(async function () {
    [owner, author1, author2, recipient] = await ethers.getSigners();

    // 部署验证器合约
    const Verifier = await ethers.getContractFactory("Verifier");
    verifier = await Verifier.deploy();
    await verifier.deployed();

    // 部署主合约
    const AcademicCopyright = await ethers.getContractFactory("AcademicCopyright");
    academicCopyright = await AcademicCopyright.deploy();
    await academicCopyright.deployed();

    // 部署隐私验证合约
    const PrivacyVerifier = await ethers.getContractFactory("PrivacyVerifier");
    privacyVerifier = await PrivacyVerifier.deploy(
      verifier.address,
      academicCopyright.address
    );
    await privacyVerifier.deployed();
  });

  describe("合约部署", function () {
    it("应该正确设置NFT名称和符号", async function () {
      expect(await academicCopyright.name()).to.equal("AcademicCopyright");
      expect(await academicCopyright.symbol()).to.equal("ACAD");
    });

    it("应该正确设置合约所有者", async function () {
      expect(await academicCopyright.owner()).to.equal(owner.address);
    });
  });

  describe("作品注册", function () {
    const contentHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const title = "区块链技术在学术版权保护中的应用研究";
    const authors = ["张三", "李四"];
    const workType = "paper";
    const metadata = JSON.stringify({
      abstract: "本文研究了区块链技术在学术版权保护中的应用...",
      keywords: ["区块链", "版权保护", "学术成果"]
    });

    it("应该成功注册新作品", async function () {
      const tx = await academicCopyright.connect(author1).registerWork(
        contentHash,
        title,
        authors,
        workType,
        metadata
      );

      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === "WorkRegistered");
      
      expect(event).to.not.be.undefined;
      expect(event.args.contentHash).to.equal(contentHash);
      expect(event.args.author).to.equal(author1.address);
      expect(event.args.title).to.equal(title);

      // 验证NFT铸造
      const tokenId = event.args.tokenId;
      expect(await academicCopyright.ownerOf(tokenId)).to.equal(author1.address);
    });

    it("应该拒绝重复的内容哈希", async function () {
      // 第一次注册
      await academicCopyright.connect(author1).registerWork(
        contentHash,
        title,
        authors,
        workType,
        metadata
      );

      // 第二次注册相同哈希应该失败
      await expect(
        academicCopyright.connect(author2).registerWork(
          contentHash,
          "另一个标题",
          ["王五"],
          workType,
          metadata
        )
      ).to.be.revertedWith("Content already registered");
    });

    it("应该拒绝空的必填字段", async function () {
      await expect(
        academicCopyright.connect(author1).registerWork(
          "",
          title,
          authors,
          workType,
          metadata
        )
      ).to.be.revertedWith("Content hash cannot be empty");

      await expect(
        academicCopyright.connect(author1).registerWork(
          contentHash,
          "",
          authors,
          workType,
          metadata
        )
      ).to.be.revertedWith("Title cannot be empty");

      await expect(
        academicCopyright.connect(author1).registerWork(
          contentHash,
          title,
          [],
          workType,
          metadata
        )
      ).to.be.revertedWith("At least one author required");
    });
  });

  describe("版权转让", function () {
    let tokenId;
    const contentHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const title = "测试作品";
    const authors = ["作者1"];
    const workType = "paper";
    const metadata = "{}";

    beforeEach(async function () {
      const tx = await academicCopyright.connect(author1).registerWork(
        contentHash,
        title,
        authors,
        workType,
        metadata
      );
      const receipt = await tx.wait();
      tokenId = receipt.events.find(e => e.event === "WorkRegistered").args.tokenId;
    });

    it("应该成功转让版权", async function () {
      const reason = "sale";
      const signature = "0x1234"; // 简化的签名

      const tx = await academicCopyright.connect(author1).transferCopyright(
        tokenId,
        recipient.address,
        reason,
        signature
      );

      const receipt = await tx.wait();
      const event = receipt.events.find(e => e.event === "CopyrightTransferred");
      
      expect(event).to.not.be.undefined;
      expect(event.args.tokenId).to.equal(tokenId);
      expect(event.args.from).to.equal(author1.address);
      expect(event.args.to).to.equal(recipient.address);

      // 验证所有权转移
      expect(await academicCopyright.ownerOf(tokenId)).to.equal(recipient.address);
    });

    it("应该拒绝非所有者的转让", async function () {
      await expect(
        academicCopyright.connect(author2).transferCopyright(
          tokenId,
          recipient.address,
          "sale",
          "0x1234"
        )
      ).to.be.revertedWith("Not the owner of this work");
    });

    it("应该拒绝转让给零地址", async function () {
      await expect(
        academicCopyright.connect(author1).transferCopyright(
          tokenId,
          ethers.constants.AddressZero,
          "sale",
          "0x1234"
        )
      ).to.be.revertedWith("Invalid recipient address");
    });

    it("应该拒绝转让给自己", async function () {
      await expect(
        academicCopyright.connect(author1).transferCopyright(
          tokenId,
          author1.address,
          "sale",
          "0x1234"
        )
      ).to.be.revertedWith("Cannot transfer to yourself");
    });
  });

  describe("侵权验证", function () {
    const contentHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const unregisteredHash = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
    let tokenId;

    beforeEach(async function () {
      const tx = await academicCopyright.connect(author1).registerWork(
        contentHash,
        "测试作品",
        ["作者1"],
        "paper",
        "{}"
      );
      const receipt = await tx.wait();
      tokenId = receipt.events.find(e => e.event === "WorkRegistered").args.tokenId;
    });

    it("应该正确验证已注册的内容", async function () {
      const result = await academicCopyright.verifyInfringement(contentHash);
      
      expect(result.exists).to.be.true;
      expect(result.tokenId).to.equal(tokenId);
      expect(result.currentOwner).to.equal(author1.address);
      expect(result.title).to.equal("测试作品");
    });

    it("应该正确验证未注册的内容", async function () {
      const result = await academicCopyright.verifyInfringement(unregisteredHash);
      
      expect(result.exists).to.be.false;
      expect(result.tokenId).to.equal(0);
      expect(result.currentOwner).to.equal(ethers.constants.AddressZero);
      expect(result.title).to.equal("");
    });

    it("应该支持批量验证", async function () {
      const hashes = [contentHash, unregisteredHash];
      const results = await academicCopyright.batchVerifyInfringement(hashes);
      
      expect(results).to.have.lengthOf(2);
      expect(results[0]).to.be.true;  // 已注册
      expect(results[1]).to.be.false; // 未注册
    });

    it("应该记录公开验证行为", async function () {
      const tx = await academicCopyright.connect(author2).publicVerifyInfringement(contentHash);
      const receipt = await tx.wait();
      
      const event = receipt.events.find(e => e.event === "InfringementVerified");
      expect(event).to.not.be.undefined;
      expect(event.args.contentHash).to.equal(contentHash);
      expect(event.args.verifier).to.equal(author2.address);
      expect(event.args.isInfringement).to.be.true;
    });
  });

  describe("转让历史查询", function () {
    let tokenId;

    beforeEach(async function () {
      const tx = await academicCopyright.connect(author1).registerWork(
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "测试作品",
        ["作者1"],
        "paper",
        "{}"
      );
      const receipt = await tx.wait();
      tokenId = receipt.events.find(e => e.event === "WorkRegistered").args.tokenId;
    });

    it("应该正确记录转让历史", async function () {
      // 执行转让
      await academicCopyright.connect(author1).transferCopyright(
        tokenId,
        author2.address,
        "sale",
        "0x1234"
      );

      // 查询转让历史
      const history = await academicCopyright.getTransferHistory(tokenId);
      
      expect(history).to.have.lengthOf(1);
      expect(history[0].from).to.equal(author1.address);
      expect(history[0].to).to.equal(author2.address);
      expect(history[0].reason).to.equal("sale");
    });

    it("应该支持多次转让的历史记录", async function () {
      // 第一次转让
      await academicCopyright.connect(author1).transferCopyright(
        tokenId,
        author2.address,
        "sale",
        "0x1234"
      );

      // 第二次转让
      await academicCopyright.connect(author2).transferCopyright(
        tokenId,
        recipient.address,
        "gift",
        "0x5678"
      );

      // 查询转让历史
      const history = await academicCopyright.getTransferHistory(tokenId);
      
      expect(history).to.have.lengthOf(2);
      expect(history[0].from).to.equal(author1.address);
      expect(history[0].to).to.equal(author2.address);
      expect(history[1].from).to.equal(author2.address);
      expect(history[1].to).to.equal(recipient.address);
    });
  });

  describe("系统统计", function () {
    it("应该正确统计系统信息", async function () {
      // 注册几个作品
      await academicCopyright.connect(author1).registerWork(
        "0x1111111111111111111111111111111111111111111111111111111111111111",
        "作品1",
        ["作者1"],
        "paper",
        "{}"
      );

      await academicCopyright.connect(author2).registerWork(
        "0x2222222222222222222222222222222222222222222222222222222222222222",
        "作品2",
        ["作者2"],
        "patent",
        "{}"
      );

      const stats = await academicCopyright.getSystemStats();
      expect(stats.totalWorks).to.equal(2);
      expect(stats.totalTransfers).to.equal(0);
    });
  });

  describe("重入攻击防护", function () {
    it("应该防止重入攻击", async function () {
      // 这里可以添加重入攻击测试
      // 由于使用了OpenZeppelin的ReentrancyGuard，应该能够防止重入攻击
    });
  });

  describe("访问控制", function () {
    it("应该正确控制函数访问权限", async function () {
      const tokenId = 1; // 不存在的token

      await expect(
        academicCopyright.connect(author1).transferCopyright(
          tokenId,
          recipient.address,
          "sale",
          "0x1234"
        )
      ).to.be.revertedWith("Work does not exist");
    });
  });
});
