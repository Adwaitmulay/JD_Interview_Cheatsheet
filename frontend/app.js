async function generate() {
    const jd = document.getElementById("jd").value.trim();
    const status = document.getElementById("status");
    const results = document.getElementById("results");

    if (jd.length < 50) {
        status.textContent = "Please paste a complete Job Description.";
        return;
    }

    status.textContent = "Generating complete interview cheatsheet...";

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jd })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Generation failed");
        }

        const c = data.cheatsheet;

        results.style.display = "block";

        document.getElementById("role").textContent =
            c.role || "Interview Cheatsheet";

        document.getElementById("summary").textContent =
            c.summary || `${c.experience || "fresher"} level technical interview preparation`;

        document.getElementById("skillList").innerHTML =
            (c.keySkills || []).map(x => `<span class="skill">${escapeHtml(x)}</span>`).join("");

        document.getElementById("responsibilities").innerHTML =
            makeList(c.responsibilities);

        document.getElementById("requirements").innerHTML =
            makeList(c.requirements);

        document.getElementById("skillPreparation").innerHTML =
            makeSkillPreparation(c.skillPreparation);

        document.getElementById("technicalQuestions").innerHTML =
            makeQuestions(c.technicalQuestions);

        document.getElementById("roleQuestionsList").innerHTML =
            makeQuestions(c.roleQuestions);

        document.getElementById("hrQuestions").innerHTML =
            makeQuestions(c.hrQuestions);

        document.getElementById("projectQuestions").innerHTML =
            makeQuestions(c.projectQuestions);

        document.getElementById("followUps").innerHTML =
            makeQuestions(c.followUpQuestions);

        document.getElementById("answerFramework").innerHTML =
            makeList(c.answerFramework);

        document.getElementById("mistakes").innerHTML =
            makeList(c.commonMistakes);

        document.getElementById("revisionList").innerHTML =
            makeList(c.lastMinuteRevision);

        document.getElementById("strategy").innerHTML =
            makeList(c.interviewStrategy);

        renderAdvancedSections(c);
        if (data.imageUrl) {
            let img = document.getElementById("generatedCheatSheetImage");
            if (!img) {
                img = document.createElement("img");
                img.id = "generatedCheatSheetImage";
                img.style.width = "100%";
                img.style.maxWidth = "900px";
                img.style.display = "block";
                img.style.margin = "25px auto";
                img.style.border = "1px solid #ddd";
                img.style.borderRadius = "10px";
                img.style.boxShadow = "0 4px 18px rgba(0,0,0,.12)";
                document.getElementById("results").prepend(img);
            }
            img.src = data.imageUrl;
            img.alt = "Generated Technical Interview Cheat Sheet";
        }

        status.textContent = "Complete interview cheatsheet generated successfully.";

        results.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        console.error(error);
        status.textContent = "Could not generate cheatsheet: " + error.message;
    }
}

function renderAdvancedSections(c) {
    const skills = c.skills || [];

    let container = document.getElementById("advancedSections");

    if (!container) {
        container = document.createElement("div");
        container.id = "advancedSections";
        document.getElementById("results").appendChild(container);
    }

    container.innerHTML = skills.map(skill => `
        <div class="advanced-skill">

            <div class="section-card">
                <h2>${escapeHtml(skill.technology)}</h2>
                <p>
                    <b>Category:</b> ${escapeHtml(skill.category || "")}
                    &nbsp; | &nbsp;
                    <b>Level:</b> ${escapeHtml(skill.experienceLevel || "")}
                    &nbsp; | &nbsp;
                    <b>Focus:</b> ${escapeHtml(skill.focus || "")}
                </p>
            </div>

            ${section("Priority Topics", makeList(skill.priorityTopics))}
            ${section("Fundamentals", makeList(skill.fundamentals))}
            ${section("Concepts", makeConcepts(skill.topics || []))}
            ${section("One-Liners / Syntax", makeList(skill.oneLiners))}
            ${section("Modules", makeList(skill.modules))}
            ${section("Libraries", makeList(skill.libraries))}
            ${section("Data Structures", makeList(skill.dataStructures))}
            ${section("Algorithms", makeList(skill.algorithms))}
            ${section("Coding Patterns", makeList(skill.codingPatterns))}
            ${section("Tools", makeList(skill.tools))}
            ${section("Databases", makeList(skill.databases))}
            ${section("Commands", makeList(skill.commands))}
            ${section("System Design", makeList(skill.systemDesign))}
            ${section("Visual / Flow", makeVisuals(skill.visuals))}
            ${section("Interview Questions", makeQuestions(skill.interviewQuestions))}
            ${section("Quiz", makeQuiz(skill.quiz))}
            ${section("Common Mistakes", makeList(skill.commonMistakes))}
            ${section("Interview Traps", makeList(skill.interviewTraps))}
            ${section("Quick Revision", makeList(skill.quickRevision))}

        </div>
    `).join("");
}

function section(title, content) {
    return `
        <div class="section-card">
            <h2>${escapeHtml(title)}</h2>
            ${content}
        </div>
    `;
}

function makeConcepts(items) {
    if (!items.length) return empty();

    return items.map(topic => `
        <div class="concept-card">
            <h3>${escapeHtml(topic.topic || "")}</h3>
            ${topic.what ? `<p><b>What:</b> ${escapeHtml(topic.what)}</p>` : ""}
            ${topic.why ? `<p><b>Why:</b> ${escapeHtml(topic.why)}</p>` : ""}
            ${topic.how ? `<p><b>How:</b> ${escapeHtml(topic.how)}</p>` : ""}
            ${topic.example ? `<p><b>Example:</b> ${escapeHtml(topic.example)}</p>` : ""}
            ${topic.code ? `<pre>${escapeHtml(topic.code)}</pre>` : ""}
            ${topic.interviewQuestions?.length
                ? makeQuestions(topic.interviewQuestions)
                : ""}
        </div>
    `).join("");
}

function makeSkillPreparation(items) {
    if (!items?.length) return empty();

    return items.map(item => `
        <div class="skill-row">
            <strong>${escapeHtml(item.skill || "")}</strong>
            <span class="priority">${escapeHtml(item.priority || "")}</span>
            ${makeList(item.prepare)}
        </div>
    `).join("");
}

function makeQuestions(items) {
    if (!items?.length) return empty();

    return items.map((item, index) => `
        <div class="q">
            <b>${index + 1}. ${escapeHtml(item.question || item)}</b>
            ${item.answer
                ? `<p><b>Answer:</b> ${escapeHtml(item.answer)}</p>`
                : ""}
            ${item.answerPoints ? makeList(item.answerPoints) : ""}
            ${item.followUps?.length
                ? `<p><b>Follow-ups:</b></p>${makeList(item.followUps)}`
                : ""}
        </div>
    `).join("");
}

function makeQuiz(items) {
    if (!items?.length) return empty();

    return items.map((item, index) => `
        <div class="q">
            <b>${index + 1}. ${escapeHtml(item.question || "")}</b>
            ${item.answer
                ? `<p><b>Answer:</b> ${escapeHtml(item.answer)}</p>`
                : ""}
        </div>
    `).join("");
}

function makeVisuals(items) {
    if (!items?.length) return empty();

    return items.map(v => `
        <div class="visual-card">
            <h3>${escapeHtml(v.title || "")}</h3>
            <p><b>Type:</b> ${escapeHtml(v.type || "")}</p>
            <div class="flow">
                ${(v.steps || []).map((step, i) => `
                    <span class="flow-step">${escapeHtml(step)}</span>
                    ${i < v.steps.length - 1 ? "<span class='arrow'>→</span>" : ""}
                `).join("")}
            </div>
        </div>
    `).join("");
}

function makeList(items) {
    if (!items?.length) return empty();

    return "<ul>" +
        items.map(item => `<li>${escapeHtml(item)}</li>`).join("") +
        "</ul>";
}

function empty() {
    return "<div class='empty'>No information available.</div>";
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
