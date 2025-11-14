#!/bin/bash

# 部署脚本
set -e

echo "🚀 开始部署 Personal OS..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否在服务器上
if [ ! -f "/etc/os-release" ]; then
    echo "请在 Ubuntu 服务器上运行此脚本"
    exit 1
fi

echo -e "${YELLOW}步骤 1/6: 更新系统包...${NC}"
apt-get update

echo -e "${YELLOW}步骤 2/6: 安装 Docker...${NC}"
if ! command -v docker &> /dev/null; then
    apt-get install -y ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    echo -e "${GREEN}✓ Docker 安装完成${NC}"
else
    echo -e "${GREEN}✓ Docker 已安装${NC}"
fi

echo -e "${YELLOW}步骤 3/6: 安装 Git...${NC}"
if ! command -v git &> /dev/null; then
    apt-get install -y git
    echo -e "${GREEN}✓ Git 安装完成${NC}"
else
    echo -e "${GREEN}✓ Git 已安装${NC}"
fi

echo -e "${YELLOW}步骤 4/6: 克隆项目...${NC}"
cd /root
if [ -d "personal-os" ]; then
    echo "项目目录已存在，拉取最新代码..."
    cd personal-os
    git pull
else
    git clone https://github.com/mbdtf202-cyber/personal-os.git
    cd personal-os
fi

echo -e "${YELLOW}步骤 5/6: 配置环境变量...${NC}"
if [ ! -f ".env" ]; then
    # 生成随机密码
    DB_PASSWORD=$(openssl rand -base64 32)
    echo "DB_PASSWORD=$DB_PASSWORD" > .env
    echo -e "${GREEN}✓ 已生成数据库密码${NC}"
else
    echo -e "${GREEN}✓ .env 文件已存在${NC}"
fi

echo -e "${YELLOW}步骤 6/6: 启动服务...${NC}"
docker compose down
docker compose up -d --build

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "访问地址: http://43.98.253.61"
echo ""
echo "查看日志: docker compose logs -f"
echo "停止服务: docker compose down"
echo "重启服务: docker compose restart"
echo ""
