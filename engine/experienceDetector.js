function detectExperience(jdText) {
    const text = String(jdText || "").toLowerCase();

    // Handles ranges: "1-2 years", "3 to 5 years", etc.
    const yearRange = text.match(
        /\b(\d+)\s*(?:-|–|—|to)\s*(\d+)\s*(?:years?|yrs?)\b/i
    );

    if (yearRange) {
        const minYears = Number(yearRange[1]);

        if (minYears >= 6) return "senior";
        if (minYears >= 3) return "mid";
        if (minYears >= 1) return "junior";
        return "fresher";
    }

    // Handles: "1 year", "2 years", "3 years", "5+ years"
    const singleYear = text.match(
        /\b(\d+)\s*\+?\s*(?:years?|yrs?)\b/i
    );

    if (singleYear) {
        const years = Number(singleYear[1]);

        if (years >= 6) return "senior";
        if (years >= 3) return "mid";
        if (years >= 1) return "junior";
        return "fresher";
    }

    if (/\b(?:senior|lead|principal|staff)\b/.test(text)) {
        return "senior";
    }

    if (/\b(?:junior|associate)\b/.test(text)) {
        return "junior";
    }

    if (/\b(?:fresher|intern|internship|entry[- ]level|graduate)\b/.test(text)) {
        return "fresher";
    }

    return "fresher";
}

module.exports = { detectExperience };
