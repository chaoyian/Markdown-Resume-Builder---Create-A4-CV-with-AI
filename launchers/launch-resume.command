#!/bin/zsh

script_dir="$(cd "$(dirname "$0")" && pwd)"
if [[ -f "$script_dir/package.json" ]]; then
  project_root="$script_dir"
else
  project_root="$(cd "$script_dir/.." && pwd)"
fi

if [[ -x "$project_root/runtime/node" ]]; then
  node_bin="$project_root/runtime/node"
elif command -v node >/dev/null 2>&1; then
  node_bin="$(command -v node)"
else
  echo "Node.js runtime is missing. / 缺少 Node.js 运行环境。"
  echo "Please download the macOS release package again."
  read -k 1 "REPLY?Press any key to close / 按任意键关闭..."
  echo
  exit 1
fi

cd "$project_root" || exit 1
"$node_bin" "$project_root/src/export-interactive.mjs"
export_status=$?

if [[ $export_status -ne 0 ]]; then
  echo "Export failed; the error is shown above. / 导出失败，错误信息见上方。"
fi

echo
read -k 1 "REPLY?Press any key to close / 按任意键关闭..."
echo
exit $export_status
