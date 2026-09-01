#!/bin/zsh

exec "$(dirname "$0")/../launchers/launch-resume.command"

echo
read -k 1 "REPLY?Press any key to close / 按任意键关闭..."
echo
