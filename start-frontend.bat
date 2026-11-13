@echo off
title Campus Stay - React Frontend
cd /d "%~dp0frontend"
echo ======================================================================
echo  CAMPUS STAY - React Vite Frontend
echo  Port: 5173 | URL: http://localhost:5173
echo ======================================================================
call npm.cmd run dev
pause

