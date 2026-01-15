#!/bin/bash
# 启动带远程调试端口的 Chrome（CDP）
# 如果 Chrome 已在运行，会先关闭再重启

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=9222
DATA_DIR="$HOME/.chrome-debug-profile"

if pgrep -x "Google Chrome" > /dev/null; then
  echo "🔄 Chrome 正在运行，正在关闭..."
  osascript -e 'quit app "Google Chrome"'
  sleep 2
fi

echo "🚀 启动 Chrome (CDP port: $PORT)"
"$CHROME" --remote-debugging-port=$PORT --user-data-dir="$DATA_DIR" "$@"
