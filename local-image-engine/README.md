# Local Image Engine

This component is intentionally local-only.

## Hard rules

- No GPT.
- No ChatGPT image generation.
- No OpenAI image API.
- No third-party image-generation API.
- No paid inference service.
- No cloud image-generation dependency.

## Role

The engine generates optional visual assets locally. Exact technical diagrams remain deterministic SVG/Canvas so labels, arrows, algorithms and code stay accurate.

## Model choice

Default benchmark model: `stabilityai/sd-turbo`.

Why:
- open-weight Stable Diffusion family
- designed for very low inference steps
- much better fit for a limited GPU than a full SDXL/FLUX pipeline
- used only for supplementary visual assets
- exact code, labels and technical diagrams are still generated deterministically

Default: 384x384, 4 inference steps.

## Local setup (Windows + NVIDIA)

PowerShell:

```powershell
cd D:\JD_Interview_Cheatsheet
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install torch==2.5.1 torchvision==0.20.1 --index-url https://download.pytorch.org/whl/cu124
.\.venv\Scripts\python.exe -m pip install -r local-image-engine\requirements.txt
$env:LOCAL_IMAGE_ENGINE="1"
$env:PYTHON_BIN="$PWD\.venv\Scripts\python.exe"
$env:LOCAL_IMAGE_MODEL="stabilityai/sd-turbo"
node backend\server.js
```

The first model run downloads the checkpoint locally. That download is setup time, not generation time.

## Flow

JD -> visual planner -> local image asset -> deterministic SVG technical visuals -> A4 compositor -> PNG

The Render web service does not call a remote image API. If local diffusion is unavailable on the deployment machine, deterministic technical visuals are used instead.
