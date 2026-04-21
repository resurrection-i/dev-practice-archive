@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   区块链众筹项目 - 一键启动
echo ========================================
echo.

echo [提示] 此脚本将在4个新窗口中启动所有服务
echo.
pause

echo.
echo [1/4] 启动 Hardhat 本地网络...
start "Hardhat Network" cmd /k "cd /d %~dp0crowdfunding && npx hardhat node"
timeout /t 3 >nul

echo [2/4] 等待 Hardhat 网络启动...
timeout /t 5 >nul

echo [3/4] 部署智能合约...
start "Deploy Contract" cmd /k "cd /d %~dp0crowdfunding && npx hardhat run scripts/deploy.js --network localhost && echo. && echo 合约部署完成！按任意键关闭... && pause >nul && exit"
timeout /t 5 >nul

echo [4/4] 启动后端服务...
start "Backend Server" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"
timeout /t 3 >nul

echo [5/5] 启动前端服务...
start "Frontend Server" cmd /k "cd /d %~dp0crowdfunding\frontend && npm run dev"

echo.
echo ========================================
echo   ✓ 所有服务已启动！
echo ========================================
echo.
echo 📝 服务列表：
echo   1. Hardhat Network  - http://127.0.0.1:8545
echo   2. Backend Server   - http://localhost:8080
echo   3. Frontend Server  - http://localhost:3000
echo.
echo 💡 提示：
echo   - 请等待所有服务启动完成（约30秒）
echo   - 浏览器访问: http://localhost:3000
echo   - 关闭所有窗口即可停止服务
echo.
echo 按任意键关闭此窗口...
pause >nul
