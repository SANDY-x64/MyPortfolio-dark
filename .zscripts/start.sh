#!/bin/sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$SCRIPT_DIR"

pids=""

cleanup() {
    echo ""
    echo "🛑 正在关闭所有服务..."
    
    for pid in $pids; do
        if kill -0 "$pid" 2>/dev/null; then
            service_name=$(ps -p "$pid" -o comm= 2>/dev/null || echo "unknown")
            echo "   关闭进程 $pid ($service_name)..."
            kill -TERM "$pid" 2>/dev/null
        fi
    done
    
    sleep 1
    for pid in $pids; do
        if kill -0 "$pid" 2>/dev/null; then
            timeout=4
            while [ $timeout -gt 0 ] && kill -0 "$pid" 2>/dev/null; do
                sleep 1
                timeout=$((timeout - 1))
            done
            if kill -0 "$pid" 2>/dev/null; then
                echo "   强制关闭进程 $pid..."
                kill -KILL "$pid" 2>/dev/null
            fi
        fi
    done
    
    echo "✅ 所有服务已关闭"
    exit 0
}

echo "🚀 开始启动所有服务..."
echo ""

cd "$BUILD_DIR" || exit 1

ls -lah

DEFAULT_PACKAGED_DB_PATH="/app/db/custom.db"
DEFAULT_PACKAGED_DATABASE_URL="file:$DEFAULT_PACKAGED_DB_PATH"

if [ -d "/app/python-runtime/site-packages" ]; then
    export PYTHONPATH="/app/python-runtime/site-packages:/app/next-service-dist${PYTHONPATH:+:$PYTHONPATH}"
    export PATH="/app/python-runtime/site-packages/bin:$PATH"
    export PYTHONDONTWRITEBYTECODE=1
    export PYTHONUNBUFFERED=1
    echo "🐍 已启用部署包内 Python runtime: $(python --version 2>&1)"
fi

if [ -f "./next-service-dist/server.js" ]; then
    echo "🚀 启动 Next.js 服务器..."
    cd next-service-dist/ || exit 1
    
    export NODE_ENV=production
    export PORT="${PORT:-3000}"
    export HOSTNAME="${HOSTNAME:-0.0.0.0}"
    export DATABASE_URL="${DATABASE_URL:-$DEFAULT_PACKAGED_DATABASE_URL}"

    if [ "$DATABASE_URL" = "$DEFAULT_PACKAGED_DATABASE_URL" ]; then
        if [ ! -f "$DEFAULT_PACKAGED_DB_PATH" ]; then
            echo "❌ 未找到打包后的数据库文件 $DEFAULT_PACKAGED_DB_PATH"
            echo "   为避免生产环境启动到空数据库，启动已终止"
            exit 1
        fi

        echo "🗄️  当前使用打包数据库: $DEFAULT_PACKAGED_DB_PATH"
    else
        echo "🗄️  当前使用外部指定数据库: $DATABASE_URL"
    fi
    
    bun server.js &
    NEXT_PID=$!
    pids="$NEXT_PID"
    
    sleep 1
    if ! kill -0 "$NEXT_PID" 2>/dev/null; then
        echo "❌ Next.js 服务器启动失败"
        exit 1
    else
        echo "✅ Next.js 服务器已启动 (PID: $NEXT_PID, Port: $PORT)"
    fi
    
    cd ../
else
    echo "⚠️  未找到 Next.js 服务器文件: ./next-service-dist/server.js"
fi

if [ -f "./mini-services-start.sh" ]; then
    echo "🚀 启动 mini-services..."
    
    sh ./mini-services-start.sh &
    MINI_PID=$!
    pids="$pids $MINI_PID"
    
    sleep 1
    if ! kill -0 "$MINI_PID" 2>/dev/null; then
        echo "⚠️  mini-services 可能启动失败，但继续运行..."
    else
        echo "✅ mini-services 已启动 (PID: $MINI_PID)"
    fi
elif [ -d "./mini-services-dist" ]; then
    echo "⚠️  未找到 mini-services 启动脚本，但目录存在"
else
    echo "ℹ️  mini-services 目录不存在，跳过"
fi

echo "🚀 启动 Caddy..."

echo "✅ Caddy 已启动（前台运行）"
echo ""
echo "🎉 所有服务已启动！"
echo ""
echo "💡 按 Ctrl+C 停止所有服务"
echo ""

exec caddy run --config Caddyfile --adapter caddyfile
