#!/bin/bash

echo "🚀 开始部署博客..."

# 添加所有更改
git add .

# 获取提交信息（如果没有提供参数）
if [ -z "$1" ]; then
    commit_msg="更新博客: $(date '+%Y-%m-%d %H:%M:%S')"
else
    commit_msg="$1"
fi

# 提交
git commit -m "$commit_msg"

# 推送到 GitHub
git push origin main

echo "✅ 博客已更新！"
echo "🌐 访问地址：https://graah-lhuu.github.io"
