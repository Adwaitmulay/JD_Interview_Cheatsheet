function buildTopic(topic, data = {}) {
    return {
        topic,
        what: data.what || "",
        why: data.why || "",
        how: data.how || "",
        example: data.example || "",
        code: data.code || "",
        interviewQuestions: (data.interviewQuestions || []).map(q => typeof q === "string" ? { question: q, answer: data.what || "" } : q),
        followUps: data.followUps || [],
        quiz: data.quiz || [],
        visual: data.visual || ""
    };
}

function buildTopics(topics = {}) {
    if (Array.isArray(topics)) {
        return topics.map(topic =>
            typeof topic === "string"
                ? buildTopic(topic)
                : buildTopic(topic.topic, topic)
        );
    }

    return Object.entries(topics).map(([topic, data]) =>
        buildTopic(topic, data)
    );
}

module.exports = {
    buildTopic,
    buildTopics
};

