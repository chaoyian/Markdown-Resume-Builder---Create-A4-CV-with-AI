# Marp A4 Resume Toolkit

[English](README.en.md) | 简体中文

一个隐私友好、双语、可复现的 A4 简历工具包。使用 Markdown 编写内容、Marp 负责排版，并通过项目内固定版本的 Marp CLI 生成 PDF；VS Code 仅作为可选编辑器，不参与最终构建。

> **AI 使用声明：** 本项目的目录结构、构建脚本、文档和部分样式经过 AI 辅助重构，并由人工检查。简历内容及最终输出仍应由使用者自行核验。

## 特性

- 标准 A4 纸张尺寸，不依赖 VS Code 导出
- 脱敏的中文与英文简历示例
- 项目内固定 Marp CLI 版本，避免不同设备产生明显排版差异
- 双击生成或命令行生成两种方式
- 自动使用“用途 + 时间戳”命名个人 PDF
- 默认隔离个人简历、历史文件和生成结果，降低误传 GitHub 的风险
- MIT 开源，适合学习、个人简历维护与日常办公自动化

## 隐私模型

本项目将“可公开模板”和“本地个人资料”分开：

| 路径 | 用途 | 是否进入 Git |
| --- | --- | --- |
| `examples/resume.zh-CN.md` | 脱敏中文示例 | 是 |
| `examples/resume.en.md` | 脱敏英文示例 | 是 |
| `resume.md` | 你的真实简历 | **否** |
| `archive/` | 历史稿与旧 PDF | **否** |
| `output/`、`*.pdf` | 生成结果 | **否** |
| `.marp/cv.css` | A4 主题 | 是 |

`.gitignore` 能阻止常规的 `git add` 收录私密文件，但它不是加密工具。不要使用 `git add -f resume.md` 强制上传，也不要把真实信息复制到公开示例或 README。

构建配置启用了 `allowLocalFiles`，以便简历引用本地头像或图片。这意味着只应构建自己信任的 Markdown，不要直接运行来源不明的简历文件。

发布前可运行：

```bash
git status --short --ignored
git check-ignore -v resume.md archive output
```

## 环境依赖

| 依赖 | 要求 | 作用 |
| --- | --- | --- |
| Node.js | 18 或更高版本 | 运行构建工具 |
| npm | 随 Node.js 安装 | 安装锁定依赖、执行脚本 |
| `@marp-team/marp-cli` | 由 `package-lock.json` 固定 | 将 Markdown 渲染为 PDF |
| Chrome / Chromium | Marp CLI 自动调用可用浏览器 | 执行 PDF 打印 |
| 中文字体 | 建议 PingFang SC、Noto Sans SC 或微软雅黑 | 保证中文显示一致 |
| VS Code + Marp 插件 | 可选 | 编辑时预览，不负责最终 PDF |

不需要全局安装 Marp。运行 `npm install` 后，项目会使用本地 `node_modules` 中的固定版本。

## 快速开始

### macOS 双击方式

1. 安装 Node.js 18 或更高版本。
2. 双击 `生成简历.command`。
3. 第一次运行会安装依赖，并从中文示例创建本地 `resume.md`。
4. 编辑 `resume.md` 后再次双击。
5. 输入用途，例如“投研实习”。
6. PDF 会以 `投研实习_2026-07-23_18-25-30.pdf` 的形式保存到 `output/pdf/` 并自动打开。

`resume.md` 已被 Git 忽略，可以一直作为本地真实简历使用。

### 命令行方式

```bash
npm install
cp examples/resume.zh-CN.md resume.md
npm run build
```

输出文件：

```text
output/pdf/resume.pdf
```

如果本地已经存在真实的 `resume.md`，不要执行复制命令，以免覆盖。

## 中英文示例

直接生成脱敏示例：

```bash
npm run build:zh
npm run build:en
```

一次生成两种语言：

```bash
npm run build:examples
```

使用英文模板创建本地个人版本：

```bash
cp examples/resume.en.md resume.md
npm run build
```

## 可用命令

| 命令 | 作用 |
| --- | --- |
| `npm run build` | 生成本地私密 `resume.md` |
| `npm run build:zh` | 生成脱敏中文示例 |
| `npm run build:en` | 生成脱敏英文示例 |
| `npm run build:examples` | 同时生成两个脱敏示例 |
| `npm run preview` | 预览本地私密简历 |
| `npm run preview:zh` | 预览中文示例 |
| `npm run preview:en` | 预览英文示例 |
| `npm run watch` | 监听本地简历改动并重新生成 |

## 构建关系

```text
Markdown 内容
  + .marp/cv.css（A4 主题）
  + package-lock.json（固定 Marp CLI 版本）
  + Chrome / Chromium（PDF 打印）
  -> output/pdf/*.pdf
```

`.vscode/settings.json` 只让 Marp for VS Code 识别同一份主题。删除 `.vscode/` 后，命令行构建仍然可以正常工作。

## A4 与分页

主题通过 Marp Core 元数据定义标准 A4：

```css
/**
 * @theme cv
 * @size A4 210mm 297mm
 */
```

Markdown front matter 使用：

```yaml
marp: true
theme: cv
size: A4
```

Marp 不会像 Word 一样根据内容溢出自动续页。正文中单独一行的 `---` 代表强制换页。请在每次调整内容后检查生成的 PDF，避免页面底部裁切。

## 项目结构

```text
.
├── .marp/cv.css             # A4 主题
├── .vscode/settings.json    # 可选 VS Code 预览配置
├── examples/
│   ├── resume.zh-CN.md      # 脱敏中文模板
│   └── resume.en.md         # 脱敏英文模板
├── README.md                # 中文文档
├── README.en.md             # English documentation
├── LICENSE                  # MIT License
├── package.json
├── package-lock.json
└── 生成简历.command          # macOS 双击生成器
```

本地使用后还会出现 `resume.md`、`archive/` 和 `output/`；这些路径不会进入 Git。

## 自定义

- 修改字体、字号、间距和颜色：编辑 `.marp/cv.css`
- 修改简历内容：编辑本地 `resume.md`
- 增加新页面：在 Markdown 正文中插入独立的 `---`
- 调整页面尺寸：修改主题的 `@size`，并同步修改 front matter 的 `size`

## 开源与使用范围

本项目采用 [MIT License](LICENSE)，可自由用于学习、个人项目与办公效率工具。使用者应自行检查简历事实、隐私信息、字体授权及最终 PDF 排版。
