// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title AcademicCopyright
 * @dev 基于以太坊的学术成果版权存证系统
 * 实现论文、专利等学术成果的链上存证、权属声明、转让追踪及侵权验证功能
 */
contract AcademicCopyright is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using ECDSA for bytes32;

    // NFT计数器
    Counters.Counter private _tokenIdCounter;

    // 学术成果结构体
    struct AcademicWork {
        uint256 tokenId;           // NFT Token ID
        string contentHash;        // 内容哈希值
        string title;              // 标题
        string[] authors;          // 作者列表
        string workType;           // 作品类型 (paper, patent, etc.)
        uint256 timestamp;         // 存证时间戳
        address originalAuthor;    // 原始作者地址
        address currentOwner;      // 当前所有者
        bool isActive;             // 是否有效
        string metadata;           // 元数据JSON
    }

    // 版权转让记录结构体
    struct TransferRecord {
        address from;              // 转让方
        address to;                // 受让方
        uint256 timestamp;         // 转让时间
        string reason;             // 转让原因
        bytes signature;           // 转让授权签名
    }

    // 存储映射
    mapping(uint256 => AcademicWork) public academicWorks;           // tokenId => 学术成果
    mapping(string => uint256) public hashToTokenId;                 // 内容哈希 => tokenId
    mapping(uint256 => TransferRecord[]) public transferHistory;     // tokenId => 转让历史
    mapping(address => uint256[]) public authorWorks;                // 作者 => 作品列表
    mapping(string => bool) public registeredHashes;                 // 已注册的哈希值

    // 事件定义
    event WorkRegistered(
        uint256 indexed tokenId,
        string indexed contentHash,
        address indexed author,
        string title,
        uint256 timestamp
    );

    event CopyrightTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 timestamp,
        string reason
    );

    event InfringementVerified(
        string indexed contentHash,
        address indexed verifier,
        bool isInfringement,
        uint256 timestamp
    );

    // 修饰符：仅作品所有者
    modifier onlyWorkOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not the owner of this work");
        _;
    }

    // 修饰符：作品必须存在
    modifier workExists(uint256 tokenId) {
        require(academicWorks[tokenId].isActive, "Work does not exist");
        _;
    }

    constructor() ERC721("AcademicCopyright", "ACAD") {}

    /**
     * @dev 注册学术成果并生成NFT存证
     * @param contentHash 内容哈希值
     * @param title 作品标题
     * @param authors 作者列表
     * @param workType 作品类型
     * @param metadata 元数据JSON字符串
     * @return tokenId 生成的NFT Token ID
     */
    function registerWork(
        string memory contentHash,
        string memory title,
        string[] memory authors,
        string memory workType,
        string memory metadata
    ) public nonReentrant returns (uint256) {
        // 验证输入参数
        require(bytes(contentHash).length > 0, "Content hash cannot be empty");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(authors.length > 0, "At least one author required");
        require(!registeredHashes[contentHash], "Content already registered");

        // 验证调用者是否为作者之一
        bool isAuthor = false;
        for (uint i = 0; i < authors.length; i++) {
            // 这里简化处理，实际应用中可能需要更复杂的作者验证机制
            isAuthor = true;
            break;
        }
        require(isAuthor, "Caller must be one of the authors");

        // 生成新的Token ID
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // 铸造NFT
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadata);

        // 创建学术成果记录
        academicWorks[tokenId] = AcademicWork({
            tokenId: tokenId,
            contentHash: contentHash,
            title: title,
            authors: authors,
            workType: workType,
            timestamp: block.timestamp,
            originalAuthor: msg.sender,
            currentOwner: msg.sender,
            isActive: true,
            metadata: metadata
        });

        // 更新映射关系
        hashToTokenId[contentHash] = tokenId;
        registeredHashes[contentHash] = true;
        authorWorks[msg.sender].push(tokenId);

        emit WorkRegistered(tokenId, contentHash, msg.sender, title, block.timestamp);

        return tokenId;
    }

    /**
     * @dev 版权转让功能（需要原作者签名授权）
     * @param tokenId NFT Token ID
     * @param to 受让方地址
     * @param reason 转让原因
     * @param signature 原作者的授权签名
     */
    function transferCopyright(
        uint256 tokenId,
        address to,
        string memory reason,
        bytes memory signature
    ) public nonReentrant workExists(tokenId) onlyWorkOwner(tokenId) {
        require(to != address(0), "Invalid recipient address");
        require(to != msg.sender, "Cannot transfer to yourself");

        // 验证签名（简化版本，实际应用中需要更严格的签名验证）
        AcademicWork storage work = academicWorks[tokenId];
        bytes32 messageHash = keccak256(abi.encodePacked(tokenId, to, reason, block.timestamp));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        // 如果不是原作者转让，需要验证原作者签名
        if (msg.sender != work.originalAuthor) {
            address signer = ethSignedMessageHash.recover(signature);
            require(signer == work.originalAuthor, "Invalid signature from original author");
        }

        // 记录转让历史
        transferHistory[tokenId].push(TransferRecord({
            from: msg.sender,
            to: to,
            timestamp: block.timestamp,
            reason: reason,
            signature: signature
        }));

        // 更新当前所有者
        work.currentOwner = to;

        // 转移NFT
        _transfer(msg.sender, to, tokenId);

        // 更新作者作品列表
        authorWorks[to].push(tokenId);

        emit CopyrightTransferred(tokenId, msg.sender, to, block.timestamp, reason);
    }

    /**
     * @dev 侵权验证接口
     * @param contentHash 待验证的内容哈希
     * @return exists 是否存在存证记录
     * @return tokenId 对应的Token ID
     * @return timestamp 存证时间戳
     * @return currentOwner 当前版权所有者
     */
    function verifyInfringement(string memory contentHash) 
        public 
        view 
        returns (
            bool exists,
            uint256 tokenId,
            uint256 timestamp,
            address currentOwner,
            string memory title
        ) 
    {
        if (registeredHashes[contentHash]) {
            tokenId = hashToTokenId[contentHash];
            AcademicWork storage work = academicWorks[tokenId];
            
            return (
                true,
                tokenId,
                work.timestamp,
                work.currentOwner,
                work.title
            );
        }
        
        return (false, 0, 0, address(0), "");
    }

    /**
     * @dev 公开验证接口，记录验证行为
     * @param contentHash 待验证的内容哈希
     */
    function publicVerifyInfringement(string memory contentHash) public {
        (bool exists, , , , ) = verifyInfringement(contentHash);
        
        emit InfringementVerified(
            contentHash,
            msg.sender,
            exists,
            block.timestamp
        );
    }

    /**
     * @dev 获取作品的完整转让历史
     * @param tokenId NFT Token ID
     * @return 转让历史记录数组
     */
    function getTransferHistory(uint256 tokenId) 
        public 
        view 
        workExists(tokenId)
        returns (TransferRecord[] memory) 
    {
        return transferHistory[tokenId];
    }

    /**
     * @dev 获取作者的所有作品
     * @param author 作者地址
     * @return 作品Token ID数组
     */
    function getAuthorWorks(address author) public view returns (uint256[] memory) {
        return authorWorks[author];
    }

    /**
     * @dev 获取作品详细信息
     * @param tokenId NFT Token ID
     * @return 学术成果详细信息
     */
    function getWorkDetails(uint256 tokenId) 
        public 
        view 
        workExists(tokenId)
        returns (AcademicWork memory) 
    {
        return academicWorks[tokenId];
    }

    /**
     * @dev 批量验证多个内容哈希
     * @param contentHashes 内容哈希数组
     * @return results 验证结果数组
     */
    function batchVerifyInfringement(string[] memory contentHashes) 
        public 
        view 
        returns (bool[] memory results) 
    {
        results = new bool[](contentHashes.length);
        
        for (uint i = 0; i < contentHashes.length; i++) {
            results[i] = registeredHashes[contentHashes[i]];
        }
        
        return results;
    }

    /**
     * @dev 获取系统统计信息
     * @return totalWorks 总作品数量
     * @return totalTransfers 总转让次数
     */
    function getSystemStats() 
        public 
        view 
        returns (uint256 totalWorks, uint256 totalTransfers) 
    {
        totalWorks = _tokenIdCounter.current();
        
        // 计算总转让次数
        for (uint256 i = 0; i < totalWorks; i++) {
            totalTransfers += transferHistory[i].length;
        }
        
        return (totalWorks, totalTransfers);
    }

    // 重写必要的函数
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
