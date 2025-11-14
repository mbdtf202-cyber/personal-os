#!/bin/bash

# 本地执行的部署脚本 - 将项目部署到远程服务器
set -e

SERVER_IP="43.98.253.61"
SERVER_USER="root"

echo "🚀 开始部署到服务器 $SERVER_IP..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}正在连接到服务器并执行部署...${NC}"

ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

echo "📦 步骤 1/6: 更新系统包..."
apt-get update -qq

echo "🐳 步骤 2/6: 安装 Docker..."
if ! command -v docker &> /dev/null; then
    apt-get install -y ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt-get update -qq
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    echo "✓ Docker 安装完成"
else
    echo "✓ Docker 已安装"
fi

echo "📥 步骤 3/6: 安装 Git..."
if ! command -v git &> /dev/null; then
    apt-get install -y git
    echo "✓ Git 安装完成"
else
    echo "✓ Git 已安装"
fi

echo "📂 步骤 4/6: 克隆/更新项目..."
cd /root
if [ -d "personal-os" ]; then
    echo "项目目录已存在，拉取最新代码..."
    cd personal-os
    git pull
else
    git clone https://github.com/mbdtf202-cyber/personal-os.git
    cd personal-os
fi

echo "⚙️  步骤 5/6: 配置环境变量..."
if [ ! -f ".env" ]; then
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
    cat > .env << EOF
# 数据库密码
DB_PASSWORD=${DB_PASSWORD}

# Next.js 配置
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# 应用配置
NEXT_PUBLIC_APP_URL=http://43.98.253.61
EOF
    echo "✓ 已生成 .env 文件"
else
    echo "✓ .env 文件已存在"
fi

echo "🚀 步骤 6/6: 启动服务..."
docker compose down 2>/dev/null || true
docker compose up -d --build

echo ""
echo "========================================"
echo "🎉 部署完成！"
echo "========================================"
echo ""
echo "访问地址: http://43.98.253.61"
echo ""
echo "查看日志: docker compose logs -f"
echo "停止服务: docker compose down"
echo "重启服务: docker compose restart"
echo ""

ENDSSH

echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${GREEN}访问地址: http://43.98.253.61${NC}"
