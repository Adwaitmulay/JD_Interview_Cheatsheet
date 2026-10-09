import argparse
import os
from pathlib import Path

# Keep model and temporary caches on D: by default on this Windows workstation.
# Existing environment variables always take precedence.
if os.name == "nt":
    os.environ.setdefault("HF_HOME", r"D:\HF_CACHE")
    os.environ.setdefault("HF_HUB_CACHE", r"D:\HF_CACHE\hub")
    os.environ.setdefault("HUGGINGFACE_HUB_CACHE", r"D:\HF_CACHE\hub")
    os.environ.setdefault("TRANSFORMERS_CACHE", r"D:\HF_CACHE\transformers")
    os.environ.setdefault("TEMP", r"D:\TEMP")
    os.environ.setdefault("TMP", r"D:\TEMP")

PROMPT_PREFIX = (
    "clean technical interview infographic, minimal professional educational style, "
    "high information density, white background, simple geometric shapes, "
    "clear visual hierarchy, no decorative branding, no logo, no watermark"
)

DEFAULT_MODEL = os.getenv("LOCAL_IMAGE_MODEL", "stabilityai/sd-turbo")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--steps", type=int, default=4)
    parser.add_argument("--width", type=int, default=384)
    parser.add_argument("--height", type=int, default=384)
    args = parser.parse_args()

    try:
        import torch
        from diffusers import AutoPipelineForText2Image
    except ImportError as exc:
        raise SystemExit(
            "Local engine dependencies missing. Install local-image-engine first. "
            "No remote image API is used."
        ) from exc

    print(f"CUDA available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"GPU: {torch.cuda.get_device_name(0)}")

    dtype = torch.float16 if torch.cuda.is_available() else torch.float32
    print(f"Loading local model: {args.model}")
    pipe = AutoPipelineForText2Image.from_pretrained(
        args.model,
        torch_dtype=dtype,
        use_safetensors=True,
    )

    if torch.cuda.is_available():
        pipe = pipe.to("cuda")
        pipe.enable_attention_slicing()
    else:
        pipe = pipe.to("cpu")

    prompt = f"{PROMPT_PREFIX}, {args.prompt}"
    result = pipe(
        prompt=prompt,
        num_inference_steps=max(1, args.steps),
        guidance_scale=0.0,
        width=args.width,
        height=args.height,
    )
    image = result.images[0]

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)

    # Catch empty/corrupt-looking output early rather than silently embedding it.
    extrema = image.convert("RGB").getextrema()
    spread = max(channel_max - channel_min for channel_min, channel_max in extrema)
    if spread < 2:
        output.unlink(missing_ok=True)
        raise SystemExit(
            "Generated image has almost no pixel variation; output rejected. "
            "Check the local model precision/VAE before integrating it."
        )

    print(f"Generated local image: {output}")
    print(f"Image size: {image.size}; RGB extrema: {extrema}")
    print("Note: inspect image quality; generated text/diagrams are not authoritative.")


if __name__ == "__main__":
    main()
