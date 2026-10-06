async function generate() {
    const jd = document.getElementById("jd").value.trim();
    const status = document.getElementById("status");
    const results = document.getElementById("results");

    if (jd.length < 50) {
        status.textContent = "Please paste a complete Job Description.";
        return;
    }

    status.textContent = "Generating technical cheat sheet...";

    let lastError;

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 180000);

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jd }),
                signal: controller.signal
            });

            clearTimeout(timer);

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || data.error || "Generation failed");
            }

            results.style.display = "block";
            const img = document.getElementById("generatedCheatSheetImage");
            img.src = data.imageUrl + "?t=" + Date.now();
            img.alt = "Generated Technical Interview Cheat Sheet";

            status.textContent = "Technical cheat sheet generated successfully.";
            results.scrollIntoView({ behavior: "smooth" });
            return;
        } catch (error) {
            lastError = error;
            if (attempt < 3) {
                status.textContent = "Starting generator... retrying (" + (attempt + 1) + "/3)";
                await new Promise(resolve => setTimeout(resolve, 2500));
            }
        }
    }

    console.error(lastError);
    status.textContent = "Could not generate cheatsheet: " +
        (lastError?.name === "AbortError" ? "generation timed out" : lastError?.message || "please try again");
}