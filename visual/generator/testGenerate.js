const path = require("path");
const { analyzeJD } = require("../../engine/jdAnalyzer");
const { buildCheatsheet } = require("../../engine/cheatsheetBuilder");
const { generate } = require("./generateCheatsheet");

const jd = `
Python Developer with 1–2 years of experience. Python, FastAPI, REST APIs, SQL, PostgreSQL, NumPy, Pandas, Machine Learning, Git, GitHub, Docker, AWS and Unit Testing.
`;

async function main() {
    const analysis = analyzeJD(jd);
    const cheatsheet = buildCheatsheet(analysis);

    const output = path.join(
        __dirname,
        "Python_CheatSheet.png"
    );

    await generate(cheatsheet, output);

    console.log("Technologies:", cheatsheet.skills.map(s => s.technology).join(" -> "));
    console.log("Image:", output);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

