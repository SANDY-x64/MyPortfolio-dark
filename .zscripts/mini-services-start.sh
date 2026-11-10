#!/bin/sh

DIST_DIR="./mini-services-dist"

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
}

main() {
    echo "🚀 开始启动所有 mini services..."
    
    if [ ! -d "$DIST_DIR" ]; then
        echo "ℹ️  目录 $DIST_DIR 不存在"
        return
    fi
    
    service_files=""
    for file in "$DIST_DIR"/mini-service-*.js; do
        if [ -f "$file" ]; then
            if [ -z "$service_files" ]; then
                service_files="$file"
            else
                service_files="$service_files $file"
            fi
        fi
    done
    
    service_count=0
    for file in $service_files; do
        service_count=$((service_count + 1))
    done
    
    if [ $service_count -eq 0 ]; then
        echo "ℹ️  未找到任何 mini service 文件"
        return
    fi
    
    echo "📦 找到 $service_count 个服务，开始启动..."
    echo ""
    
    for file in $service_files; do
        service_name=$(basename "$file" .js | sed 's/mini-service-//')
        echo "▶️  启动服务: $service_name..."
        
        bun "$file" &
        pid=$!
        if [ -z "$pids" ]; then
            pids="$pid"
        else
            pids="$pids $pid"
        fi
        
        sleep 0.5
        if ! kill -0 "$pid" 2>/dev/null; then
            echo "❌ $service_name 启动失败"
            pids=$(echo "$pids" | sed "s/\b$pid\b//" | sed 's/  */ /g' | sed 's/^ *//' | sed 's/ *$//')
        else
            echo "✅ $service_name 已启动 (PID: $pid)"
        fi
    done
    
    running_count=0
    for pid in $pids; do
        if kill -0 "$pid" 2>/dev/null; then
            running_count=$((running_count + 1))
        fi
    done
    
    echo ""
    echo "🎉 所有服务已启动！共 $running_count 个服务正在运行"
    echo ""
    echo "💡 按 Ctrl+C 停止所有服务"
    echo ""
    
    wait
}

main

