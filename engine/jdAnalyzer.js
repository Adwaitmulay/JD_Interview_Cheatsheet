const { detectSkills } = require("./skillDetector");
const { detectExperience } = require("./experienceDetector");

function cleanLines(text) {
    return String(text || "")
        .split(/\r?\n/)
        .map(line => line.replace(/^\s*[-•*]\s*/, "").trim())
        .filter(Boolean);
}

function extractSection(text, headings) {
    const lines = cleanLines(text);
    const wanted = headings.map(h => h.toLowerCase());
    const start = lines.findIndex(line => wanted.some(h => line.toLowerCase().replace(/[:#]/g, "").trim() === h));
    if (start < 0) return [];
    const out = [];
    for (let i = start + 1; i < lines.length; i++) {
        const line = lines[i];
        if (/^(requirements?|qualifications?|responsibilities?|what you('ll| will) do|skills?|nice to have|preferred|about the role|job description|experience)\s*:??$/i.test(line)) break;
        out.push(line);
    }
    return out;
}

function detectRole(text) {
    const first = String(text || "").split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    const rolePatterns = [
        /^(?:job title|role|position|designation)\s*[:\-]\s*(.+)$/i,
        /^(?:we are looking for|hiring|looking for)\s+(?:a|an)?\s*(.+?)(?:\s+with\s+\d+\s*(?:years?|yrs?).*)?$/i
    ];
    for (const line of first.slice(0, 12)) {
        for (const pattern of rolePatterns) {
            const m = line.match(pattern);
            if (m?.[1]) return m[1].trim().replace(/[.:]+$/, "");
        }
    }
    const common = /\b((?:senior|junior|lead|principal|associate)?\s*(?:frontend|backend|full[- ]stack|software|web|java|python|data|machine learning|devops|cloud|mobile|ios|android)?\s*(?:developer|engineer|scientist|analyst|architect))\b/i.exec(text);
    return common ? common[1].replace(/\s+/g, " ").trim() : "Technical Role";
}

function analyzeJD(jdText) {
    const text = String(jdText || "");
    const experience = detectExperience(text);
    const skills = detectSkills(text);

    const responsibilities = [
        ...extractSection(text, ["responsibilities", "what you'll do", "what you will do"]),
        ...extractSection(text, ["nice to have", "preferred"]) // kept as optional context only
    ];
    const requirements = [
        ...extractSection(text, ["requirements", "qualifications", "skills", "required"]),
        ...extractSection(text, ["nice to have", "preferred"])
    ];

    const unique = arr => [...new Set(arr)];
    const keySkills = unique(skills.map(s => s.technology));

    return {
        role: detectRole(text),
        experience,
        skills,
        keySkills,
        responsibilities: unique(responsibilities).slice(0, 30),
        requirements: unique(requirements).slice(0, 30),
        summary: `${experience} level technical interview preparation for ${detectRole(text)}`
    };
}

module.exports = { analyzeJD };
