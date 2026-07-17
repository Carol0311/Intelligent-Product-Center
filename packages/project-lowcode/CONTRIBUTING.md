# 贡献指南

感谢您考虑为这个项目做贡献！

## 如何贡献

### 报告 Bug

1. 确认bug还没有被报告
2. 使用issue模板创建新issue
3. 提供重现步骤和环境信息

### 提交代码

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范

- 使用 Prettier 格式化代码
- 编写有意义的提交信息
- 为新功能添加测试
  EOF

# .github/ 目录结构

mkdir -p .github/{ISSUE_TEMPLATE,workflows,PULL_REQUEST_TEMPLATE}

# Issue 模板

## cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'

name: Bug报告
about: 创建一个bug报告帮助我们改进
title: '[BUG] '
labels: bug
assignees: ''

---

**描述bug**
清晰简洁地描述bug是什么

**重现步骤**

1. 去到 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**期望行为**
清晰简洁地描述你期望发生什么

**截图**
如果适用，添加截图帮助解释你的问题

**环境信息：**

- OS: [e.g. Windows 10]
- 浏览器: [e.g. Chrome 120]
- 版本: [e.g. 1.0.0]

**附加信息**
添加关于问题的任何其他信息
