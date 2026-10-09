const toArray = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "string" && value.trim()) {
        return value.split(/\r?\n|,/);
    }

    return [];
};

const normalizeStrings = (value) => {
    return toArray(value)
        .map(item => item.trim())
        .filter(Boolean);
};

const normalizeIds = (value) => {
    return toArray(value)
        .map(item => item.trim())
        .filter(Boolean);
};

const buildQuestionPayload = (body) => {
    return {
        text: (body.text || "").trim(),
        options: normalizeStrings(body.options),
        keywords: normalizeStrings(body.keywords),
        correctAnswerIndex: Number(body.correctAnswerIndex)
    };
};

const buildQuizPayload = (body) => {
    return {
        title: (body.title || "").trim(),
        description: (body.description || "").trim(),
        questions: normalizeIds(body.selectedQuestionIds)
    };
};

module.exports = {
    buildQuestionPayload,
    buildQuizPayload,
    normalizeIds
};
