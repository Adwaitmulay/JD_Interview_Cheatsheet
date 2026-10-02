function esc(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function list(items) {
    if (!items || !items.length) {
        return '<div class="empty">No specific information extracted from this JD.</div>';
    }

    return `<ul>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
}

function questions(items) {
    if (!items || !items.length) {
        return '<div class="empty">No questions generated.</div>';
    }

    return items.map((x, i) =>
        `<div class="q"><b>${i + 1}.</b> ${esc(x)}</div>`
    ).join("");
}

function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jd })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Generation failed");
        }

        const c = data.cheatsheet;

        document.getElementById("results").style.display = "block";

        document.getElementById("role").textContent =
            c.role || "Target Role";

        document.getElementById("summary").textContent =
            c.summary || "";

        document.getElementById("skillList").innerHTML =
            (c.keySkills || []).map(s =>
                `<span class="skill">${esc(s)}</span>`
            ).join("") ||
            '<span class="empty">No skills detected.</span>';

        document.getElementById("responsibilities").innerHTML =
            list(c.responsibilities);

        document.getElementById("requirements").innerHTML =
            list(c.requirements);

        document.getElementById("skillPreparation").innerHTML =
            (c.skillPreparation || []).map(item => `
                <div class="skill-row">
                    <strong>${esc(item.skill)}</strong>
                    ${list(item.revise)}
                </div>
            `).join("") ||
            '<div class="empty">No skill preparation data.</div>';

        document.getElementById("technicalQuestions").innerHTML =
            questions(c.technicalQuestions);

        document.getElementById("roleQuestionsList").innerHTML =
            questions(c.roleQuestions);

        document.getElementById("hrQuestions").innerHTML =
            questions(c.hrQuestions);

        document.getElementById("projectQuestions").innerHTML =
            questions(c.projectQuestions);

        document.getElementById("followUps").innerHTML =
            questions(c.followUpQuestions);

        document.getElementById("answerFramework").innerHTML =
            list(c.answerFramework);

        document.getElementById("mistakes").innerHTML =
            list(c.commonMistakes);

        document.getElementById("revisionList").innerHTML =
            list(c.lastMinuteRevision);

        document.getElementById("strategy").innerHTML =
            list(c.interviewStrategy);

        status.textContent =
            "Cheatsheet generated successfully.";

        document.getElementById("results")
            .scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        console.error(error);
        status.textContent =
            "Could not generate cheatsheet: " + error.message;
    }
}
