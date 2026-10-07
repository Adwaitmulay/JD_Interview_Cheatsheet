import argparse
import os
from pathlib import Path

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
            "Local engine dependencies missing. Install the local requirements first. "
            "No remote image API is used."
        ) from exc

    dtype = torch.float16 if torch.cuda.is_available() else torch.float32

    pipe = AutoPipelineForText2Image.from_pretrained(
        args.model,
        torch_dtype=dtype
    )

    if torch.cuda.is_available():
        pipe = pipe.to("cuda")
        pipe.enable_attention_slicing()
    else:
        pipe = pipe.to("cpu")

    prompt = f"{PROMPT_PREFIX}, {args.prompt}"

    image = pipe(
        prompt=prompt,
        num_inference_steps=max(1, args.steps),
        guidance_scale=0.0,
        width=args.width,
        height=args.height
    ).images[0]

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)
    print(f"Generated local image: {output}")

if __name__ == "__main__":
    main()
