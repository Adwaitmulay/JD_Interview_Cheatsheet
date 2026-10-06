const { chromium } = require("playwright");

const esc = (v="") => String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

const arr = (v=[]) => Array.isArray(v) ? v : [];

function bullets(items=[], n=6) {
    return arr(items).slice(0,n).map(x =>
        `<li>${esc(typeof x==="string" ? x : x.question || JSON.stringify(x))}</li>`
    ).join("");
}

function topics(items=[], n=4) {
    return arr(items).slice(0,n).map(t => `
        <div class="topic">
            <b>${esc(t.topic || "")}</b>
            ${t.what ? `<span>${esc(t.what)}</span>` : ""}
            ${t.code ? `<code>${esc(t.code)}</code>` : ""}
        </div>
    `).join("");
}

function questions(items=[], n=5) {
    return arr(items).slice(0,n).map(q =>
        `<li>${esc(q.question || q)}</li>`
    ).join("");
}

function visual(items=[]) {
    return arr(items).slice(0,2).map(v => `
        <div class="flow">
            <b>${esc(v.title || "Architecture")}</b>
            <div class="steps">
                ${arr(v.steps).map((s,i) =>
                    `<span>${esc(s)}</span>${i<arr(v.steps).length-1 ? "<i>?</i>" : ""}`
                ).join("")}
            </div>
        </div>
    `).join("");
}

function skill(skill) {
    return `
    <section>
        <div class="skillHead">
            <strong>${esc(skill.technology)}</strong>
            <small>${esc(skill.experienceLevel)} · ${esc(skill.focus)}</small>
        </div>

        <div class="cols">

            <article>
                <h3>CORE / PRIORITY</h3>
                <ul>${bullets(skill.priorityTopics,8)}</ul>
            </article>

            <article>
                <h3>CONCEPTS</h3>
                ${topics(skill.topics,5)}
            </article>

            <article>
                <h3>ALGORITHMS</h3>
                <ul>${bullets(skill.algorithms,6)}</ul>
            </article>

            <article>
                <h3>DATA STRUCTURES</h3>
                <ul>${bullets(skill.dataStructures,6)}</ul>
            </article>

            <article>
                <h3>LIBRARIES / TOOLS</h3>
                <ul>${bullets([
                    ...arr(skill.modules),
                    ...arr(skill.libraries),
                    ...arr(skill.tools)
                ],8)}</ul>
            </article>

            <article>
                <h3>DATABASE</h3>
                <ul>${bullets(skill.databases,6)}</ul>
            </article>

            <article class="wide">
                <h3>SYSTEM DESIGN / ARCHITECTURE</h3>
                ${visual(skill.visuals)}
                <ul>${bullets(skill.systemDesign,5)}</ul>
            </article>

            <article>
                <h3>INTERVIEW QUESTIONS</h3>
                <ul>${questions(skill.interviewQuestions,5)}</ul>
            </article>

            <article>
                <h3>QUICK REVISION</h3>
                <ul>${bullets(skill.quickRevision,7)}</ul>
            </article>

            <article>
                <h3>COMMANDS</h3>
                <ul>${bullets(skill.commands,7)}</ul>
            </article>

        </div>
    </section>`;
}

async function generate(cheatsheet, outputFile) {

    const skills = cheatsheet.skills || [];

    const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
*{box-sizing:border-box}
@page{size:A4;margin:0}
body{
    margin:0;
    width:794px;
    min-height:1123px;
    background:#fff;
    color:#111;
    font-family:Arial,Helvetica,sans-serif;
}
.page{padding:20px}
.header{
    border:3px solid #111;
    padding:15px 17px;
    margin-bottom:10px;
}
.header h1{
    margin:0;
    font-size:25px;
    letter-spacing:-.7px;
}
.header p{
    margin:5px 0 0;
    font-size:10px;
    color:#555;
}
section{margin-bottom:10px}
.skillHead{
    display:flex;
    justify-content:space-between;
    align-items:center;
    background:#111;
    color:#fff;
    padding:7px 10px;
}
.skillHead strong{font-size:16px}
.skillHead small{
    font-size:8px;
    color:#ddd;
}
.cols{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:5px;
    margin-top:5px;
}
article{
    border:1px solid #bbb;
    padding:7px 8px;
    min-height:62px;
}
article.wide{grid-column:span 2}
h3{
    font-size:8px;
    margin:0 0 5px;
    letter-spacing:.8px;
    border-bottom:1px solid #ddd;
    padding-bottom:3px;
}
ul{
    margin:0;
    padding-left:14px;
    font-size:8px;
    line-height:1.35;
}
li{margin-bottom:1px}
.topic{
    margin-bottom:4px;
    font-size:7.5px;
    line-height:1.25;
}
.topic b{
    font-size:8.5px;
    display:block;
}
.topic span{
    color:#444;
}
code{
    display:block;
    background:#f1f1f1;
    padding:3px;
    margin-top:2px;
    font-family:Consolas,monospace;
    font-size:6.5px;
    white-space:pre-wrap;
}
.flow{margin-bottom:5px}
.flow>b{
    font-size:8px;
}
.steps{
    display:flex;
    align-items:center;
    flex-wrap:wrap;
    gap:3px;
    margin-top:4px;
}
.steps span{
    border:1px solid #777;
    padding:3px 5px;
    font-size:6.5px;
    font-weight:bold;
}
.steps i{
    font-style:normal;
    font-size:9px;
}
.footer{
    text-align:center;
    font-size:7px;
    color:#777;
    margin-top:8px;
}
</style>
</head>
<body>
<div class="page">
<div class="header">
<h1>TECHNICAL INTERVIEW CHEAT SHEET</h1>
<p>JD-driven · ${esc(cheatsheet.experience || "fresher")} level · ${skills.length} technologies · rapid interview revision</p>
</div>
${skills.map(skill).join("")}
<div class="footer">Automatically generated from Job Description</div>
</div>
</body>
</html>`;

    const browser = await chromium.launch({headless:true});
    const page = await browser.newPage({
        viewport:{width:794,height:1123},
        deviceScaleFactor:2
    });

    await page.setContent(html,{waitUntil:"networkidle"});
    await page.screenshot({path:outputFile,fullPage:true});
    await browser.close();

    console.log("Generated:",outputFile);
}

module.exports={generate};
