# Local Image Engine

Optional local-only experiment. The main cheatsheet does not require a diffusion model.

## Hard rules

- No GPT/ChatGPT image generation, OpenAI image-generation API, or paid/hosted image service.
- Exact technical diagrams, labels, arrows, algorithms, and code remain deterministic SVG.
- Diffusion output is supplementary only; never trust it for exact technical text.

## Current status

**SD-Turbo is not usable yet.** The test output was a 384x384 all-black image (pixel min=0, max=0, one unique color) and emitted an invalid-cast warning. Do not enable `LOCAL_IMAGE_ENGINE=1` until a valid image is confirmed.

The first model load was about 15 minutes; cached loading later took about 5 seconds, with image generation around 5 seconds. Since the generated image is invalid, stop model troubleshooting for now and finish the core product with deterministic visuals.

## Existing working route

Job description -> JD analyzer -> cheatsheet builder -> deterministic SVG visuals -> Playwright A4 PNG.

The public Render deployment cannot access your PC's GPU or local model files. Keep `LOCAL_IMAGE_ENGINE` disabled on Render. The deployed site uses deterministic visuals.

## Optional local test (not required for core app)

On Windows, from PowerShell:

```powershell
cd D:\JD_Interview_Cheatsheet
.sd-turbo-env\Scripts\python.exe local-image-engine\test_sd_turbo.py
```

Model cache/temp/pip cache should be directed to D:\. Do not repeat this test unless image-model work is resumed later.
