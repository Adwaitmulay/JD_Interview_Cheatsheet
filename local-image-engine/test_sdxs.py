import time
from pathlib import Path
import torch
from diffusers import DiffusionPipeline

MODEL = "akleine/sdxs-512"
OUT = Path("sdxs-test.png")
print("=== SDXS-512 TEST ===")
print("CUDA available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
    print("CUDA:", torch.version.cuda)
print("Loading:", MODEL)
dtype = torch.float16 if torch.cuda.is_available() else torch.float32
pipe = DiffusionPipeline.from_pretrained(MODEL, torch_dtype=dtype)
pipe = pipe.to("cuda" if torch.cuda.is_available() else "cpu")
prompt = "clean technical interview infographic, Java backend architecture, REST API, database, Docker and AWS, minimal professional educational style, white background"
print("Generating 512x512 with 1 inference step...")
start = time.perf_counter()
image = pipe(prompt, num_inference_steps=1, guidance_scale=0.0, width=512, height=512).images[0]
elapsed = time.perf_counter() - start
image.save(OUT)
print("RESULT: PASS")
print("Device:", "CUDA" if torch.cuda.is_available() else "CPU")
print("Generation time:", round(elapsed, 2), "seconds")
print("Image:", OUT.resolve())
