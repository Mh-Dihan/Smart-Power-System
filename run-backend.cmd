@echo off
cd /d "%~dp0src\server"
set FLASK_DEBUG=false
python run.py
