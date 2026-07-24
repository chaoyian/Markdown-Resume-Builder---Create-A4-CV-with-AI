# Marp A4 Resume Toolkit

[![CI](https://github.com/chaoyian/marp-a4-resume-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/chaoyian/marp-a4-resume-toolkit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-339933.svg)](https://nodejs.org/)

[English](README.en.md) | 简体中文

基于 Marp 的双语 A4 简历工具包。使用 Markdown 维护内容，通过固定版本的 Marp CLI 生成排版稳定的 PDF，这是一个基于Marp来构建简单CV的尝试，优势是AI可以很好的访问并使用，本项目已经提供了一个主题包，如案例图片所展示的，可通过修改主题包进行自定义、可通过编辑md文档来制作自己的简历，使用者可以克隆到本地，然后直接使用终端Agent进行访问使用修改。

![中文简历模板预览](docs/assets/resume.zh-CN.png)

## 功能

- 标准 A4 PDF
- 中文与英文模板
- 本地固定版本的 Marp CLI
- 命令行与 macOS 双击导出
- “用途 + 时间戳”文件命名
- 支持单页和手动分页
- 默认不跟踪个人简历和生成文件

## 环境要求

- Node.js 18 或更高版本
- npm
- Chrome 或 Chromium

VS Code 和 Marp for VS Code 插件仅用于可选预览。

## 安装

```bash
git clone https://github.com/chaoyian/marp-a4-resume-toolkit.git
cd marp-a4-resume-toolkit
npm install
```

## 创建简历

中文：

```bash
npm run init:zh
```

英文：

```bash
npm run init:en
```

命令会从公开模板创建本地 `resume.md`，不会覆盖已存在的文件。编辑并保存 `resume.md` 后执行：

```bash
npm run build
```

生成结果位于：

```text
output/pdf/resume.pdf
```

## 交互式导出

```bash
npm run export
```

输入用途后会生成类似：

```text
output/pdf/investment-internship_2026-07-23_19-30-00.pdf
```

macOS 也可以双击：

```text
scripts/export-resume.command
```

## 示例与预览

```bash
npm run build:zh        # 中文示例 PDF
npm run build:en        # 英文示例 PDF
npm run build:examples  # 两个示例
npm run preview         # 预览本地 resume.md
npm run preview:zh      # 预览中文示例
npm run preview:en      # 预览英文示例
```

## 检查项目

```bash
npm run check
```

该命令检查项目结构、A4 主题、示例配置和本地文件边界，并生成两份示例 PDF。

## 文档

- [架构与依赖](docs/ARCHITECTURE.md)
- [隐私设计](docs/PRIVACY.md)

项目结构、脚本和文档经过 AI 辅助重构，并由人工复核。

## License

[MIT](LICENSE)
