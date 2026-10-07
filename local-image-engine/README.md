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

## Target model

The first local benchmark target is a lightweight Stable Diffusion-family checkpoint such as SD 1.5. The adapter is model-agnostic so a smaller/better open-weight checkpoint can replace it without changing the application pipeline.

## Flow

JD -> visual planner -> local image asset -> SVG/Canvas technical visuals -> A4 compositor -> PNG

The Render web service does not call a remote image API. If local diffusion is unavailable on the deployment machine, deterministic technical visuals are used instead.
