const { chromium } = require("playwright");
const fs = require("fs");
const { renderVisuals } = require("./visualEngine");

const esc = (v="") => String(v)
  .replace(/&/g,"&amp;").replace(/</g,"&lt;")
  .replace(/>/g,"&gt;").replace(/"/g,"&quot;");

const arr = v => Array.isArray(v) ? v : [];

function list(items=[], n=4) {
  return arr(items).slice(0,n).map(x =>
    `<li>${esc(typeof x === "string" ? x : x.question || x.topic || JSON.stringify(x))}</li>`
  ).join("");
}

function codeOf(skill) {
  const topic = arr(skill.topics).find(t => t.code);
  if (topic?.code) return topic.code;
  const detailed = arr(skill.sections).find(s => s.code);
  if (detailed?.code) return detailed.code;
  return arr(skill.commands)[0] || arr(skill.oneLiners)[0] || "";
}

function compactSkill(skill) {
  const tools = [
    ...arr(skill.modules),
    ...arr(skill.libraries),
    ...arr(skill.tools)
  ];

  return `
  <section class="skill">
    <div class="skillHead">
      <b>${esc(skill.technology)}</b>
      <span>${esc(skill.experienceLevel)} · ${esc(skill.focus)}</span>
    </div>
    <div class="grid">
      <article><h3>CORE</h3><ul>${list(skill.priorityTopics,4)}</ul></article>
      <article><h3>CONCEPTS / DSA</h3><ul>${list([
        ...arr(skill.concepts), ...arr(skill.dataStructures), ...arr(skill.algorithms)
      ],5)}</ul></article>
      <article><h3>TOOLS / DB</h3>
        <p>${esc(tools.slice(0,5).join(" · "))}</p>
        <p>${esc(arr(skill.databases).slice(0,3).join(" · "))}</p>
      </article>
      <article><h3>CODE / COMMAND</h3><code>${esc(codeOf(skill)).slice(0,260)}</code></article>
      <article class="wide"><h3>INTERVIEW QUESTIONS</h3><ol>${list(skill.interviewQuestions,3)}</ol></article>
      <article class="wide"><h3>QUICK REVISION</h3><p>${esc(arr(skill.quickRevision).slice(0,6).join(" · "))}</p></article>
    </div>
  </section>`;
}

async function generate(cheatsheet, outputFile) {
  const skills = arr(cheatsheet.skills).slice(0,6);
  const visual = renderVisuals(cheatsheet, 744);\n  const localImage = cheatsheet.localVisualPath && fs.existsSync(cheatsheet.localVisualPath)\n    ? `data:image/png;base64,${fs.readFileSync(cheatsheet.localVisualPath).toString("base64")}`\n    : null;

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}
@page{size:A4;margin:0}
html,body{margin:0;width:794px;height:1123px;background:#fff;color:#111;font-family:Arial,Helvetica,sans-serif}
.page{width:794px;height:1123px;padding:13px;overflow:hidden}
.header{border:2px solid #111;padding:9px 11px;margin-bottom:5px}
.header h1{margin:0;font-size:19px;letter-spacing:-.4px}
.header p{margin:3px 0 0;font-size:7px;color:#555}
.visual{height:126px;margin-bottom:5px;overflow:hidden;border-radius:10px}
.visual svg{width:100%;height:126px;display:block}
.skill{margin-bottom:4px;break-inside:avoid}
.skillHead{height:22px;background:#111;color:#fff;padding:5px 7px;display:flex;justify-content:space-between;align-items:center}
.skillHead b{font-size:10px}.skillHead span{font-size:6.5px;color:#ddd}
.grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:3px;margin-top:3px}
article{border:1px solid #bbb;padding:4px;min-height:40px;overflow:hidden}
article.wide{grid-column:span 3;min-height:28px}
h3{font-size:6px;margin:0 0 3px;letter-spacing:.5px;border-bottom:1px solid #ddd;padding-bottom:2px}
ul,ol{margin:0;padding-left:11px;font-size:6.2px;line-height:1.18}
li{margin:0 0 1px}p{margin:0;font-size:6.2px;line-height:1.22;word-break:break-word}
code{display:block;background:#f2f2f2;padding:3px;font-family:Consolas,monospace;font-size:5.3px;line-height:1.15;white-space:pre-wrap;max-height:25px;overflow:hidden}
.footer{text-align:center;font-size:5.5px;color:#777;margin-top:2px}
</style></head>
<body><div class="page">
<div class="header"><h1>TECHNICAL INTERVIEW CHEAT SHEET</h1>
<p>${esc(cheatsheet.role || "Technical Role")} · ${esc(cheatsheet.experience || "fresher")} · JD-driven · Top ${skills.length} technologies</p></div>
<div class="visual"><svg viewBox="0 0 744 150" preserveAspectRatio="xMidYMid meet">
<defs><marker id="a" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#111"/></marker></defs>
${visual.svg}</svg></div>
${skills.map(compactSkill).join("")}
<div class="footer">Generated locally from the Job Description · no external image-generation API</div>
</div></body></html>`;

  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:794,height:1123},deviceScaleFactor:2});
    page.setDefaultTimeout(120000);
    await page.setContent(html,{waitUntil:"domcontentloaded",timeout:120000});
    await page.evaluate(async()=>{if(document.fonts?.ready) await document.fonts.ready;});
    await page.screenshot({path:outputFile,fullPage:false,clip:{x:0,y:0,width:794,height:1123},timeout:120000,animations:"disabled"});
    console.log("Generated:",outputFile);
  } finally { await browser.close(); }
}

module.exports={generate};
