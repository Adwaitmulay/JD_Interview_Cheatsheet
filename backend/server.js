const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "..", "frontend")));

function extractSection(jd, section) {
    const lines = jd.split(/\r?\n/);
    const start = lines.findIndex(x =>
        x.trim().toLowerCase().startsWith(section.toLowerCase())
    );

    if (start === -1) return [];

    const result = [];

    for (let i = start + 1; i < lines.length; i++) {
        const line = lines[i].trim();

        if (/^(job title|location|employment type|experience|job description|responsibilities|required skills|preferred skills|education|what we look for|qualifications)\s*:/i.test(line)) {
            break;
        }

        if (line) {
            result.push(
                line.replace(/^[-•*]\s*/, "").trim()
            );
        }
    }

    return result;
}

function detectSkills(jd) {
    const skills = [
        "Java",
        "Spring Boot",
        "REST API",
        "SQL",
        "Git",
        "JavaScript",
        "React",
        "Docker",
        "AWS",
        "JUnit",
        "CI/CD"
    ];

    const lower = jd.toLowerCase();

    return skills.filter(skill =>
        lower.includes(skill.toLowerCase())
    );
}

function generateCheatsheet(jd) {
    const titleMatch = jd.match(/Job Title\s*:\s*(.+)/i);

    const role = titleMatch
        ? titleMatch[1].trim()
        : "Target Role";

    const responsibilities = extractSection(jd, "Responsibilities:");
    const required = extractSection(jd, "Required Skills:");
    const preferred = extractSection(jd, "Preferred Skills:");
    const education = extractSection(jd, "Education:");

    const skills = detectSkills(jd);

    const technicalQuestions = skills.flatMap(skill => [
        {
            skill,
            question: `What is ${skill} and how is it used in this role?`,
            answerPoints: [
                `Explain the basic concept of ${skill}.`,
                `Explain how it is relevant to the job.`,
                "Give a practical example.",
                "Mention common problems or limitations."
            ]
        },
        {
            skill,
            question: `Explain an important interview concept related to ${skill}.`,
            answerPoints: [
                "Define the concept clearly.",
                "Explain how it works.",
                "Give a practical example.",
                "Connect it with the JD."
            ]
        }
    ]);

    return {
        role,
        summary: `Complete interview preparation for the ${role} position based directly on the provided Job Description.`,

        keySkills: skills,

        requiredSkills: required,

        preferredSkills: preferred,

        responsibilities,

        requirements: [
            ...required,
            ...education
        ],

        skillPreparation: skills.map(skill => ({
            skill,
            priority: required.some(x =>
                x.toLowerCase().includes(skill.toLowerCase())
            ) ? "REQUIRED" : "PREFERRED",
            prepare: [
                `Understand ${skill} fundamentals.`,
                `Prepare common ${skill} interview questions.`,
                `Prepare one practical example using ${skill}.`,
                `Understand debugging and common mistakes.`,
                `Connect ${skill} with the responsibilities in this JD.`
            ]
        })),

        technicalQuestions,

        roleQuestions: responsibilities.map((item, i) => ({
            question: `How would you handle this responsibility: "${item}"?`,
            answerPoints: [
                "Explain your approach step by step.",
                "Mention the relevant technology or concept.",
                "Give a real project or academic example.",
                "Explain how you would test the result."
            ]
        })),

        hrQuestions: [
            {
                question: "Tell me about yourself.",
                answerPoints: [
                    "Give a short introduction.",
                    "Mention relevant technical skills.",
                    "Mention one relevant project.",
                    "Connect yourself to the role."
                ]
            },
            {
                question: "Why are you interested in this role?",
                answerPoints: [
                    "Connect your skills to the JD.",
                    "Mention relevant responsibilities.",
                    "Show willingness to learn."
                ]
            },
            {
                question: "Why should we hire you?",
                answerPoints: [
                    "Mention relevant skills.",
                    "Support them with project examples.",
                    "Mention problem-solving ability.",
                    "Show willingness to learn."
                ]
            },
            {
                question: "Tell me about a difficult technical problem you solved.",
                answerPoints: [
                    "Explain the problem.",
                    "Explain your approach.",
                    "Explain the solution.",
                    "Explain the result."
                ]
            },
            {
                question: "Tell me about a time you worked in a team.",
                answerPoints: [
                    "Explain the project.",
                    "Explain your contribution.",
                    "Explain collaboration.",
                    "Mention the result."
                ]
            }
        ],

        projectQuestions: [
            {
                question: "Explain your most relevant project from start to finish.",
                answerPoints: [
                    "Problem statement.",
                    "Your contribution.",
                    "Technology stack.",
                    "Technical challenges.",
                    "Testing.",
                    "Final result."
                ]
            },
            {
                question: "Why did you choose your technology stack?",
                answerPoints: [
                    "Explain the project requirement.",
                    "Explain your technology choices.",
                    "Mention alternatives.",
                    "Explain the trade-offs."
                ]
            },
            {
                question: "What was the biggest technical challenge?",
                answerPoints: [
                    "Explain the problem.",
                    "Explain how you investigated it.",
                    "Explain the solution.",
                    "Explain what you learned."
                ]
            },
            {
                question: "How did you test and debug your project?",
                answerPoints: [
                    "Explain your testing approach.",
                    "Explain how bugs were reproduced.",
                    "Explain how they were fixed.",
                    "Explain how you verified the solution."
                ]
            }
        ],

        followUpQuestions: [
            {
                question: "Why did you choose that approach?",
                answerPoints: [
                    "Explain your reasoning.",
                    "Mention the requirement.",
                    "Mention alternatives."
                ]
            },
            {
                question: "Can you explain that with a real example?",
                answerPoints: [
                    "Use a real project.",
                    "Explain what you personally did.",
                    "Connect it to the JD."
                ]
            },
            {
                question: "What are the limitations?",
                answerPoints: [
                    "Mention a genuine limitation.",
                    "Explain its impact.",
                    "Explain how you would handle it."
                ]
            },
            {
                question: "How would you optimize it?",
                answerPoints: [
                    "Identify the bottleneck.",
                    "Explain the improvement.",
                    "Explain how you would measure it."
                ]
            }
        ],

        answerFramework: [
            "Start with a direct answer.",
            "Explain the concept simply.",
            "Give a practical example.",
            "Connect the answer to the JD or your project.",
            "Mention a limitation or trade-off when relevant."
        ],

        commonMistakes: [
            "Do not claim skills you cannot explain.",
            "Do not memorize answers without understanding them.",
            "Do not ignore responsibilities in the JD.",
            "Do not give unnecessarily long answers.",
            "Do not claim project experience you do not have."
        ],

        lastMinuteRevision: [
            ...skills.map(skill => `Revise ${skill} fundamentals and common interview questions.`),
            "Read the complete JD once again.",
            "Prepare your self-introduction.",
            "Prepare 2–3 project examples.",
            "Practice explaining your strongest project in 2 minutes.",
            "Practice technical answers aloud."
        ],

        interviewStrategy: [
            "Understand the JD before the interview.",
            "Prepare every required skill.",
            "Review preferred skills at a basic level.",
            "Prepare examples from your real projects.",
            "Connect your answers directly to the JD.",
            "Be honest when you do not know something."
        ]
    };
}

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "JD Interview Cheatsheet API is running"
    });
});

app.post("/api/generate", (req, res) => {
    try {
        const jd = String(req.body?.jd || "").trim();

        if (jd.length < 100) {
            return res.status(400).json({
                success: false,
                message: "Please provide a complete Job Description."
            });
        }

        const cheatsheet = generateCheatsheet(jd);

        res.json({
            success: true,
            title: "Interview Cheatsheet",
            generatedFrom: "Job Description",
            cheatsheet
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack
        });
    }
});

app.listen(PORT, () => {
    console.log(`InterviewPrep server running on http://localhost:${PORT}`);
});
