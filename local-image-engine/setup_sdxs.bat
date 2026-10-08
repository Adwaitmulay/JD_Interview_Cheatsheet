@echo off
setlocal

set "ROOT=%~dp0"
set "PY=%ROOT%sdxs-env\Scripts\python.exe"

if not exist "%PY%" (
  echo Creating clean SDXS environment...
  D:\Miniconda3\envs\pasta\python.exe -m venv "%ROOT%sdxs-env"
  if errorlevel 1 exit /b 1
)

echo Installing SDXS dependencies...
"%PY%" -m pip install "numpy<2" "diffusers>=0.35,<0.38" "transformers>=4.50,<5" "accelerate>=1.8,<2" "safetensors>=0.5,<1"
if errorlevel 1 exit /b 1

echo Installing CUDA PyTorch...
"%PY%" -m pip install torch==2.5.1 --index-url https://download.pytorch.org/whl/cu124
if errorlevel 1 exit /b 1

echo Verifying CUDA...
"%PY%" -c "import numpy,torch; print('NumPy:',numpy.__version__); print('Torch:',torch.__version__); print('CUDA:',torch.cuda.is_available()); print('GPU:',torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'NONE')"
if errorlevel 1 exit /b 1

echo Running SDXS-512 test...
"%PY%" "%ROOT%local-image-engine\test_sdxs.py"
exit /b %errorlevel%
