const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding", function () {
  let crowdFunding;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // 获取合约工厂
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    
    // 获取测试账户
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    // 部署合约
    crowdFunding = await CrowdFunding.deploy();
  });

  describe("项目创建", function () {
    it("应该正确创建新项目", async function () {
      // 项目参数
      const name = "测试项目";
      const description = "这是一个测试项目";
      const goal = ethers.parseEther("1"); // 1 ETH
      const durationDays = 30;
      
      // 创建项目
      await crowdFunding.connect(owner).createProject(name, description, goal, durationDays);
      
      // 检查项目数量
      expect(await crowdFunding.projectsCount()).to.equal(1);
      
      // 检查项目详情
      const project = await crowdFunding.projects(1);
      expect(project.name).to.equal(name);
      expect(project.description).to.equal(description);
      expect(project.goal).to.equal(goal);
      expect(project.creator).to.equal(owner.address);
      expect(project.completed).to.equal(false);
    });
  });

  describe("资金支持", function () {
    beforeEach(async function () {
      // 创建测试项目
      await crowdFunding.connect(owner).createProject(
        "测试项目",
        "这是一个测试项目",
        ethers.parseEther("1"), // 1 ETH
        30
      );
    });

    it("应该允许用户支持项目", async function () {
      // addr1 向项目捐赠 0.5 ETH
      const donationAmount = ethers.parseEther("0.5");
      await crowdFunding.connect(addr1).fundProject(1, { value: donationAmount });
      
      // 检查项目当前金额
      const project = await crowdFunding.projects(1);
      expect(project.currentAmount).to.equal(donationAmount);
      
      // 检查贡献
      const contribution = await crowdFunding.getContribution(1, addr1.address);
      expect(contribution).to.equal(donationAmount);
    });
  });

  describe("资金请求", function () {
    beforeEach(async function () {
      // 创建测试项目
      await crowdFunding.connect(owner).createProject(
        "测试项目",
        "这是一个测试项目",
        ethers.parseEther("1"), // 1 ETH
        30
      );
      
      // addr1 和 addr2 各捐赠 0.5 ETH
      const donationAmount = ethers.parseEther("0.5");
      await crowdFunding.connect(addr1).fundProject(1, { value: donationAmount });
      await crowdFunding.connect(addr2).fundProject(1, { value: donationAmount });
    });

    it("应该允许创建资金请求", async function () {
      // 创建资金请求
      await crowdFunding.connect(owner).createFundingRequest(
        1,                         // 项目ID
        "开发费用",                 // 描述
        ethers.parseEther("0.3"),  // 请求金额
        owner.address              // 接收地址
      );
      
      // 检查请求数量
      expect(await crowdFunding.requestsCount(1)).to.equal(1);
      
      // 检查请求详情
      const request = await crowdFunding.fundingRequests(1, 1);
      expect(request.description).to.equal("开发费用");
      expect(request.amount).to.equal(ethers.parseEther("0.3"));
      expect(request.recipient).to.equal(owner.address);
      expect(request.completed).to.equal(false);
      expect(request.approvalCount).to.equal(0);
    });

    it("应该允许贡献者批准资金请求", async function () {
      // 创建资金请求
      await crowdFunding.connect(owner).createFundingRequest(
        1,
        "开发费用", 
        ethers.parseEther("0.3"),
        owner.address
      );
      
      // addr1 批准请求
      await crowdFunding.connect(addr1).approveRequest(1, 1);
      
      // 检查批准状态
      const hasApproved = await crowdFunding.hasApproved(1, 1, addr1.address);
      expect(hasApproved).to.equal(true);
      
      // 检查批准数量
      const request = await crowdFunding.fundingRequests(1, 1);
      expect(request.approvalCount).to.equal(1);
    });

    it("应该允许执行多数批准的资金请求", async function () {
      // 创建资金请求
      await crowdFunding.connect(owner).createFundingRequest(
        1,
        "开发费用", 
        ethers.parseEther("0.3"),
        owner.address
      );
      
      // addr1 和 addr2 都批准请求 (2/2 贡献者，满足 > 50% 要求)
      await crowdFunding.connect(addr1).approveRequest(1, 1);
      await crowdFunding.connect(addr2).approveRequest(1, 1);
      
      // 记录合约余额
      const initialContractBalance = await ethers.provider.getBalance(await crowdFunding.getAddress());
      
      // 记录拥有者初始余额
      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      // 执行请求
      await crowdFunding.connect(owner).finalizeRequest(1, 1);
      
      // 检查请求状态
      const request = await crowdFunding.fundingRequests(1, 1);
      expect(request.completed).to.equal(true);
      
      // 检查合约余额减少
      const finalContractBalance = await ethers.provider.getBalance(await crowdFunding.getAddress());
      expect(finalContractBalance).to.equal(initialContractBalance - ethers.parseEther("0.3"));
      
      // 检查项目当前金额减少
      const project = await crowdFunding.projects(1);
      expect(project.currentAmount).to.equal(ethers.parseEther("0.7")); // 1 ETH - 0.3 ETH
    });
  });
}); 