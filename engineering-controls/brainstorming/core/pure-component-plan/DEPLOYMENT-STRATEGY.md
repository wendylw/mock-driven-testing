# PCT部署策略：GitHub Actions配置位置

## 核心问题：GitHub Actions应该放在哪里？

### 推荐方案：放在被测试的项目中

**原因：**
1. **紧密耦合**：组件检测与组件代码在同一仓库，便于维护
2. **权限简单**：不需要跨仓库权限配置
3. **触发自然**：PR和push事件直接触发，无需额外配置
4. **历史追踪**：组件变更和检测历史在同一个地方

## 具体实施方案

### 方案A：直接集成到BEEP项目（推荐）

```bash
# 在BEEP项目中
beep-v1-webapp/
├── .github/
│   └── workflows/
│       └── pure-component-check.yml  # 添加这个文件
├── src/
│   └── common/
│       └── components/
└── package.json
```

**优势：**
- ✅ 最简单直接
- ✅ 与代码变更同步
- ✅ 开发者容易发现和维护

**实施步骤：**
```yaml
# beep-v1-webapp/.github/workflows/pure-component-check.yml
name: Pure Component Check

on:
  pull_request:
    paths:
      - 'src/**/components/**'
      
jobs:
  pct-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run PCT Analysis
        run: |
          # 方式1：使用npm包
          npx @mdt/pct-cli analyze --base ${{ github.base_ref }}
          
          # 方式2：使用Docker镜像
          docker run --rm \
            -v ${{ github.workspace }}:/workspace \
            mdt/pct-analyzer:latest \
            analyze --base origin/${{ github.base_ref }}
```

### 方案B：集中式检测服务（备选）

```bash
# MDT项目作为中心服务
mock-driven-testing/
├── .github/
│   └── workflows/
│       └── pct-service.yml
├── pct-service/
│   ├── analyzer/
│   └── reporter/
└── docker-compose.yml
```

**触发方式：**
```yaml
# beep-v1-webapp/.github/workflows/trigger-pct.yml
name: Trigger PCT Analysis

on:
  pull_request:
    paths:
      - 'src/**/components/**'

jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger MDT PCT Service
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.PCT_SERVICE_TOKEN }}
          repository: your-org/mock-driven-testing
          event-type: analyze-components
          client-payload: |
            {
              "repository": "${{ github.repository }}",
              "pr_number": "${{ github.event.pull_request.number }}",
              "base_ref": "${{ github.base_ref }}",
              "head_ref": "${{ github.head_ref }}"
            }
```

### 方案C：GitHub App（长期方案）

```typescript
// MDT作为GitHub App提供服务
export class PCTGitHubApp {
  async handlePullRequest(event: PullRequestEvent) {
    if (this.hasComponentChanges(event)) {
      const analysis = await this.analyzeComponents({
        repo: event.repository,
        base: event.pull_request.base.sha,
        head: event.pull_request.head.sha
      });
      
      await this.postComment(event.pull_request, analysis);
      await this.updateCheckRun(event.pull_request, analysis);
    }
  }
}
```

## 推荐的渐进式实施路径

### 第一步：最小化集成（第1-2周）

在BEEP项目中添加简单的workflow：

```yaml
# beep-v1-webapp/.github/workflows/pct-notify.yml
name: Component Change Notification

on:
  pull_request:
    paths:
      - 'src/common/components/**/*.jsx'
      - 'src/common/components/**/*.tsx'

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Detect Component Changes
        run: |
          echo "## 🔔 Component Changes Detected" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "The following components were modified:" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          
          # 列出变更的组件文件
          git diff --name-only origin/${{ github.base_ref }}..HEAD | \
            grep -E "src/common/components/.*\.(jsx|tsx)$" | \
            while read file; do
              echo "- \`$file\`" >> $GITHUB_STEP_SUMMARY
            done
            
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "💡 Component analysis will be available soon!" >> $GITHUB_STEP_SUMMARY
```

### 第二步：集成PCT工具（第3-4周）

```yaml
# 更新workflow使用实际的PCT工具
- name: Install PCT CLI
  run: |
    # 方案1：从npm私有仓库安装
    npm config set @mdt:registry https://npm.your-company.com
    npm install -g @mdt/pct-cli
    
    # 方案2：直接从GitHub安装
    npm install -g github:your-org/mock-driven-testing#pct-cli
    
    # 方案3：使用预构建的二进制
    curl -L https://github.com/your-org/mdt/releases/latest/download/pct-linux-x64 -o /usr/local/bin/pct
    chmod +x /usr/local/bin/pct
    
- name: Run Analysis
  run: pct analyze --config .pctrc.json
```

### 第三步：完善功能（第5-8周）

逐步添加更多功能：
- 视觉对比
- 破坏性变更检测
- 自动生成报告
- 集成审批流程

## PCT工具的分发策略

### 1. NPM包（推荐）
```json
// package.json
{
  "name": "@mdt/pct-cli",
  "version": "1.0.0",
  "bin": {
    "pct": "./dist/cli.js"
  }
}
```

### 2. Docker镜像
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
ENTRYPOINT ["node", "dist/cli.js"]
```

### 3. GitHub Release二进制
```yaml
# 在MDT项目的release workflow中
- name: Build Binaries
  run: |
    npm run build:binary
    # 生成 pct-linux-x64, pct-darwin-x64, pct-win-x64.exe
```

## 配置文件位置

### 在被测试项目中的配置
```bash
beep-v1-webapp/
├── .github/
│   └── workflows/
│       └── pure-component-check.yml
├── .pctrc.json                    # PCT配置文件
└── pct-baseline/                  # 基准快照（可选）
```

**.pctrc.json示例：**
```json
{
  "components": {
    "include": [
      "src/common/components/**/*.{jsx,tsx}",
      "src/features/**/components/**/*.{jsx,tsx}"
    ],
    "exclude": [
      "**/*.test.{jsx,tsx}",
      "**/*.stories.{jsx,tsx}"
    ]
  },
  "analysis": {
    "base": "develop",
    "breakingChangeThreshold": 0.1,
    "visualDiffThreshold": 0.05
  },
  "reporting": {
    "format": ["json", "markdown"],
    "artifacts": true
  }
}
```

## 决策矩阵

| 因素 | 方案A（被测试项目中） | 方案B（MDT集中式） | 方案C（GitHub App） |
|-----|---------------------|-------------------|-------------------|
| 实施难度 | ⭐ 简单 | ⭐⭐ 中等 | ⭐⭐⭐ 复杂 |
| 维护成本 | ⭐ 低 | ⭐⭐ 中等 | ⭐⭐ 中等 |
| 扩展性 | ⭐⭐ 中等 | ⭐⭐⭐ 高 | ⭐⭐⭐ 高 |
| 响应速度 | ⭐⭐⭐ 快 | ⭐⭐ 中等 | ⭐⭐ 中等 |
| 权限管理 | ⭐⭐⭐ 简单 | ⭐⭐ 需要配置 | ⭐ 复杂 |

## 最终建议

**短期（1-3个月）：**
- 采用方案A，在被测试项目中直接添加GitHub Actions
- PCT工具通过npm包或Docker镜像分发
- 配置文件放在被测试项目根目录

**长期（6个月+）：**
- 评估是否需要升级到集中式服务或GitHub App
- 基于实际使用情况和团队反馈决定

这样的策略确保了：
1. ✅ 快速开始，低成本验证
2. ✅ 与现有开发流程无缝集成
3. ✅ 保留未来升级的灵活性