const { loadKnowledgeBase } = require("./knowledgeLoader");
const { getLevelContent } = require("./levelEngine");
const { getExperienceSections } = require("./experienceEngine");
const { buildTopics } = require("./topicBuilder");
const { enrichTopics } = require("./knowledgeEnricher");
const { buildInterviewQuestions, buildQuiz } = require("./interviewGenerator");
const { buildRolePreparation } = require("./rolePrepEngine");

function findKnowledge(technology) {
    const knowledge = loadKnowledgeBase();

    for (const items of Object.values(knowledge)) {
        const found = items.find(item =>
            item.technology.toLowerCase() === technology.toLowerCase()
        );

        if (found) return found;
    }

    return null;
}

function buildSkillCheatsheet(skill, experience) {
    const data = findKnowledge(skill.technology);

    if (!data) return null;

    const level = getLevelContent(data, experience);
    const experienceSections = getExperienceSections(data, experience);

    const topicSource = {
        ...(data.concepts || []).reduce((obj, topic) => {
            obj[topic] = {};
            return obj;
        }, {}),
        ...(data.conceptDetails || {})
    };

    const enrichedTopics = enrichTopics(buildTopics(topicSource));

    const detailedTopics = Object.entries(data.conceptDetails || {}).map(([topic, details]) => ({
        topic,
        what: details.what || "",
        why: details.why || "",
        how: details.how || "",
        example: details.example || "",
        code: details.code || "",
        interviewQuestions: details.interviewQuestions || [],
        followUps: details.followUps || [],
        quiz: details.quiz || [],
        visual: details.visual || ""
    }));

    const mergedTopics = [
        ...detailedTopics,
        ...enrichedTopics.filter(topic => !data.conceptDetails?.[topic.topic])
    ];

    const interviewQuestions = buildInterviewQuestions({
        technology: data.technology,
        topics: enrichedTopics,
        interviewQuestions: data.interviewQuestions || []
    });

    const quiz = buildQuiz({
        technology: data.technology,
        topics: enrichedTopics,
        quiz: data.quiz || []
    });

    const rolePreparation = buildRolePreparation(
        data.technology,
        data.category
    );

    return {
        technology: data.technology,
        category: data.category,
        experienceLevel: experience,

        priorityTopics: level.priorityTopics,
        depth: level.depth,
        focus: experienceSections.focus,

        topics: enrichedTopics,
        sections: experienceSections.sections,

        fundamentals: data.fundamentals || [],
        oneLiners: data.oneLiners || [],
        modules: data.modules || [],
        libraries: data.libraries || [],
        concepts: data.concepts || [],
        dataStructures: data.dataStructures || [],
        algorithms: data.algorithms || [],
        codingPatterns: data.codingPatterns || [],
        tools: data.tools || [],
        databases: data.databases || [],

        systemDesign: rolePreparation.systemDesign.length
            ? rolePreparation.systemDesign
            : (data.systemDesign || []),

        commonMistakes: data.commonMistakes || [],
        interviewTraps: data.interviewTraps || [],
        quickRevision: data.quickRevision || [],
        commands: data.commands || [],

        visuals: rolePreparation.visuals.length
            ? rolePreparation.visuals
            : (data.visuals || []),

        interviewQuestions,
        quiz
    };
}

function buildCheatsheet(analysis) {
    const categoryPriority = {
        language: 1,
        web: 2,
        database: 3,
        devops: 4,
        cloud: 5,
        "ai-data": 6
    };

    const orderedSkills = [...analysis.skills].sort((a, b) =>
        (categoryPriority[a.category] || 99) -
        (categoryPriority[b.category] || 99)
    );

    return {
        role: analysis.role || "Technical Role",
        summary: analysis.summary || `${analysis.experience || "fresher"} level technical interview preparation`,
        keySkills: analysis.keySkills || orderedSkills.map(s => s.technology),
        responsibilities: analysis.responsibilities || [],
        requirements: analysis.requirements || [],
        experience: analysis.experience,

        skills: orderedSkills
            .map(skill => buildSkillCheatsheet(skill, analysis.experience))
            .filter(Boolean)
    };
}

module.exports = {
    buildCheatsheet
};
