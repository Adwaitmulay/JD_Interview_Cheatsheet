const esc = (v="") => String(v)
  .replace(/&/g,"&amp;").replace(/</g,"&lt;")
  .replace(/>/g,"&gt;").replace(/"/g,"&quot;");

const arr = v => Array.isArray(v) ? v : [];

function has(skill, words) {
  const text = JSON.stringify(skill).toLowerCase();
  return words.some(w => text.includes(w));
}

function binarySearchSvg(x, y, w) {
  const h = 150;
  const values = [2, 5, 8, 12, 16, 21, 27];
  const boxes = values.map((v,i) => {
    const bx = x + 14 + i * ((w-28)/values.length);
    return `<rect x="${bx}" y="${y+48}" width="34" height="28" rx="4" fill="#fff" stroke="#111"/><text x="${bx+17}" y="${y+67}" text-anchor="middle" font-size="11">${v}</text>`;
  }).join("");
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#f7f7f7" stroke="#111"/>
    <text x="${x+14}" y="${y+22}" font-size="12" font-weight="700">BINARY SEARCH</text>
    <text x="${x+14}" y="${y+38}" font-size="8">Sorted data · halve the search range</text>
    ${boxes}
    <path d="M ${x+w/2} ${y+82} L ${x+w/2} ${y+106}" stroke="#111" stroke-width="2"/>
    <text x="${x+w/2}" y="${y+124}" text-anchor="middle" font-size="9">mid → compare → left/right → repeat</text>
    <text x="${x+w-14}" y="${y+22}" text-anchor="end" font-size="9" font-weight="700">O(log n)</text>
  </g>`;
}

function backendFlowSvg(x, y, w) {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="150" rx="10" fill="#f7f7f7" stroke="#111"/>
    <text x="${x+14}" y="${y+22}" font-size="12" font-weight="700">BACKEND / DEVOPS FLOW</text>
    <g font-size="9" text-anchor="middle">
      <rect x="${x+18}" y="${y+48}" width="82" height="30" rx="5" fill="#fff" stroke="#111"/><text x="${x+59}" y="${y+67}">CLIENT</text>
      <rect x="${x+122}" y="${y+48}" width="82" height="30" rx="5" fill="#fff" stroke="#111"/><text x="${x+163}" y="${y+67}">API</text>
      <rect x="${x+226}" y="${y+48}" width="82" height="30" rx="5" fill="#fff" stroke="#111"/><text x="${x+267}" y="${y+67}">SERVICE</text>
      <rect x="${x+330}" y="${y+48}" width="82" height="30" rx="5" fill="#fff" stroke="#111"/><text x="${x+371}" y="${y+67}">DB</text>
    </g>
    <path d="M ${x+100} ${y+63} H ${x+122} M ${x+204} ${y+63} H ${x+226} M ${x+308} ${y+63} H ${x+330}" stroke="#111" stroke-width="2" marker-end="url(#a)"/>
    <text x="${x+14}" y="${y+104}" font-size="8">CI/CD → test → build → deploy → monitor</text>
    <text x="${x+14}" y="${y+121}" font-size="8">logs · metrics · alerts · rollback</text>
  </g>`;
}

function architectureSvg(x,y,w,skills) {
  const labels = skills.slice(0,4).map(s=>s.technology).join(" · ");
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="150" rx="10" fill="#f7f7f7" stroke="#111"/>
    <text x="${x+14}" y="${y+22}" font-size="12" font-weight="700">TECH STACK MAP</text>
    <text x="${x+14}" y="${y+43}" font-size="8">${esc(labels)}</text>
    <circle cx="${x+80}" cy="${y+92}" r="24" fill="#fff" stroke="#111"/><text x="${x+80}" y="${y+96}" text-anchor="middle" font-size="8">JD</text>
    <rect x="${x+140}" y="${y+70}" width="90" height="44" rx="6" fill="#fff" stroke="#111"/><text x="${x+185}" y="${y+89}" text-anchor="middle" font-size="8">ROLE / SKILLS</text><text x="${x+185}" y="${y+101}" text-anchor="middle" font-size="7">EXPERIENCE</text>
    <rect x="${x+270}" y="${y+70}" width="90" height="44" rx="6" fill="#fff" stroke="#111"/><text x="${x+315}" y="${y+89}" text-anchor="middle" font-size="8">VISUAL</text><text x="${x+315}" y="${y+101}" text-anchor="middle" font-size="7">PLAN</text>
    <path d="M ${x+104} ${y+92} H ${x+140} M ${x+230} ${y+92} H ${x+270}" stroke="#111" stroke-width="2" marker-end="url(#a)"/>
    <text x="${x+14}" y="${y+133}" font-size="8">One-page A4 composition · readable · technical</text>
  </g>`;
}

function buildVisuals(cheatsheet) {
  const skills = arr(cheatsheet.skills);
  const visuals = [];
  if (skills.some(s => has(s, ["algorithm","binary search","search"]))) visuals.push("binary");
  if (skills.some(s => has(s, ["docker","kubernetes","aws","devops","ci/cd","git"]))) visuals.push("devops");
  visuals.push("architecture");
  return visuals.slice(0,3);
}

function renderVisuals(cheatsheet, width) {
  const selected = buildVisuals(cheatsheet);
  let y = 0;
  const chunks = [];
  const gap = 8;
  const h = 150;
  for (const type of selected) {
    if (type === "binary") chunks.push(binarySearchSvg(0,y,width)), y += h+gap;
    else if (type === "devops") chunks.push(backendFlowSvg(0,y,width)), y += h+gap;
    else chunks.push(architectureSvg(0,y,width,arr(cheatsheet.skills))), y += h+gap;
  }
  return { svg: chunks.join(""), height: y };
}

module.exports = { buildVisuals, renderVisuals };
