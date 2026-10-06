async function generate() {
    const jd = document.getElementById("jd").value.trim();
    const status = document.getElementById("status");
    const results = document.getElementById("results");

    if (jd.length < 50) {
        status.textContent = "Please paste a complete Job Description.";
        return;
    }

    status.textContent = "Generating technical cheat sheet...";

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jd })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || data.error || "Generation failed");
        }

        results.style.display = "block";
        const img = document.getElementById("generatedCheatSheetImage");
        img.src = data.imageUrl;
        img.alt = "Generated Technical Interview Cheat Sheet";

        status.textContent = "Technical cheat sheet generated successfully.";
        results.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        console.error(error);
        status.textContent = "Could not generate cheatsheet: " + error.message;
    }
}