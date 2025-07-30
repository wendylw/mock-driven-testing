# Pure Component基准创建指南

## 概述

基准（Baseline）是Pure Component测试的核心，它记录了组件在稳定状态下的表现。后续的所有变更检测都是基于这个基准进行对比。

## 基准创建流程

### 1. 准备工作

#### 1.1 确保在develop分支
```bash
git checkout develop
git pull origin develop
```

#### 1.2 安装PCT工具
```bash
# 方式1：全局安装
npm install -g @mdt/pct-cli

# 方式2：项目内安装
npm install --save-dev @mdt/pct-cli
```

### 2. 创建基准快照

#### 2.1 扫描所有Pure Components
```bash
# 扫描并识别所有Pure Components
pct scan --path src/common/components --output pct-baseline/components.json

# 输出示例：
# ✔ Found 23 components
# ✔ 18 identified as Pure Components
# ✔ Component list saved to pct-baseline/components.json
```

#### 2.2 生成视觉快照
```bash
# 为每个组件生成所有props组合的快照
pct snapshot --components pct-baseline/components.json --output pct-baseline/snapshots

# 这个过程会：
# 1. 启动一个无头浏览器
# 2. 渲染每个组件的所有有意义的props组合
# 3. 截图并保存
```

#### 2.3 生成测试用例基准
```bash
# 基于组件生成测试用例
pct generate-tests --components pct-baseline/components.json --output pct-baseline/tests
```

### 3. 基准数据结构

创建完成后，基准目录结构如下：

```
pct-baseline/
├── metadata.json           # 基准元数据
├── components.json         # 组件清单
├── snapshots/             # 视觉快照
│   ├── Button/
│   │   ├── primary-normal.png
│   │   ├── primary-small.png
│   │   ├── primary-disabled.png
│   │   ├── secondary-normal.png
│   │   └── ...
│   ├── Input/
│   │   └── ...
│   └── Modal/
│       └── ...
├── tests/                 # 测试用例
│   ├── Button.test.js
│   ├── Input.test.js
│   └── ...
└── checksums.json         # 文件校验和
```

### 4. 基准元数据示例

**metadata.json:**
```json
{
  "version": "1.0.0",
  "createdAt": "2025-01-29T10:00:00Z",
  "branch": "develop",
  "commit": "a1b2c3d4e5f6",
  "components": {
    "total": 18,
    "byType": {
      "pure": 18,
      "stateful": 5,
      "excluded": 3
    }
  },
  "environment": {
    "node": "18.19.0",
    "pct": "1.0.0",
    "viewport": {
      "width": 1280,
      "height": 800
    }
  }
}
```

**components.json:**
```json
{
  "components": [
    {
      "name": "Button",
      "path": "src/common/components/Button/index.jsx",
      "type": "pure",
      "props": {
        "type": {
          "type": "enum",
          "values": ["primary", "secondary", "text"],
          "required": false,
          "default": "primary"
        },
        "size": {
          "type": "enum",
          "values": ["small", "normal"],
          "required": false,
          "default": "normal"
        },
        "disabled": {
          "type": "boolean",
          "required": false,
          "default": false
        },
        "loading": {
          "type": "boolean",
          "required": false,
          "default": false
        }
      },
      "testCombinations": [
        { "type": "primary", "size": "normal" },
        { "type": "primary", "size": "small" },
        { "type": "primary", "disabled": true },
        { "type": "primary", "loading": true },
        { "type": "secondary", "size": "normal" },
        { "type": "text", "size": "normal" }
      ]
    }
  ]
}
```

### 5. 基准管理策略

#### 5.1 版本控制
```bash
# 将基准提交到代码仓库
git add pct-baseline/
git commit -m "chore: create Pure Component baseline for develop branch"
git push origin develop
```

#### 5.2 基准更新时机

**需要更新基准的情况：**
1. **有意的全局样式更新**（如品牌色调整）
2. **框架升级**（如React版本升级）
3. **设计系统更新**
4. **定期更新**（如每个Sprint）

**更新命令：**
```bash
# 更新单个组件的基准
pct update-baseline --component Button

# 更新所有组件的基准
pct update-baseline --all

# 交互式更新（推荐）
pct update-baseline --interactive
# 会显示每个变化，让你选择是否接受
```

#### 5.3 基准分支策略

```bash
# 为不同的主分支维护不同的基准
pct-baseline-develop/    # develop分支的基准
pct-baseline-master/     # master分支的基准
pct-baseline-release/    # release分支的基准
```

### 6. CI中使用基准

#### 6.1 在GitHub Actions中
```yaml
- name: Download Baseline
  run: |
    # 基准已经在代码库中
    echo "Using baseline from pct-baseline/"
    
- name: Compare with Baseline
  run: |
    pct compare \
      --baseline pct-baseline/ \
      --current . \
      --output comparison-report.json
```

#### 6.2 基准缺失处理
```bash
# 如果基准不存在，自动创建
if [ ! -d "pct-baseline" ]; then
  echo "Baseline not found, creating..."
  pct create-baseline --auto
fi
```

### 7. 实际操作示例

#### 完整的基准创建脚本
```bash
#!/bin/bash
# scripts/create-pct-baseline.sh

echo "🚀 Creating Pure Component Baseline..."

# 1. 确保在正确的分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ]; then
  echo "❌ Error: Must be on develop branch"
  exit 1
fi

# 2. 确保代码是最新的
git pull origin develop

# 3. 安装依赖
npm install

# 4. 清理旧基准
rm -rf pct-baseline/

# 5. 创建新基准
echo "📸 Scanning components..."
npx pct scan \
  --path src/common/components \
  --exclude "**/*.test.{js,jsx,ts,tsx}" \
  --exclude "**/*.stories.{js,jsx,ts,tsx}" \
  --output pct-baseline/components.json

echo "📸 Creating snapshots..."
npx pct snapshot \
  --components pct-baseline/components.json \
  --viewport 1280x800 \
  --output pct-baseline/snapshots

echo "🧪 Generating test baselines..."
npx pct generate-tests \
  --components pct-baseline/components.json \
  --output pct-baseline/tests

echo "📝 Creating metadata..."
npx pct create-metadata \
  --output pct-baseline/metadata.json

echo "✅ Baseline created successfully!"

# 6. 显示摘要
npx pct baseline-summary pct-baseline/
```

### 8. 基准验证

#### 8.1 验证基准完整性
```bash
pct validate-baseline --path pct-baseline/

# 检查项：
# ✔ 所有组件都有快照
# ✔ 快照文件完整
# ✔ 元数据正确
# ✔ 校验和匹配
```

#### 8.2 基准对比报告
```bash
# 生成基准质量报告
pct baseline-report --path pct-baseline/ --output baseline-report.html

# 报告包含：
# - 组件覆盖率
# - Props组合覆盖率
# - 快照质量评分
# - 潜在问题提示
```

### 9. 最佳实践

1. **定期审查基准**
   - 每个Sprint结束时审查是否需要更新
   - 记录每次更新的原因

2. **基准变更审批**
   - 基准更新需要团队review
   - 在PR中说明更新原因

3. **自动化基准管理**
   ```yaml
   # .github/workflows/baseline-management.yml
   name: Baseline Management
   
   on:
     schedule:
       - cron: '0 0 * * 1'  # 每周一检查
     workflow_dispatch:
   
   jobs:
     check-baseline:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Check Baseline Health
           run: |
             npx pct baseline-health-check
             # 发送报告给团队
   ```

4. **基准备份**
   - 在更新前备份旧基准
   - 保留最近3个版本的基准

### 10. 故障排除

#### 常见问题

**Q: 基准创建失败**
```bash
# 检查环境
pct doctor

# 常见原因：
# - Node版本不匹配
# - 缺少浏览器依赖
# - 权限问题
```

**Q: 快照不一致**
```bash
# 使用Docker确保环境一致
docker run --rm \
  -v $(pwd):/app \
  mdt/pct-cli:latest \
  create-baseline
```

**Q: 基准太大**
```bash
# 优化基准大小
pct optimize-baseline \
  --compress-images \
  --remove-duplicates \
  --keep-essential-only
```

## 总结

基准是Pure Component测试的基石，需要：
1. 在稳定分支（develop）上创建
2. 包含完整的组件快照和测试
3. 定期维护和更新
4. 团队共同管理

通过良好的基准管理，可以确保组件变更的可控性和可追溯性。