@echo off
title Luxe Nia Collections Dev Server
echo ===================================================
echo     Launching Luxe Nia Collections Storefront
echo ===================================================
echo.
echo Starting Vite Development Server...
echo The website will open in Microsoft Edge at: http://localhost:5173/
echo.
echo Press Ctrl+C anytime to stop, or run stop.bat in another window.
echo.

start msedge http://localhost:5173/
npm run dev
