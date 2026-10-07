import time
import argparse
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="local-image-engine/benchmark.png")
    args = parser.parse_args()

    import torch
    from diffusers import AutoPipelineForText2Image

    model = "stabilityai/sd-turbo"
    dtype = torch.float16 if torch.cuda.is_available() else torch.float32
    device = "cuda" if torch.cuda.is_available() else "cpu"

    print(f"device={device}")
    if torch.cuda.is_available():
        print(f"gpu={torch.cuda.get_device_name(0)}")
        print(f"vram_gb={torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f}")

    t0 = time.perf_counter()
    pipe = AutoPipelineForText2Image.from_pretrained(model, torch_dtype=dtype)
    pipe = pipe.to(device)
    if torch.cuda.is_available():
        pipe.enable_attention_slicing()
    load_time = time.perf_counter() - t0

    prompt = (
        "clean technical interview infographic, software engineering, "
        "binary search flowchart, Docker CI/CD deployment pipeline, "
        "simple boxes and arrows, readable short labels, white background"
    )

    if torch.cuda.is_available():
        torch.cuda.reset_peak_memory_stats()

    t1 = time.perf_counter()
    image = pipe(
        prompt=prompt,
        num_inference_steps=4,
        guidance_scale=0.0,
        width=384,
        height=384
    ).images[0]
    generation_time = time.perf_counter() - t1

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)

    print(f"model_load_seconds={load_time:.2f}")
    print(f"generation_seconds={generation_time:.2f}")
    if torch.cuda.is_available():
        peak = torch.cuda.max_memory_allocated() / 1024**3
        print(f"peak_vram_gb={peak:.2f}")
    print(f"output={output}")

if __name__ == "__main__":
    main()
