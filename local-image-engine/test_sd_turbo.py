import time
from pathlib import Path

MODEL = "stabilityai/sd-turbo"
OUT = Path("local-image-engine/sd_turbo_test.png")

print("=== SD-TURBO TEST (VAE UPSCALE FIX) ===")
import torch
print("CUDA:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
print("Torch:", torch.__version__)

from diffusers import AutoPipelineForText2Image

print("Loading:", MODEL)
started = time.time()
pipe = AutoPipelineForText2Image.from_pretrained(
    MODEL,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
)

if torch.cuda.is_available():
    pipe = pipe.to("cuda")
    # Black/NaN images can result from half-precision VAE decoding on some GPUs.
    # Decode in float32 while retaining the half-precision denoiser.
    try:
        pipe.upcast_vae()
        print("VAE upcast to float32")
    except (AttributeError, RuntimeError) as exc:
        print("VAE upcast unavailable:", exc)
    pipe.enable_attention_slicing()

print("Model loaded in %.1fs" % (time.time() - started))

prompt = (
    "clean technical interview infographic, minimal professional educational style, "
    "binary search algorithm flowchart, simple boxes and arrows, readable short labels, "
    "white background, no logo, no watermark"
)

started = time.time()
image = pipe(
    prompt,
    num_inference_steps=1,
    guidance_scale=0.0,
    width=384,
    height=384,
).images[0]

OUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUT)
print("Generated:", OUT)
print("Generation time: %.1fs" % (time.time() - started))
print("RGB extrema:", image.convert("RGB").getextrema())
