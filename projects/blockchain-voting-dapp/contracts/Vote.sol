// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Vote {
    // 候选人结构体（ID、名称、得票数）
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // 已投票选民集合（防止重复投票）
    mapping(address => bool) public hasVoted;

    // 候选人列表（索引为ID）
    Candidate[] public candidates;

    // 构造函数：初始化候选人（部署时调用）
    constructor(string[] memory _candidateNames) {
        for (uint i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                id: i,
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
    }

    // 投票函数（选民调用）
    function vote(uint candidateId) public {
        // 检查：选民未投票、候选人ID有效
        require(!hasVoted[msg.sender], "You have already voted!");
        require(candidateId < candidates.length, "Invalid candidate ID!");

        // 更新候选人得票数
        candidates[candidateId].voteCount += 1;
        // 标记选民已投票
        hasVoted[msg.sender] = true;
    }

    // 获取所有候选人信息
    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
    
    // 获取候选人数量
    function getCandidatesCount() public view returns (uint) {
        return candidates.length;
    }
    
    // 获取单个候选人信息
    function getCandidate(uint _candidateId) public view returns (uint, string memory, uint) {
        require(_candidateId < candidates.length, "Invalid candidate ID");
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }
}