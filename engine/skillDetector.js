const { getAllTechnologies } = require("./knowledgeLoader");

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectSkills(jdText) {
    const text = jdText.toLowerCase();

    return getAllTechnologies()
        .filter(item => {
            const terms = [item.technology, ...(item.aliases || [])];

            return terms.some(term => {
                const escaped = escapeRegex(term.toLowerCase().trim());
                return new RegExp(`(?<![a-z0-9+#])${escaped}(?![a-z0-9+#])`, "i").test(text);
            });
        })
        .map(item => ({
            technology: item.technology,
            category: item.category
        }));
}

module.exports = { detectSkills };
