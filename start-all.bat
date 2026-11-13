@echo off
title Campus Stay - Quick Launcher
echo ======================================================================
echo  CAMPUS STAY - Launching Full-Stack Services
echo ======================================================================
echo Launching Spring Boot Backend...
start "Campus Stay - Backend (Port 8080)" "%~dp0start-backend.bat"
timeout /t 3 /nobreak >nul
echo Launching React Frontend...
start "Campus Stay - Frontend (Port 5173)" "%~dp0start-frontend.bat"
echo.
echo Both services have been launched in separate terminal windows!
echo  - Frontend: http://localhost:5173
echo  - Backend:  http://localhost:8080
echo.
pause

