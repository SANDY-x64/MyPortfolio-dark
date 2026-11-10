#!/bin/bash

ROOT_DIR="/home/z/my-project/mini-services"
DIST_DIR="/tmp/build_fullstack_$BUILD_ID/mini-services-dist"

main() {
    echo "🚀 开始批量构建..."
    
    if [ ! -d "$ROOT_DIR" ]; then
        echo "ℹ️  目录 $ROOT_DIR 不存在，跳过构建"
        return
    fi
    
    mkdir -p "$DIST_DIR"
    
    success_count=0
    fail_count=0
    
    for dir in "$ROOT_DIR"/*; do
        if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
            project_name=$(basename "$dir")
            
            entry_path=""
            for entry in "src/index.ts" "index.ts" "src/index.js" "index.js"; do
                if [ -f "$dir/$entry" ]; then
                    entry_path="$dir/$entry"
                    break
                fi
            done
            
            if [ -z "$entry_path" ]; then
                echo "⚠️  跳过 $project_name: 未找到入口文件 (index.ts/js)"
                continue
            fi
            
            echo ""
            echo "📦 正在构建: $project_name..."
            
            output_file="$DIST_DIR/mini-service-$project_name.js"
            
            if bun build "$entry_path" \
                --outfile "$output_file" \
                --target bun \
                --minify; then
                echo "✅ $project_name 构建成功 -> $output_file"
                success_count=$((success_count + 1))
            else
                echo "❌ $project_name 构建失败"
                fail_count=$((fail_count + 1))
            fi
        fi
    done
    
    if [ -f ./.zscripts/mini-services-start.sh ]; then
        cp ./.zscripts/mini-services-start.sh "$DIST_DIR/mini-services-start.sh"
        chmod +x "$DIST_DIR/mini-services-start.sh"
    fi
    
    echo ""
    echo "🎉 所有任务完成！"
    if [ $success_count -gt 0 ] || [ $fail_count -gt 0 ]; then
        echo "✅ 成功: $success_count 个"
        if [ $fail_count -gt 0 ]; then
            echo "❌ 失败: $fail_count 个"
        fi
    fi
}

main

