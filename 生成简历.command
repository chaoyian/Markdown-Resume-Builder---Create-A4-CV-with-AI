#!/bin/zsh

set -e
cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  echo "未找到 Node.js。请先安装 Node.js 18 或更高版本。"
  echo "下载地址：https://nodejs.org/"
  echo
  read -k 1 "REPLY?按任意键关闭..."
  echo
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "第一次使用，正在安装简历生成工具..."
  npm install
fi

if [[ ! -f resume.md ]]; then
  cp "examples/resume.zh-CN.md" "resume.md"
  echo "未检测到个人简历，已从脱敏中文模板创建 resume.md。"
  echo "请先编辑 resume.md，再重新双击本文件。"
  echo
  read -k 1 "REPLY?按任意键关闭..."
  echo
  exit 0
fi

echo
read "purpose?请输入这份简历的用途（例如：投研实习）："

if [[ -z "${purpose//[[:space:]]/}" ]]; then
  purpose="简历"
fi

safe_purpose="$(printf "%s" "$purpose" | tr '/:\\' '---' | sed -E 's/[[:space:]]+/_/g; s/^_+//; s/_+$//')"
if [[ -z "$safe_purpose" ]]; then
  safe_purpose="简历"
fi

timestamp="$(date '+%Y-%m-%d_%H-%M-%S')"
output_file="output/pdf/${safe_purpose}_${timestamp}.pdf"

echo "正在生成 A4 PDF..."
mkdir -p "output/pdf"
./node_modules/.bin/marp resume.md --pdf --output "$output_file"

echo
echo "生成成功：${output_file}"
open "$output_file"

echo
read -k 1 "REPLY?PDF 已自动打开，按任意键关闭这个窗口..."
echo
