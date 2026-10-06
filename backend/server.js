const express = require("express");
const cors = require("cors");
const path = require("path");
const { analyzeJD } = require("../engine/jdAnalyzer");
const { buildCheatsheet } = require("../engine/cheatsheetBuilder");
const { generate } = require("../visual/generator/generateCheatsheet");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/generated", express.static(path.join(__dirname, "../visual/generator")));

app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "JD Cheat Sheet API running" });
});

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

        const filename = `cheatsheet-${Date.now()}.png`;
        const outputFile = path.join(__dirname, "../visual/generator", filename);

        await generate(cheatsheet, outputFile);

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
