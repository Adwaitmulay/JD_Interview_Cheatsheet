@echo off
setlocal
cd /d D:\JD_Interview_Cheatsheet

REM Keep model weights, temporary files, and pip downloads off the low-space C: drive.
set HF_HOME=D:\HF_CACHE
set HF_HUB_CACHE=D:\HF_CACHE\hub
set HUGGINGFACE_HUB_CACHE=D:\HF_CACHE\hub
set TRANSFORMERS_CACHE=D:\HF_CACHE\transformers
set TEMP=D:\TEMP
set TMP=D:\TEMP
set TMPDIR=D:\TEMP
set PIP_CACHE_DIR=D:\PIP_CACHE

if not exist "D:\HF_CACHE" mkdir "D:\HF_CACHE"
if not exist "D:\TEMP" mkdir "D:\TEMP"
if not exist "D:\PIP_CACHE" mkdir "D:\PIP_CACHE"

if not exist "D:\Miniconda3\envs\pasta\python.exe" (
  echo ERROR: Base Python not found at D:\Miniconda3\envs\pasta\python.exe
  exit /b 1
)

if not exist "sd-turbo-env\Scripts\python.exe" (
  echo Creating clean SD-Turbo environment...
  "D:\Miniconda3\envs\pasta\python.exe" -m venv sd-turbo-env
  if errorlevel 1 exit /b 1
)

set PY=sd-turbo-env\Scripts\python.exe

%PY% -c "import torch, diffusers, transformers, accelerate, safetensors, PIL, numpy" >nul 2>nul
if errorlevel 1 (
  echo Installing SD-Turbo dependencies into the dedicated environment...
  %PY% -m pip install --cache-dir D:\PIP_CACHE --upgrade pip
  if errorlevel 1 exit /b 1
  %PY% -m pip install --cache-dir D:\PIP_CACHE "numpy==1.26.4" "torch==2.6.0" --index-url https://download.pytorch.org/whl/cu124
  if errorlevel 1 exit /b 1
  %PY% -m pip install --cache-dir D:\PIP_CACHE "diffusers==0.37.1" "transformers==4.57.6" "accelerate==1.15.0" "safetensors==0.8.0" "pillow"
  if errorlevel 1 exit /b 1
)

echo.
echo SD-Turbo environment ready. Cache: D:\HF_CACHE
%PY% local-image-engine\test_sd_turbo.py
endlocal
