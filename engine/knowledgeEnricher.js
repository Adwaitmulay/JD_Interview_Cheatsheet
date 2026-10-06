function enrichTopic(topic) {
    const questions = topic.interviewQuestions || [];

    if (!questions.length && topic.what) {
        questions.push(
            {
                question: `What is ${topic.topic}?`,
                answer: topic.what
            },
            {
                question: `Why is ${topic.topic} important?`,
                answer: topic.why || topic.what
            },
            {
                question: `How does ${topic.topic} work?`,
                answer: topic.how || topic.what
            }
        );
    }

    const followUps = topic.followUps?.length
        ? topic.followUps
        : [
            `What are the advantages of ${topic.topic}?`,
            `What are common problems with ${topic.topic}?`
        ];

    const quiz = topic.quiz?.length
        ? topic.quiz
        : [
            {
                question: `What is the primary purpose of ${topic.topic}?`,
                answer: topic.why || topic.what
            }
        ];

    return {
        ...topic,
        interviewQuestions: questions,
        followUps,
        quiz
    };
}

function enrichTopics(topics) {
    return topics.map(enrichTopic);
}

module.exports = {
    enrichTopic,
    enrichTopics
};
