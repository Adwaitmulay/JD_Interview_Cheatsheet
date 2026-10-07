const esc = (v="") => String(v)
  .replace(/&/g,"&amp;").replace(/</g,"&lt;")
  .replace(/>/g,"&gt;").replace(/"/g,"&quot;");

const arr = v => Array.isArray(v) ? v : [];

function has(skill, words) {
  const text = JSON.stringify(skill).toLowerCase();
  return words.some(w => text.includes(w));
}

function panel(x, title, subtitle, w=240, h=126) {
  return `<rect x="${x}" y="0" width="${w}" height="${h}" rx="9" fill="#f7f7f7" stroke="#111"/>
  <text x="${x+10}" y="18" font-size="10" font-weight="700">${esc(title)}</text>
  <text x="${x+w-10}" y="18" text-anchor="end" font-size="7" font-weight="700">${esc(subtitle)}</text>`;
}

function binaryPanel(x,w=240) {
  const vals=[2,5,8,12,16,21,27];
  const gap=4;
  const bw=Math.min(25,(w-24-gap*6)/7);
  const start=x+12;
  const boxes=vals.map((v,i)=>{
    const bx=start+i*(bw+gap);
    return `<rect x="${bx}" y="38" width="${bw}" height="22" rx="3" fill="#fff" stroke="#111"/>
    <text x="${bx+bw/2}" y="53" text-anchor="middle" font-size="8">${v}</text>`;
  }).join("");
  return `<g>${panel(x,"BINARY SEARCH","O(log n)",w)}
    <text x="${x+10}" y="31" font-size="6.5">sorted → check middle → halve range</text>
    ${boxes}
    <path d="M ${x+w/2} 64 V 82" stroke="#111" stroke-width="1.5" marker-end="url(#a)"/>
    <text x="${x+w/2}" y="94" text-anchor="middle" font-size="7">mid → compare → left / right</text>
    <text x="${x+w/2}" y="107" text-anchor="middle" font-size="7">repeat until found / empty</text>
  </g>`;
}

function devopsPanel(x,w=240) {
  const labels=["API","SERVICE","DB"];
  const xs=[x+22,x+94,x+166];
  const boxes=labels.map((t,i)=>`<rect x="${xs[i]}" y="42" width="52" height="22" rx="4" fill="#fff" stroke="#111"/><text x="${xs[i]+26}" y="56" text-anchor="middle" font-size="7">${t}</text>`).join("");
  return `<g>${panel(x,"BACKEND + DEVOPS","production flow",w)}
    <text x="${x+10}" y="31" font-size="6.5">request path + deployment lifecycle</text>
    ${boxes}
    <path d="M ${x+74} 53 H ${x+94} M ${x+146} 53 H ${x+166}" stroke="#111" stroke-width="1.5" marker-end="url(#a)"/>
    <text x="${x+10}" y="82" font-size="7">Git → test → build → Docker → deploy</text>
    <text x="${x+10}" y="96" font-size="7">logs → metrics → alerts → rollback</text>
    <text x="${x+10}" y="111" font-size="7">AWS / CI-CD / containers</text>
  </g>`;
}

function architecturePanel(x,w=240,skills=[]) {
  const labels=skills.slice(0,3).map(s=>s.technology).join(" · ");
  return `<g>${panel(x,"TECH STACK + ARCHITECTURE","JD-driven",w)}
    <text x="${x+10}" y="31" font-size="6.5">${esc(labels || "role · skills · experience")}</text>
    <circle cx="${x+34}" cy="61" r="15" fill="#fff" stroke="#111"/><text x="${x+34}" y="64" text-anchor="middle" font-size="7">JD</text>
    <rect x="${x+64}" y="48" width="68" height="26" rx="4" fill="#fff" stroke="#111"/><text x="${x+98}" y="59" text-anchor="middle" font-size="6.5">ROLE + SKILLS</text><text x="${x+98}" y="68" text-anchor="middle" font-size="6">LEVEL</text>
    <rect x="${x+152}" y="48" width="68" height="26" rx="4" fill="#fff" stroke="#111"/><text x="${x+186}" y="59" text-anchor="middle" font-size="6.5">CHEAT SHEET</text><text x="${x+186}" y="68" text-anchor="middle" font-size="6">VISUAL PLAN</text>
    <path d="M ${x+49} 61 H ${x+64} M ${x+132} 61 H ${x+152}" stroke="#111" stroke-width="1.5" marker-end="url(#a)"/>
    <text x="${x+10}" y="91" font-size="7">core → concepts → code → questions</text>
    <text x="${x+10}" y="105" font-size="7">algorithms + tools + DB + quick revision</text>
    <text x="${x+10}" y="118" font-size="7">one-page technical interview view</text>
  </g>`;
}

function buildVisuals(cheatsheet) {
  const skills = arr(cheatsheet.skills);
  const visuals = [];
  if (skills.some(s => has(s, ["algorithm","binary search","search"]))) visuals.push("binary");
  if (skills.some(s => has(s, ["docker","kubernetes","aws","devops","ci/cd","git"]))) visuals.push("devops");
  visuals.push("architecture");
  return [...new Set(visuals)].slice(0,3);
}

function renderVisuals(cheatsheet, width=744, xOffset=0) {
  const selected=buildVisuals(cheatsheet);
  const gap=6;
  const count=selected.length || 1;
  const panelW=(width-gap*(count-1))/count;
  const chunks=selected.map((type,i)=>{
    const x=xOffset+i*(panelW+gap);
    if(type==="binary") return binaryPanel(x,panelW);
    if(type==="devops") return devopsPanel(x,panelW);
    return architecturePanel(x,panelW,arr(cheatsheet.skills));
  });
  return {svg:chunks.join(""),height:126};
}

module.exports={buildVisuals,renderVisuals};