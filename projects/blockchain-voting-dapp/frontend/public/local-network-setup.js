// 此脚本用于自动配置Hardhat本地网络
async function setupHardhatNetwork() {
    if (!window.ethereum) return;
    
    try {
        // 添加Hardhat本地网络配置
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '0x7A69', // 31337的十六进制
                chainName: 'Hardhat Local',
                nativeCurrency: {
                    name: 'Ether',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['http://localhost:8545'],
                blockExplorerUrls: []
            }]
        });
        
        console.log("Hardhat本地网络配置成功!");
        return true;
    } catch (addError) {
        console.error("网络配置错误:", addError);
        return false;
    }
}

async function connectWallet() {
    // 添加安全检测
    if (typeof ethers === 'undefined') {
        document.getElementById('result').innerHTML = 
            '<p class="error">❌ ethers.js 未加载! 请检查引入路径</p>';
        return;
    }
    
    // 原有的连接代码...
}



// 在测试页面上添加网络配置按钮
document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connectBtn');
    const buttonContainer = connectBtn.parentNode;
    
    const configButton = document.createElement('button');
    configButton.id = 'configNetworkBtn';
    configButton.textContent = '配置本地网络';
    configButton.onclick = setupHardhatNetwork;
    
    buttonContainer.insertBefore(configButton, connectBtn);
});
