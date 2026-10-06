function getLevelContent(data, experience) {
    const focus = (data.levels?.[experience]?.length ? data.levels[experience] : (data.levels?.fresher?.length ? data.levels.fresher : (data.concepts || data.fundamentals || []))).slice(0,12);

    return {
        priorityTopics: focus,
        depth: experience === "fresher"
            ? "fundamentals"
            : experience === "junior"
                ? "fundamentals-and-practical"
                : experience === "mid"
                    ? "advanced-and-production"
                    : "architecture-and-leadership"
    };
}

module.exports = { getLevelContent };
