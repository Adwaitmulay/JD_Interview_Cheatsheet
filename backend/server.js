const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
const { analyzeJD } = require("../engine/jdAnalyzer");
const { buildCheatsheet } = require("../engine/cheatsheetBuilder");
const { buildVisualPrompt } = require("../visual/generator/visualPlanner");
const { generate } = require("../visual/generator/generateCheatsheet");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/generated", express.static(path.join(__dirname, "../visual/generator")));

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "JD Cheat Sheet API running",
        localImageEngine: process.env.LOCAL_IMAGE_ENGINE === "1"
    });
});

function runLocalImageEngine(cheatsheet, outputFile) {
    if (process.env.LOCAL_IMAGE_ENGINE !== "1") return Promise.resolve(false);

    return new Promise((resolve, reject) => {
        const script = path.join(__dirname, "../local-image-engine/generate.py");
        const prompt = buildVisualPrompt(cheatsheet);
        const python = process.env.PYTHON_BIN || (process.platform === "win32" ? "python" : "python3");
        const args = [
            script,
            "--prompt", prompt,
            "--output", outputFile,
            "--steps", process.env.LOCAL_IMAGE_STEPS || "12",
            "--width", "384",
            "--height", "384"
        ];

        execFile(python, args, {
            timeout: 105000,
            maxBuffer: 2 * 1024 * 1024
        }, (error) => {
            if (error) return reject(error);
            resolve(fs.existsSync(outputFile));
        });
    });
}

app.post("/api/generate", async (req, res) => {
    try {
        const jd = String(req.body?.jd || "").trim();

        if (!jd) {
            return res.status(400).json({
                success: false,
                error: "Job description is required"
            });
        }

        const analysis = analyzeJD(jd);
        const cheatsheet = buildCheatsheet(analysis);

        const stamp = Date.now();
        const filename = `cheatsheet-${stamp}.png`;
        const outputFile = path.join(__dirname, "../visual/generator", filename);

        const localAsset = path.join(
            __dirname,
            "../visual/generator",
            `local-visual-${stamp}.png`
        );

        try {
            cheatsheet.localVisualGenerated = await runLocalImageEngine(
                cheatsheet,
                localAsset
            );
            cheatsheet.localVisualPath = cheatsheet.localVisualGenerated
                ? localAsset
                : null;
        } catch (error) {
            console.warn("Local image engine unavailable; continuing with deterministic visuals:", error.message);
            cheatsheet.localVisualGenerated = false;
            cheatsheet.localVisualPath = null;
        }

        await generate(cheatsheet, outputFile);

        if (cheatsheet.localVisualPath && fs.existsSync(cheatsheet.localVisualPath)) {
            fs.unlinkSync(cheatsheet.localVisualPath);
        }

        res.json({
            success: true,
            cheatsheet,
            imageUrl: `/generated/${filename}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
