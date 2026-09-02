@echo off
title Deploy LUXE NIA to Vercel
cls
echo ========================================================
echo   LUXE NIA - Production Deployment to Vercel
echo ========================================================
echo.
echo 1. Building production bundle...
call npm run build
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Build failed. Please fix build errors before deploying.
  pause
  exit /b %errorlevel%
)

echo.
echo 2. Uploading to Vercel Production...
call npx vercel --prod
if %errorlevel% neq 0 (
  echo.
  echo [NOTE] If you received a "Not authorized" message, please run:
  echo        npx vercel login
  echo        and then re-run deploy.bat.
) else (
  echo.
  echo ========================================================
  echo   Deployment Complete! Live at: https://luxenia.vercel.app
  echo ========================================================
)
echo.
pause
