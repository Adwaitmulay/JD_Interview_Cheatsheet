function getExperienceSections(data, experience) {
    const sections = {
        fundamentals: data.fundamentals || [],
        concepts: data.concepts || [],
        codingPatterns: data.codingPatterns || [],
        interviewTraps: data.interviewTraps || [],
        commonMistakes: data.commonMistakes || [],
        quickRevision: data.quickRevision || []
    };

    if (experience === "fresher") {
        return {
            focus: "fundamentals",
            sections
        };
    }

    if (experience === "junior") {
        return {
            focus: "practical",
            sections
        };
    }

    if (experience === "mid") {
        return {
            focus: "advanced-production",
            sections: {
                ...sections,
                algorithms: data.algorithms || [],
                tools: data.tools || [],
                systemDesign: data.systemDesign || [],
                commands: data.commands || []
            }
        };
    }

    return {
        focus: "architecture",
        sections: {
            ...sections,
            algorithms: data.algorithms || [],
            tools: data.tools || [],
            systemDesign: data.systemDesign || [],
            commands: data.commands || []
        }
    };
}

module.exports = { getExperienceSections };
