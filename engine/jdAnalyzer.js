const { detectSkills } = require("./skillDetector");
const { detectExperience } = require("./experienceDetector");

function analyzeJD(jdText) {
    return {
        experience: detectExperience(jdText),
        skills: detectSkills(jdText)
    };
}

module.exports = { analyzeJD };

