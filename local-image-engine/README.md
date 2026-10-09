# Local Image Engine

This component is optional and local-only.

## Hard rules

- No GPT or ChatGPT image generation.
- No OpenAI image-generation API.
- No paid or hosted image-generation service.
- Exact technical diagrams, labels, arrows, algorithms and code remain deterministic SVG/Canvas.
- The diffusion model may create only supplementary imagery; do not trust it to render exact text or technical notation.

## Model choice and test status

The selected model is `stabilityai/sd-turbo`. The model loaded and generated a 384x384 test PNG in about 5 seconds after loading. The first load took about 15 minutes in the reported test. A NumPy invalid-cast warning appeared, so inspect `local-image-engine\sd_turbo_test.png` before accepting visual quality. End-to-end A4 output with SD-Turbo is not yet verified.

## Local setup (Windows + NVIDIA)

Run from PowerShell:

```powershell
cd D:\JD_Interview_Cheatsheet
.local-image-engine\setup_sd_turbo.bat
```

The setup script uses the dedicated `sd-turbo-env` environment and redirects Hugging Face cache, pip cache and temporary files to D:\. It skips dependency installation if the environment already has the required imports. The first model download/load can take a long time; later runs should reuse `D:\HF_CACHE`.

## Flow

JD -> visual planner -> optional local image -> deterministic technical visuals -> A4 compositor -> PNG

## Deployment limitation

The public Render deployment cannot access the GPU or model files on your PC. Keep `LOCAL_IMAGE_ENGINE` disabled on Render. The deployed site currently uses deterministic visuals. To use SD-Turbo in the actual generation flow, the Node backend and model must run on the same PC, or a secure local-to-web bridge must be built. Render cannot access local Windows files directly.
