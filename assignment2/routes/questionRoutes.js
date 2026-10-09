const express = require("express");
const apiClient = require("./apiClient");
const { buildQuestionPayload } = require("./formParsers");

const router = express.Router();

const getErrorMessage = (error, fallbackMessage) => {
    return error.response?.data?.message || fallbackMessage;
};

const redirectWithSuccess = (res, path, message) => {
    res.redirect(`${path}?success=${encodeURIComponent(message)}`);
};

const mapQuestionToFormData = (question = {}) => {
    return {
        ...question,
        optionsText: Array.isArray(question.options) ? question.options.join(", ") : "",
        keywordsText: Array.isArray(question.keywords) ? question.keywords.join(", ") : "",
        correctAnswerIndex: question.correctAnswerIndex ?? 0
    };
};

const renderForm = (res, config) => {
    res.render(config.view, {
        pageTitle: config.pageTitle,
        formTitle: config.formTitle,
        submitLabel: config.submitLabel,
        formAction: config.formAction,
        question: mapQuestionToFormData(config.question),
        errorMessage: config.errorMessage || null
    });
};

router.get("/", async (req, res) => {
    try {
        const response = await apiClient.get("/questions");

        res.render("questions/list.ejs", {
            pageTitle: "Question Management",
            questions: response.data
        });
    } catch (error) {
        res.status(500).send(getErrorMessage(error, "Cannot load questions"));
    }
});

router.get("/create", (req, res) => {
    renderForm(res, {
        view: "questions/create.ejs",
        pageTitle: "Create New Question",
        formTitle: "Create New Question",
        submitLabel: "Create",
        formAction: "/questions",
        question: {}
    });
});

router.post("/", async (req, res) => {
    const payload = buildQuestionPayload(req.body);

    try {
        await apiClient.post("/questions", payload);
        redirectWithSuccess(res, "/questions", "Create question successfully");
    } catch (error) {
        renderForm(res, {
            view: "questions/create.ejs",
            pageTitle: "Create New Question",
            formTitle: "Create New Question",
            submitLabel: "Create",
            formAction: "/questions",
            question: payload,
            errorMessage: getErrorMessage(error, "Cannot create question")
        });
    }
});

router.get("/:questionId", async (req, res) => {
    try {
        const [questionResponse, quizzesResponse] = await Promise.all([
            apiClient.get(`/questions/${req.params.questionId}`),
            apiClient.get("/quizzes")
        ]);

        const relatedQuizzes = quizzesResponse.data.filter(quiz =>
            (quiz.questions || []).some(question => {
                const questionId = typeof question === "string" ? question : question?._id;
                return questionId === req.params.questionId;
            })
        );

        res.render("questions/detail.ejs", {
            pageTitle: "Question Detail",
            question: questionResponse.data,
            relatedQuizzes
        });
    } catch (error) {
        res.status(500).send(getErrorMessage(error, "Cannot load question detail"));
    }
});

router.get("/:questionId/edit", async (req, res) => {
    try {
        const response = await apiClient.get(`/questions/${req.params.questionId}`);

        renderForm(res, {
            view: "questions/edit.ejs",
            pageTitle: "Edit Question",
            formTitle: "Edit Question",
            submitLabel: "Update",
            formAction: `/questions/${req.params.questionId}?_method=PUT`,
            question: response.data
        });
    } catch (error) {
        res.status(500).send(getErrorMessage(error, "Cannot load question for editing"));
    }
});

router.put("/:questionId", async (req, res) => {
    const payload = buildQuestionPayload(req.body);

    try {
        await apiClient.put(`/questions/${req.params.questionId}`, payload);
        redirectWithSuccess(
            res,
            `/questions/${req.params.questionId}`,
            "Update question successfully"
        );
    } catch (error) {
        renderForm(res, {
            view: "questions/edit.ejs",
            pageTitle: "Edit Question",
            formTitle: "Edit Question",
            submitLabel: "Update",
            formAction: `/questions/${req.params.questionId}?_method=PUT`,
            question: {
                ...payload,
                _id: req.params.questionId
            },
            errorMessage: getErrorMessage(error, "Cannot update question")
        });
    }
});

router.delete("/:questionId", async (req, res) => {
    try {
        await apiClient.delete(`/questions/${req.params.questionId}`);
        redirectWithSuccess(res, "/questions", "Delete question successfully");
    } catch (error) {
        res.status(500).send(getErrorMessage(error, "Cannot delete question"));
    }
});

module.exports = router;
