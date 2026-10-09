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

  const name = String(skill.technology || "").toLowerCase();
  const examples = [
    [/\bsql\b|postgres|mysql/, "SELECT department, COUNT(*) AS total\\nFROM employees\\nGROUP BY department\\nORDER BY total DESC;"],
    [/spring boot/, "@RestController\\n@GetMapping(\"/health\")\\nString health() { return \"ok\"; }"],
    [/java/, "Map<String, Integer> counts = new HashMap<>();\\ncounts.merge(key, 1, Integer::sum);"],
    [/python/, "from collections import Counter\\ncounts = Counter(items)\\nprint(counts.most_common(3))"],
    [/javascript|node/, "const counts = items.reduce((m, x) =>\\n  m.set(x, (m.get(x) || 0) + 1), new Map());"],
    [/docker/, "docker build -t app .\\ndocker run --rm -p 8080:8080 app"],
    [/git/, "git switch -c feature/name\\ngit add . && git commit -m \"feat: change\""],
    [/aws|cloud/, "aws sts get-caller-identity\\naws s3 ls"],
    [/html|css/, "<main class=\"container\">\\n  <h1>Accessible UI</h1>\\n</main>"],
    [/c\+\+/, "std::unordered_map<std::string, int> freq;\\nfor (const auto& x : items) ++freq[x];"]
  ];
  const match = examples.find(([pattern]) => pattern.test(name));
  if (match) return match[1].replace(/\\\\n/g, "\n");
  return arr(skill.commands)[0] || arr(skill.oneLiners)[0] || "Review the key API, one common operation, and its failure case.";
}

function uniqueItems(items) {
  const seen = new Set();
  return arr(items).filter(item => {
    const text = String(typeof item === "string" ? item : item?.topic || item?.question || "").trim();
    const key = text.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function compactSkill(skill) {
  const tools = uniqueItems([
    ...arr(skill.modules),
    ...arr(skill.libraries),
    ...arr(skill.tools),
    ...arr(skill.databases)
  ]).slice(0, 8);

  const core = uniqueItems([...arr(skill.priorityTopics), ...arr(skill.fundamentals)]).slice(0, 5);
  const concepts = uniqueItems([...arr(skill.concepts), ...arr(skill.dataStructures), ...arr(skill.algorithms)]).filter(item =>
    !core.some(topic => String(topic).toLowerCase() === String(item).toLowerCase())
  ).slice(0, 6);
  const questions = uniqueItems(skill.interviewQuestions).slice(0, 4);
  const revision = uniqueItems(skill.quickRevision).slice(0, 6);

  return `
  <section class="skill">
    <div class="skillHead">
      <b>${esc(skill.technology)}</b>
      <span>${esc(skill.experienceLevel)} · ${esc(skill.focus)}</span>
    </div>
    <div class="grid">
      <article><h3>CORE</h3><ul>${list(core,5)}</ul></article>
      <article><h3>CONCEPTS / DSA</h3><ul>${list(concepts,6)}</ul></article>
      <article class="tools"><h3>TOOLS / DB</h3><p>${esc(tools.join(" · "))}</p></article>
      <article class="code"><h3>CODE / COMMAND</h3><code>${esc(codeOf(skill)).slice(0,360)}</code></article>
      <article class="questions"><h3>INTERVIEW QUESTIONS</h3><ol>${list(questions,4)}</ol></article>
      <article class="revision"><h3>QUICK REVISION</h3><p>${esc(revision.join(" · "))}</p></article>
    </div>
  </section>`;
}

async function generate(cheatsheet, outputFile) {
  const skills = arr(cheatsheet.skills).slice(0,6);
  const localImage = cheatsheet.localVisualPath && fs.existsSync(cheatsheet.localVisualPath)
    ? `data:image/png;base64,${fs.readFileSync(cheatsheet.localVisualPath).toString("base64")}`
    : null;
  const visualWidth = localImage ? 618 : 744;
  const visualOffset = localImage ? 126 : 0;
  const visual = renderVisuals(cheatsheet, visualWidth, visualOffset);

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}
@page{size:A4;margin:0}
html,body{margin:0;width:794px;height:1123px;background:#fff;color:#111;font-family:Arial,Helvetica,sans-serif}
.page{width:794px;height:1123px;padding:12px;overflow:hidden}
.header{border:2px solid #111;padding:8px 10px;margin-bottom:6px;height:61px}
.header h1{margin:0;font-size:19px;letter-spacing:-.4px}
.header p{margin:4px 0 0;font-size:7.5px;color:#555}
.visual{height:134px;margin-bottom:6px;overflow:hidden;border:1px solid #bbb;border-radius:9px}
.visual svg{width:100%;height:134px;display:block}
.skillsGrid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.skill{border:1px solid #999;break-inside:avoid;height:286px;overflow:hidden}
.skillHead{height:25px;background:#111;color:#fff;padding:6px 7px;display:flex;justify-content:space-between;align-items:center}
.skillHead b{font-size:10px}.skillHead span{font-size:6.5px;color:#ddd}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:5px}
article{border:1px solid #c5c5c5;padding:4px;min-height:55px;overflow:hidden}
article.tools{grid-column:span 2;min-height:37px}
article.code{grid-column:span 2;min-height:52px}
article.questions{grid-column:span 2;min-height:61px}
article.revision{grid-column:span 2;min-height:32px}
h3{font-size:6.4px;margin:0 0 3px;letter-spacing:.5px;border-bottom:1px solid #ddd;padding-bottom:2px}
ul,ol{margin:0;padding-left:11px;font-size:7px;line-height:1.3}
li{margin:0 0 2px}
p{margin:0;font-size:7px;line-height:1.35;word-break:break-word}
code{display:block;background:#f1f1f1;padding:4px;font-family:Consolas,monospace;font-size:6.4px;line-height:1.25;white-space:pre-wrap;max-height:35px;overflow:hidden}
.footer{text-align:center;font-size:5.5px;color:#777;margin-top:5px}
</style></head>
<body><div class="page">
<div class="header"><h1>TECHNICAL INTERVIEW CHEAT SHEET</h1>
<p>${esc(cheatsheet.role || "Technical Role")} · ${esc(cheatsheet.experience || "fresher")} · JD-driven · ${skills.length} technologies · A4 PNG</p></div>
<div class="visual"><svg viewBox="0 0 744 134" preserveAspectRatio="none">
<defs><marker id="a" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#111"/></marker></defs>
${localImage ? `<rect x="0" y="0" width="120" height="134" rx="9" fill="#f3f3f3" stroke="#111"/><image href="${localImage}" x="3" y="3" width="114" height="128" preserveAspectRatio="xMidYMid slice" opacity="0.96"/><text x="60" y="127" text-anchor="middle" font-size="6" font-weight="700">LOCAL AI VISUAL</text>` : ""}${visual.svg}</svg></div>
<div class="skillsGrid">${skills.map(compactSkill).join("")}</div>
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
