const arr = v => Array.isArray(v) ? v : [];

function compactSkills(cheatsheet) {
  return arr(cheatsheet.skills).slice(0,6).map(s => s.technology).join(", ");
}

function chooseVisualTheme(cheatsheet) {
  const text = JSON.stringify(cheatsheet).toLowerCase();
  if (/docker|kubernetes|aws|azure|gcp|devops|ci\/cd|jenkins|terraform/.test(text)) return "devops architecture and deployment pipeline";
  if (/binary search|algorithm|data structure|complexity/.test(text)) return "algorithm learning infographic";
  return "technical software engineering architecture infographic";
}

function buildVisualPrompt(cheatsheet) {
  const role = cheatsheet.role || "technical role";
  const experience = cheatsheet.experience || "fresher";
  const skills = compactSkills(cheatsheet);
  const theme = chooseVisualTheme(cheatsheet);

  return [
    theme,
    `for a ${experience} ${role} interview`,
    `technologies: ${skills || "software engineering"}`,
    "clean one-page technical study visual",
    "simple boxes, arrows, hierarchy and visual relationships",
    "readable short labels only",
    "no branding, no logos, no watermark"
  ].join(", ");
}

module.exports = { buildVisualPrompt, chooseVisualTheme };
