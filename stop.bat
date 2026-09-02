@echo off
title Stop Luxe Nia Dev Server
echo ===================================================
echo     Stopping Luxe Nia Collections Dev Server
echo ===================================================
echo.
node scripts/stop.mjs
echo.
echo Done! All servers have been stopped.
timeout /t 3 >nul
