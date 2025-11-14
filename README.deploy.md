# 部署指南

## 服务器信息
- IP: 43.98.253.61
- 用户: root
- 系统: Ubuntu 24

## 部署步骤

### 1. 连接到服务器
```bash
ssh root@43.98.253.61
```

### 2. 运行自动部署脚本
在服务器上执行：
```bash
curl -fsSL https://raw.githubusercontent.com/mbdtf202-cyber/personal-os/main/deploy.sh | bash
```

或者手动部署：

```bash
# 克隆项目
cd /root
git clone https://github.com/mbdtf202-cyber/personal-os.git
cd personal-os

# 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 3. 访问应用
部署完成后，访问：http://43.98.253.61

## 常用命令

### 查看服务状态
```bash
cd /root/personal-os
docker compose ps
```

### 查看日志
```bash
# 查看所有服务日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f nginx
```

### 重启服务
```bash
docker compose restart
```

### 停止服务
```bash
docker compose down
```

### 更新代码并重新部署
```bash
cd /root/personal-os
git pull
docker compose down
docker compose up -d --build
```

### 进入容器
```bash
# 进入应用容器
docker compose exec app sh

# 进入数据库容器
docker compose exec postgres psql -U personalos -d personalos
```

### 数据库操作
```bash
# 运行数据库迁移
docker compose exec app npx prisma migrate deploy

# 查看数据库状态
docker compose exec app npx prisma migrate status

# 重置数据库（谨慎使用）
docker compose exec app npx prisma migrate reset
```

## 故障排查

### 应用无法启动
```bash
# 查看详细日志
docker compose logs app

# 检查数据库连接
docker compose exec app npx prisma db push
```

### 数据库连接失败
```bash
# 检查数据库是否运行
docker compose ps postgres

# 重启数据库
docker compose restart postgres
```

### 端口被占用
```bash
# 查看端口占用
netstat -tulpn | grep :80
netstat -tulpn | grep :3000

# 停止占用端口的进程
kill -9 <PID>
```

## 安全建议

1. 修改数据库密码（在 .env 文件中）
2. 配置防火墙规则
3. 启用 HTTPS（需要域名和 SSL 证书）
4. 定期备份数据库

## 备份数据库
```bash
# 导出数据库
docker compose exec postgres pg_dump -U personalos personalos > backup.sql

# 恢复数据库
docker compose exec -T postgres psql -U personalos personalos < backup.sql
```
