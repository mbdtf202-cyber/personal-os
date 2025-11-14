# 部署到云服务器

## 服务器信息
- IP: 43.98.253.61
- 用户: root
- 系统: Ubuntu 24

## 快速部署（推荐）

在你的**本地终端**执行：

```bash
chmod +x deploy-to-server.sh
./deploy-to-server.sh
```

这个脚本会自动：
1. SSH 连接到服务器
2. 安装 Docker 和 Git
3. 克隆/更新代码
4. 配置环境变量
5. 启动 Docker 容器

## 手动部署步骤

如果自动脚本失败，可以手动执行：

### 1. SSH 连接到服务器
```bash
ssh root@43.98.253.61
```

### 2. 安装 Docker
```bash
apt-get update
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
```

### 3. 安装 Git
```bash
apt-get install -y git
```

### 4. 克隆项目
```bash
cd /root
git clone https://github.com/mbdtf202-cyber/personal-os.git
cd personal-os
```

### 5. 配置环境变量
```bash
cat > .env << 'EOF'
# 数据库密码（请修改为强密码）
DB_PASSWORD=your_secure_password_here

# Next.js 配置
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# 应用配置
NEXT_PUBLIC_APP_URL=http://43.98.253.61
EOF
```

### 6. 启动服务
```bash
docker compose up -d --build
```

### 7. 查看日志
```bash
docker compose logs -f
```

## 部署后访问

打开浏览器访问：http://43.98.253.61

## 常用命令

```bash
# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f nginx

# 重启服务
docker compose restart

# 停止服务
docker compose down

# 更新代码并重新部署
cd /root/personal-os
git pull
docker compose down
docker compose up -d --build

# 进入应用容器
docker compose exec app sh

# 查看数据库
docker compose exec postgres psql -U personalos -d personalos

# 运行数据库迁移
docker compose exec app npx prisma migrate deploy
```

## 故障排查

### 端口被占用
```bash
# 查看端口占用
netstat -tulpn | grep :80
netstat -tulpn | grep :3000

# 停止占用端口的进程
kill -9 <PID>
```

### 容器无法启动
```bash
# 查看详细日志
docker compose logs app

# 重新构建
docker compose build --no-cache
docker compose up -d
```

### 数据库连接失败
```bash
# 检查数据库容器
docker compose ps postgres

# 重启数据库
docker compose restart postgres

# 查看数据库日志
docker compose logs postgres
```

### 清理并重新部署
```bash
cd /root/personal-os
docker compose down -v  # 删除所有容器和数据卷
git pull
docker compose up -d --build
```

## 备份数据库

```bash
# 导出数据库
docker compose exec postgres pg_dump -U personalos personalos > backup_$(date +%Y%m%d).sql

# 恢复数据库
docker compose exec -T postgres psql -U personalos personalos < backup_20231114.sql
```
