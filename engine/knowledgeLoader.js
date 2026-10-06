const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "knowledge");

function loadJsonFiles(dir) {
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir)
        .filter(file => file.endsWith(".json"))
        .map(file => {
            const fullPath = path.join(dir, file);
            const content = fs.readFileSync(fullPath, "utf8").replace(/^\uFEFF/, "");
            return JSON.parse(content);
        })
        .flat();
}

function loadKnowledgeBase() {
    const categories = {};

    for (const category of fs.readdirSync(ROOT)) {
        const categoryPath = path.join(ROOT, category);

        if (!fs.statSync(categoryPath).isDirectory()) continue;

        categories[category] = loadJsonFiles(categoryPath);
    }

    return categories;
}

function getAllTechnologies() {
    const knowledge = loadKnowledgeBase();

    return Object.values(knowledge)
        .flat()
        .map(item => ({
            technology: item.technology,
            aliases: item.aliases || [],
            category: item.category
        }));
}

function findTechnology(name) {
    const normalized = name.toLowerCase();

    return getAllTechnologies().find(item =>
        item.technology.toLowerCase() === normalized ||
        item.aliases.some(alias => alias.toLowerCase() === normalized)
    );
}

module.exports = {
    loadKnowledgeBase,
    getAllTechnologies,
    findTechnology
};
