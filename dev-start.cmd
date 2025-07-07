@echo off
title Night Dev Environment Starter

echo 启动 Redis...
start cmd /k "redis-server"

timeout /t 2

echo 启动 Bun 后端...
start cmd /k "cd lumin-server && yarn dev"

echo 启动 Vite 前端...
start cmd /k "cd lumin-client && yarn dev"

echo 所有服务已启动！请检查各终端窗口 🐾
pause
