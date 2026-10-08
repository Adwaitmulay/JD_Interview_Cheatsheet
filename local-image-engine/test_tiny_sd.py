import time
from pathlib import Path

MODEL = "segmind/tiny-sd"
OUT = Path("local-image-engine/tiny_sd_test.png")

print("=== Tiny-SD TEST ===")
import torch
print("CUDA:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
print("Torch:", torch.__version__)

from diffusers import DiffusionPipeline

print("Loading:", MODEL)
started = time.time()
pipe = DiffusionPipeline.from_pretrained(
    MODEL,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
)

if torch.cuda.is_available():
    pipe = pipe.to("cuda")
    pipe.enable_attention_slicing()

print("Model loaded in %.1fs" % (time.time() - started))

prompt = (
    "clean technical interview infographic, minimal professional educational style, "
    "binary search algorithm flowchart, simple boxes and arrows, readable labels, "
    "white background, no logo, no watermark"
)

started = time.time()
image = pipe(
    prompt,
    num_inference_steps=4,
    guidance_scale=0.0,
    width=384,
    height=384,
).images[0]

OUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUT)
print("Generated:", OUT)
print("Generation time: %.1fs" % (time.time() - started))
