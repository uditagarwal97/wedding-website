@echo off
title Wedding Website - Udit & Gunjan
echo Starting local web server...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8080
pause
