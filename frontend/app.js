async function generate() {
    const jd = document.getElementById("jd").value.trim();
    const status = document.getElementById("status");

    if (jd.length < 50) {
        status.textContent = "Please paste a complete Job Description.";
        return;
    }

    status.textContent = "Generating interview cheatsheet...";

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ jd })
        });

        const data = await response.json();

        console.log("API RESPONSE:", data);

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Generation failed");
        }

        const c = data.cheatsheet;

        document.getElementById("results").style.display = "block";

        document.getElementById("role").textContent = c.role || "Target Role";
        document.getElementById("summary").textContent = c.summary || "";

        document.getElementById("skillList").innerHTML =
            (c.keySkills || []).map(skill =>
                `<span class="skill">${skill}</span>`
            ).join("");

        document.getElementById("responsibilities").innerHTML =
            makeList(c.responsibilities);

        document.getElementById("requirements").innerHTML =
            makeList(c.requirements);

        document.getElementById("skillPreparation").innerHTML =
            makeSkills(c.skillPreparation);

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

        status.textContent = "Cheatsheet generated successfully.";

        document.getElementById("results")
            .scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        console.error("GENERATION ERROR:", error);
        status.textContent = "Could not generate cheatsheet: " + error.message;
    }
}

function makeList(items) {
    if (!items || !items.length) {
        return "<div class='empty'>No information extracted.</div>";
    }

    return "<ul>" +
        items.map(item => `<li>${escapeHtml(item)}</li>`).join("") +
        "</ul>";
}

function makeSkills(items) {
    if (!items || !items.length) {
        return "<div class='empty'>No skill preparation data.</div>";
    }

    return items.map(item => `
        <div class="skill-row">
            <strong>${escapeHtml(item.skill)}</strong>
            <span class="priority">${escapeHtml(item.priority || "")}</span>
            ${makeList(item.prepare)}
        </div>
    `).join("");
}

function makeQuestions(items) {
    if (!items || !items.length) {
        return "<div class='empty'>No questions generated.</div>";
    }

    return items.map((item, index) => `
        <div class="q">
            <b>${index + 1}. ${escapeHtml(item.question || item)}</b>
            ${item.skill ? `<div class="question-skill">Skill: ${escapeHtml(item.skill)}</div>` : ""}
            ${item.answerPoints ? makeList(item.answerPoints) : ""}
        </div>
    `).join("");
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
