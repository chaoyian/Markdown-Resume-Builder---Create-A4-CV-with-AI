#!/bin/zsh

set -e
cd "$(dirname "$0")/.."

if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js 18+ is required / 请先安装 Node.js 18 或更高版本"
  echo "https://nodejs.org/"
  echo
  read -k 1 "REPLY?Press any key to close / 按任意键关闭..."
  echo
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies / 正在安装依赖..."
  npm install
fi

if [[ ! -f resume.md ]]; then
  echo
  read "language?Choose template [zh/en] (default: zh): "
  if [[ "$language" == "en" ]]; then
    npm run init:en
  else
    npm run init:zh
  fi

  echo
  echo "resume.md created. Edit it, then run this file again."
  echo "已创建 resume.md。编辑保存后，请再次运行本文件。"
  read -k 1 "REPLY?Press any key to close / 按任意键关闭..."
  echo
  exit 0
fi

npm run export

echo
read -k 1 "REPLY?Press any key to close / 按任意键关闭..."
echo
