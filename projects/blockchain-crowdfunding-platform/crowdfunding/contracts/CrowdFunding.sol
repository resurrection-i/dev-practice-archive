// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CrowdFunding
 * @dev 众筹平台智能合约
 */
contract CrowdFunding {
    // 项目结构
    struct Project {
        uint256 id;
        string name;
        string description;
        address payable creator;
        uint256 goal;
        uint256 currentAmount;
        uint256 deadline;
        bool completed;
        uint256 contributorsCount;
        mapping(address => uint256) contributions;
        address[] contributors; // 存储所有贡献者地址数组
    }

    // 资金请求结构
    struct FundingRequest {
        uint256 id;
        string description;
        uint256 amount;
        address payable recipient;
        bool completed;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    // 计数器和映射
    uint256 public projectsCount;
    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(uint256 => FundingRequest)) public fundingRequests;
    mapping(uint256 => uint256) public requestsCount;

    // 事件定义
    event ProjectCreated(uint256 projectId, string name, address creator, uint256 goal, uint256 deadline);
    event ProjectFunded(uint256 projectId, address contributor, uint256 amount);
    event RequestCreated(uint256 projectId, uint256 requestId, string description, uint256 amount, address recipient);
    event RequestApproved(uint256 projectId, uint256 requestId, address approver);
    event RequestFinalized(uint256 projectId, uint256 requestId, address recipient, uint256 amount);
    event ProjectCompleted(uint256 projectId, uint256 totalAmount);

    // 修饰符：确保调用者是项目创建者
    modifier onlyCreator(uint256 _projectId) {
        require(projects[_projectId].creator == msg.sender, "Only project creator can call this function");
        _;
    }

    // 修饰符：确保项目存在
    modifier projectExists(uint256 _projectId) {
        require(_projectId > 0 && _projectId <= projectsCount, "Project does not exist");
        _;
    }

    // 修饰符：确保项目尚未完成
    modifier projectNotCompleted(uint256 _projectId) {
        require(!projects[_projectId].completed, "Project already completed");
        _;
    }

    // 修饰符：确保贡献者已捐赠
    modifier isContributor(uint256 _projectId) {
        require(projects[_projectId].contributions[msg.sender] > 0, "Only contributors can call this function");
        _;
    }

    /**
     * @dev 创建新众筹项目
     * @param _name 项目名称
     * @param _description 项目描述
     * @param _goal 目标金额(以 wei 为单位)
     * @param _durationDays 项目持续天数
     */
    function createProject(string memory _name, string memory _description, uint256 _goal, uint256 _durationDays) public {
        require(_goal > 0, "Goal must be greater than zero");
        require(_durationDays > 0, "Project duration must be greater than zero");

        projectsCount++;
        uint256 projectId = projectsCount;

        Project storage newProject = projects[projectId];
        newProject.id = projectId;
        newProject.name = _name;
        newProject.description = _description;
        newProject.creator = payable(msg.sender);
        newProject.goal = _goal;
        newProject.currentAmount = 0;
        newProject.deadline = block.timestamp + (_durationDays * 1 days);
        newProject.completed = false;
        newProject.contributorsCount = 0;

        emit ProjectCreated(projectId, _name, msg.sender, _goal, newProject.deadline);
    }

    /**
     * @dev 向项目贡献资金
     * @param _projectId 项目ID
     */
    function fundProject(uint256 _projectId) public payable projectExists(_projectId) projectNotCompleted(_projectId) {
        require(msg.value > 0, "Contribution amount must be greater than zero");
        require(block.timestamp <= projects[_projectId].deadline, "Project expired");

        Project storage project = projects[_projectId];
        
        // 如果这是该地址的第一次捐赠，则增加贡献者计数
        if (project.contributions[msg.sender] == 0) {
            project.contributorsCount++;
            project.contributors.push(msg.sender); // 添加贡献者地址到数组
        }
        
        project.contributions[msg.sender] += msg.value;
        project.currentAmount += msg.value;

        emit ProjectFunded(_projectId, msg.sender, msg.value);
    }

    /**
     * @dev 创建资金使用请求
     * @param _projectId 项目ID
     * @param _description 资金使用描述
     * @param _amount 请求金额
     * @param _recipient 资金接收地址
     */
    function createFundingRequest(
        uint256 _projectId,
        string memory _description,
        uint256 _amount,
        address payable _recipient
    ) public projectExists(_projectId) onlyCreator(_projectId) projectNotCompleted(_projectId) {
        require(_amount > 0, "Request amount must be greater than zero");
        require(_amount <= projects[_projectId].currentAmount, "Request amount exceeds current funds");
        
        uint256 requestId = requestsCount[_projectId] + 1;
        requestsCount[_projectId] = requestId;

        FundingRequest storage newRequest = fundingRequests[_projectId][requestId];
        newRequest.id = requestId;
        newRequest.description = _description;
        newRequest.amount = _amount;
        newRequest.recipient = _recipient;
        newRequest.completed = false;
        newRequest.approvalCount = 0;

        // 创建者自动批准自己的请求（如果创建者也是贡献者）
        if (projects[_projectId].contributions[msg.sender] > 0) {
            newRequest.approvals[msg.sender] = true;
            newRequest.approvalCount = 1;
            emit RequestApproved(_projectId, requestId, msg.sender); // 同时发出批准事件
        }

        emit RequestCreated(_projectId, requestId, _description, _amount, _recipient);
    }

    /**
     * @dev 批准资金使用请求
     * @param _projectId 项目ID
     * @param _requestId 请求ID
     */
    function approveRequest(uint256 _projectId, uint256 _requestId)
        public
        projectExists(_projectId)
        isContributor(_projectId)
        projectNotCompleted(_projectId)
    {
        require(_requestId > 0 && _requestId <= requestsCount[_projectId], "Request does not exist");

        FundingRequest storage request = fundingRequests[_projectId][_requestId];
        require(!request.completed, "Request already completed");
        require(!request.approvals[msg.sender], "You have already approved this request");

        request.approvals[msg.sender] = true;
        request.approvalCount++;

        emit RequestApproved(_projectId, _requestId, msg.sender);
    }

    /**
     * @dev 执行已批准的资金使用请求
     * @param _projectId 项目ID
     * @param _requestId 请求ID
     */
    function finalizeRequest(uint256 _projectId, uint256 _requestId)
        public
        projectExists(_projectId)
        onlyCreator(_projectId)
        projectNotCompleted(_projectId)
    {
        require(_requestId > 0 && _requestId <= requestsCount[_projectId], "Request does not exist");

        Project storage project = projects[_projectId];
        FundingRequest storage request = fundingRequests[_projectId][_requestId];

        require(!request.completed, "Request already completed");
        
        // 修改：确保严格要求超过一半贡献者批准
        require(project.contributorsCount > 0, "No contributors for this project");
        require(request.approvalCount * 2 > project.contributorsCount, "More than half of contributors must approve");
        require(request.amount <= address(this).balance, "Insufficient contract balance");

        request.completed = true;
        request.recipient.transfer(request.amount);
        project.currentAmount -= request.amount; // 从项目余额中减去已发放的金额

        emit RequestFinalized(_projectId, _requestId, request.recipient, request.amount);
    }

    /**
     * @dev 完成项目
     * @param _projectId 项目ID
     */
    function completeProject(uint256 _projectId)
        public
        projectExists(_projectId)
        onlyCreator(_projectId)
        projectNotCompleted(_projectId)
    {
        require(block.timestamp > projects[_projectId].deadline, "Project not yet expired");

        Project storage project = projects[_projectId];
        project.completed = true;

        emit ProjectCompleted(_projectId, project.currentAmount);

        // 如果项目达到目标，资金保留在合约中供创建者使用(通过请求系统)
        // 如果项目未达目标，本实现允许创建者仍可使用募集的资金(通过请求系统)
        // 注：可以根据需要添加资金返还等策略
    }

    /**
     * @dev 查询用户对项目的贡献
     * @param _projectId 项目ID
     * @param _contributor 贡献者地址
     */
    function getContribution(uint256 _projectId, address _contributor) public view projectExists(_projectId) returns (uint256) {
        return projects[_projectId].contributions[_contributor];
    }
    
    /**
     * @dev 查询资金请求是否已获批准
     * @param _projectId 项目ID
     * @param _requestId 请求ID
     * @param _approver 批准者地址
     */
    function hasApproved(uint256 _projectId, uint256 _requestId, address _approver) public view returns (bool) {
        return fundingRequests[_projectId][_requestId].approvals[_approver];
    }
    
    /**
     * @dev 查询项目是否已达成目标
     * @param _projectId 项目ID
     */
    function isProjectFunded(uint256 _projectId) public view projectExists(_projectId) returns (bool) {
        Project storage project = projects[_projectId];
        return project.currentAmount >= project.goal;
    }
    
    /**
     * @dev 获取项目的所有贡献者地址
     * @param _projectId 项目ID
     */
    function getContributors(uint256 _projectId) public view projectExists(_projectId) returns (address[] memory) {
        return projects[_projectId].contributors;
    }
    
    /**
     * @dev 检查地址是否为项目贡献者
     * @param _projectId 项目ID
     * @param _address 待检查地址
     */
    function isAddressContributor(uint256 _projectId, address _address) public view projectExists(_projectId) returns (bool) {
        return projects[_projectId].contributions[_address] > 0;
    }
} 