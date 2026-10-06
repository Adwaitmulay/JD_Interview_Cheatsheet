function buildInterviewQuestions(skill) {
    const questions = [];

    // 1. Technology-level questions
    for (const item of skill.interviewQuestions || []) {
        if (typeof item === "string") {
            questions.push({
                technology: skill.technology,
                topic: "General",
                question: item,
                answer: "",
                followUps: []
            });
        } else if (item && item.question) {
            questions.push({
                technology: skill.technology,
                topic: item.topic || "General",
                question: item.question,
                answer: item.answer || "",
                followUps: item.followUps || []
            });
        }
    }

    // 2. Topic-level questions
    for (const topic of skill.topics || []) {
        for (const item of topic.interviewQuestions || []) {
            if (typeof item === "string") {
                questions.push({
                    technology: skill.technology,
                    topic: topic.topic,
                    question: item,
                    answer: topic.what || topic.how || "",
                    followUps: topic.followUps || []
                });
            } else if (item && item.question) {
                questions.push({
                    technology: skill.technology,
                    topic: topic.topic,
                    question: item.question,
                    answer: item.answer || topic.what || topic.how || "",
                    followUps: item.followUps || topic.followUps || []
                });
            }
        }

        // 3. Guaranteed topic fallback
        if (!topic.interviewQuestions?.length) {
            questions.push({
                technology: skill.technology,
                topic: topic.topic,
                question: `What is ${topic.topic} in ${skill.technology}?`,
                answer: topic.what || `Explain the definition, purpose, working, advantages and practical use of ${topic.topic}.`,
                followUps: [
                    `Why is ${topic.topic} important?`,
                    `How is ${topic.topic} used in real projects?`
                ]
            });

            questions.push({
                technology: skill.technology,
                topic: topic.topic,
                question: `How does ${topic.topic} work?`,
                answer: topic.how || `Explain how ${topic.topic} works internally and demonstrate it with a practical example.`,
                followUps: [
                    `What are common mistakes with ${topic.topic}?`,
                    `What are the limitations of ${topic.topic}?`
                ]
            });
        }
    }

    return questions;
}

function buildQuiz(skill) {
    const quizzes = [];

    // Technology-level quiz
    for (const item of skill.quiz || []) {
        if (typeof item === "string") {
            quizzes.push({
                technology: skill.technology,
                topic: "General",
                question: item,
                answer: ""
            });
        } else if (item && item.question) {
            quizzes.push({
                technology: skill.technology,
                topic: item.topic || "General",
                question: item.question,
                answer: item.answer || item.correctAnswer || ""
            });
        }
    }

    // Topic-level quiz
    for (const topic of skill.topics || []) {
        for (const item of topic.quiz || []) {
            if (!item || !item.question) continue;

            quizzes.push({
                technology: skill.technology,
                topic: topic.topic,
                question: item.question,
                answer: item.answer || item.correctAnswer || ""
            });
        }

        // Guaranteed quiz fallback
        if (!topic.quiz?.length) {
            quizzes.push({
                technology: skill.technology,
                topic: topic.topic,
                question: `Which statement best describes ${topic.topic}?`,
                answer: topic.what || `The answer should explain the core purpose and behavior of ${topic.topic}.`
            });
        }
    }

    return quizzes;
}

function buildInterviewPack(skill) {
    return {
        technology: skill.technology,
        experienceLevel: skill.experienceLevel,
        interviewQuestions: buildInterviewQuestions(skill),
        quiz: buildQuiz(skill),
        revision: skill.quickRevision || [],
        traps: skill.interviewTraps || [],
        mistakes: skill.commonMistakes || []
    };
}

module.exports = {
    buildInterviewPack,
    buildInterviewQuestions,
    buildQuiz
};
