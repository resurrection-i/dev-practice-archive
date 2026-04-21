@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   区块链众筹项目 - 一键配置脚本
echo ========================================
echo.

echo [提示] 此脚本将帮助您完成项目的初始配置
echo.
pause

echo.
echo ========================================
echo   第一步: 检查环境
echo ========================================
echo.

echo [1/4] 检查 Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   ✗ 未安装 Node.js
    echo   请访问 https://nodejs.org/ 下载安装
    pause
    exit /b 1
) else (
    node --version
    echo   ✓ Node.js 已安装
)

echo.
echo [2/4] 检查 npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo   ✗ 未安装 npm
    pause
    exit /b 1
) else (
    npm --version
    echo   ✓ npm 已安装
)

echo.
echo [3/4] 检查 Java...
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo   ✗ 未安装 Java
    echo   请访问 https://www.oracle.com/java/technologies/downloads/ 下载安装 JDK 17
    pause
    exit /b 1
) else (
    java -version
    echo   ✓ Java 已安装
)

echo.
echo [4/4] 检查 Maven...
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo   ✗ 未安装 Maven
    echo   请访问 https://maven.apache.org/download.cgi 下载安装
    pause
    exit /b 1
) else (
    mvn --version
    echo   ✓ Maven 已安装
)

echo.
echo ========================================
echo   第二步: 安装依赖
echo ========================================
echo.

echo [1/2] 安装 Hardhat 依赖...
cd crowdfunding
if not exist "node_modules" (
    echo   正在安装依赖，请稍候...
    call npm install
    if %errorlevel% neq 0 (
        echo   ✗ 安装失败
        pause
        exit /b 1
    )
    echo   ✓ Hardhat 依赖安装完成
) else (
    echo   ✓ Hardhat 依赖已存在
)

echo.
echo [2/2] 安装前端依赖...
cd frontend
if not exist "node_modules" (
    echo   正在安装依赖，请稍候...
    call npm install
    if %errorlevel% neq 0 (
        echo   ✗ 安装失败
        cd ..\..
        pause
        exit /b 1
    )
    echo   ✓ 前端依赖安装完成
) else (
    echo   ✓ 前端依赖已存在
)
cd ..\..

echo.
echo ========================================
echo   第三步: 编译智能合约
echo ========================================
echo.

cd crowdfunding
echo   正在编译智能合约...
call npx hardhat compile
if %errorlevel% neq 0 (
    echo   ✗ 编译失败
    cd ..
    pause
    exit /b 1
)
echo   ✓ 智能合约编译完成
cd ..

echo.
echo ========================================
echo   第四步: 配置数据库
echo ========================================
echo.

echo [提示] 请确保已完成以下配置：
echo   1. 安装 MySQL 数据库
echo   2. 创建数据库: crowdfunding_db
echo   3. 修改 backend/src/main/resources/application.yml 中的数据库配置
echo.
echo 是否已完成数据库配置？
choice /c YN /m "Y=是, N=否"
if errorlevel 2 (
    echo.
    echo [提示] 请先完成数据库配置，然后重新运行此脚本
    pause
    exit /b 0
)

echo.
echo ========================================
echo   第五步: 编译后端
echo ========================================
echo.

cd backend
echo   正在编译后端项目...
call mvn clean compile
if %errorlevel% neq 0 (
    echo   ✗ 编译失败
    cd ..
    pause
    exit /b 1
)
echo   ✓ 后端编译完成
cd ..

echo.
echo ========================================
echo   ✓ 配置完成！
echo ========================================
echo.
echo 🎉 项目配置成功！
echo.
echo 📝 后续步骤：
echo   1. 启动 Hardhat 本地网络:
echo      cd crowdfunding
echo      npx hardhat node
echo.
echo   2. 部署智能合约 (新终端):
echo      cd crowdfunding
echo      npx hardhat run scripts/deploy.js --network localhost
echo.
echo   3. 启动后端服务 (新终端):
echo      cd backend
echo      mvn spring-boot:run
echo.
echo   4. 启动前端服务 (新终端):
echo      cd crowdfunding/frontend
echo      npm run dev
echo.
echo   5. 打开浏览器访问: http://localhost:3000
echo.
echo 💡 提示: 请按照上述顺序启动各个服务
echo.
pause
