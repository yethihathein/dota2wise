@echo off
title Dota 2 Dark Encyclopedia - GitHub Publisher
color 0b
echo ============================================================
echo   DOTA 2 DARK ENCYCLOPEDIA - PUBLISH TO GITHUB
echo ============================================================
echo.

set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
if not exist "%GIT_CMD%" set "GIT_CMD=git"

echo 1. Staging and committing changes...
"%GIT_CMD%" add .
"%GIT_CMD%" commit -m "feat: deploy Dota 2 Dark Encyclopedia to GitHub Pages" >nul 2>&1

echo.
echo 2. Checking remote repository...
"%GIT_CMD%" remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Please enter your GitHub repository URL:
    echo (Example: https://github.com/yethihathein/dota2-encyclopedia.git)
    echo.
    set /p REPO_URL="Repository URL: "
    if not "%REPO_URL%"=="" (
        "%GIT_CMD%" remote add origin "%REPO_URL%"
        "%GIT_CMD%" branch -M main
        echo.
        echo Pushing to GitHub...
        "%GIT_CMD%" push -u origin main
    )
) else (
    echo Pushing to GitHub...
    "%GIT_CMD%" push -u origin main
)

echo.
if %errorlevel% equ 0 (
    color 0a
    echo ============================================================
    echo   SUCCESS! Your Dota 2 Encyclopedia is published on GitHub!
    echo ============================================================
) else (
    echo Notice: If a browser window opened, please click Authorize.
)
echo.
pause
