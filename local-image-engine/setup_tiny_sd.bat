@echo off
setlocal
cd /d D:\JD_Interview_Cheatsheet

if not exist "D:\Miniconda3\envs\pasta\python.exe" (
  echo ERROR: Base Python not found at D:\Miniconda3\envs\pasta\python.exe
  exit /b 1
)

if not exist "tiny-sd-env\Scripts\python.exe" (
  echo Creating clean Tiny-SD environment...
  "D:\Miniconda3\envs\pasta\python.exe" -m venv tiny-sd-env
  if errorlevel 1 exit /b 1
)

call tiny-sd-env\Scripts\activate.bat
python -m pip install --upgrade pip
python -m pip install "numpy==1.26.4" "torch==2.5.1" --index-url https://download.pytorch.org/whl/cu124
python -m pip install "diffusers==0.37.1" "transformers==4.57.6" "accelerate==1.15.0" "safetensors==0.8.0"
if errorlevel 1 exit /b 1

echo.
echo Tiny-SD environment ready.
python local-image-engine\test_tiny_sd.py
endlocal
