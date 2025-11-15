#!/bin/bash

# API 功能测试脚本

BASE_URL="http://localhost:3000"
PASS=0
FAIL=0

test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local expected_status=$4
  local description=$5

  echo "测试: $description"
  
  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" \
      -H "Content-Type: application/json" \
      -d "$data" \
      "$BASE_URL$endpoint")
  fi

  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)

  if [ "$status" = "$expected_status" ]; then
    echo "✅ 通过 (状态码: $status)"
    ((PASS++))
  else
    echo "❌ 失败 (期望: $expected_status, 实际: $status)"
    echo "响应: $body"
    ((FAIL++))
  fi
  echo ""
}

echo "========== Personal OS API 测试 =========="
echo ""

# 健康检查
test_endpoint "GET" "/api/health" "" "200" "健康检查"

# 健康日志
test_endpoint "POST" "/api/health/logs" \
  '{"date":"2025-11-15T20:55:00Z","sleepHours":8,"exerciseMinutes":30,"moodScore":8,"energyScore":7,"stressLevel":3}' \
  "201" "创建健康日志"

# 书签
test_endpoint "POST" "/api/bookmarks" \
  '{"url":"https://example.com","title":"Example","category":"tech"}' \
  "201" "创建书签"

# 项目
test_endpoint "POST" "/api/projects" \
  '{"title":"Test Project","status":"IDEA"}' \
  "201" "创建项目"

# 获取书签
test_endpoint "GET" "/api/bookmarks" "" "200" "获取书签列表"

# 获取项目
test_endpoint "GET" "/api/projects" "" "200" "获取项目列表"

# 统计数据
test_endpoint "GET" "/api/stats/dashboard" "" "200" "获取统计数据"

# 性能指标
test_endpoint "GET" "/api/metrics" "" "200" "获取性能指标"

echo "========== 测试结果 =========="
echo "✅ 通过: $PASS"
echo "❌ 失败: $FAIL"
echo "总计: $((PASS + FAIL))"

if [ $FAIL -eq 0 ]; then
  echo ""
  echo "🎉 所有测试通过！"
  exit 0
else
  echo ""
  echo "⚠️  有 $FAIL 个测试失败"
  exit 1
fi
