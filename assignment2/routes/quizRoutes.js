const express = require("express");
const apiClient = require("./apiClient");
const {
    buildQuestionPayload,
    buildQuizPayload,
    normalizeIds
} = require("./formParsers");

const router = express.Router();

const getErrorMessage = (error, fallbackMessage) => {
    return error.response?.data?.message || fallbackMessage;
};

const redirectWithSuccess = (res, path, message) => {
    res.redirect(`${path}?success=${encodeURIComponent(message)}`);
};

const mapQuizToFormData = (quiz = {}) => {
    return {
        ...quiz,
        selectedQuestionIds: (quiz.questions || []).map(question =>
            typeof question === "string" ? question : question?._id
        )
    };
};

const renderQuizForm = (res, config) => {
    res.render(config.view, {
        pageTitle: config.pageTitle,
        formTitle: config.formTitle,
        submitLabel: config.submitLabel,
        formAction: config.formAction,
        quiz: mapQuizToFormData(config.quiz),
        newQuestion: config.newQuestion || {
            text: "",
            optionsText: "",
            correctAnswerIndex: 0
        },
        allQuestions: config.allQuestions || [],
        errorMessage: config.errorMessage || null
    });
};

const getExistingQuestionIds = (quiz) => {
    return (quiz.questions || []).map(question =>
        typeof question === "string" ? question : question?._id
    );
};

const buildNewQuestionFromQuizForm = (body) => {
    const text = (body.newQuestionText || "").trim();
    const options = (body.newQuestionOptions || "").trim();
    const correctAnswerIndex = body.newQuestionCorrectAnswerIndex;

    if (!text && !options) {
        return null;
    }

    const payload = buildQuestionPayload({
        text,
        options,
        keywords: "",
        correctAnswerIndex
    });

    return {
        ...payload,
        optionsText: options
    };
};

const attachNewQuestionIfNeeded = async (questionIds, newQuestion) => {
    if (!newQuestion) {
        return questionIds;
    }

    const response = await apiClient.post("/questions", newQuestion);

    return [...new Set([...questionIds, response.data._id])];
};

router.get("/", async (req, res) => {
    try {
        const response = await apiClient.get("/quizzes");

        res.render("quizzes/list.ejs", {
            pageTitle: "Quiz Management",
            quizzes: response.data
        });
    } catch (error) {
        res.status(500).send(getErrorMessage(error, "Cannot load quizzes"));
    }
});

router.get("/create", async (req, res) => {
    try {
        const questionsResponse = await apiClient.get("/questions");

        renderQuizForm(res, {
            view: "quizzes/create.ejs",
            pageTitle: "Create New Quiz",
            formTitle: "Create New Quiz",
            submitLabel: "Create",
            formAction: "/quizzes",
            quiz: {},
            allQuestions: questionsResponse.data
        });
    } catch (error) {
        res.status(500).send(getErrorMessage(error, "Cannot load quiz form"));
    }
});

router.post("/", async (req, res) => {
    const payload = buildQuizPayload(req.body);
    const newQuestion = buildNewQuestionFromQuizForm(req.body);

    try {
        payload.questions = await attachNewQuestionIfNeeded(payload.questions, newQuestion);
        await apiClient.post("/quizzes", payload);
        redirectWithSuccess(res, "/quizzes", "Create quiz successfully");
    } catch (error) {
        try {
            const questionsResponse = await apiClient.get("/questions");

            renderQuizForm(res, {
                view: "quizzes/create.ejs",
                pageTitle: "Create New Quiz",
                formTitle: "Create New Quiz",
                submitLabel: "Create",
                formAction: "/quizzes",
                quiz: payload,
                newQuestion,
                allQuestions: questionsResponse.data,
                errorMessage: getErrorMessage(error, "Cannot create quiz")
            });
        } catch (loadError) {
            res.status(500).send(getErrorMessage(loadError, "Cannot load quiz form"));
        }
    }
});

router.get("/:quizId", async (req, res) => {
    try {
        const [quizResponse, questionsResponse] = await Promise.all([
            apiClient.get(`/quizzes/${req.params.quizId}`),
            apiClient.get("/questions")
        ]);

        const quiz = quizResponse.data;
        const selectedQuestionIds = new Set(getExistingQuestionIds(quiz));
        const availableQuestions = questionsResponse.data.filter(
            question => !selectedQuestionIds.has(question._id)
        );

        res.render("quizzes/detail.ejs", {
            pageTitle: "Quiz Detail",
            quiz,
            availableQuestions,
            errorMessage: null
        });
    } catch (error) {
        res.status(500).send(getErrorMessage(error, "Cannot load quiz detail"));
    }
});

router.get("/:quizId/edit", async (req, res) => {
    try {
        const [quizResponse, questionsResponse] = await Promise.all([
            apiClient.get(`/quizzes/${req.params.quizId}`),
            apiClient.get("/questions")
        ]);

        renderQuizForm(res, {
            view: "quizzes/edit.ejs",
            pageTitle: "Edit Quiz",
            formTitle: "Edit Quiz",
            submitLabel: "Update",
            formAction: `/quizzes/${req.params.quizId}?_method=PUT`,
            quiz: quizResponse.data,
            allQuestions: questionsResponse.data
        });
    } catch (error) {
        res.status(500).send(getErrorMessage(error, "Cannot load quiz for editing"));
    }
});

router.put("/:quizId", async (req, res) => {
    const payload = buildQuizPayload(req.body);
    const newQuestion = buildNewQuestionFromQuizForm(req.body);

    try {
        payload.questions = await attachNewQuestionIfNeeded(payload.questions, newQuestion);
        await apiClient.put(`/quizzes/${req.params.quizId}`, payload);
        redirectWithSuccess(
            res,
            `/quizzes/${req.params.quizId}`,
            "Update quiz successfully"
        );
    } catch (error) {
        try {
            const questionsResponse = await apiClient.get("/questions");

            renderQuizForm(res, {
                view: "quizzes/edit.ejs",
                pageTitle: "Edit Quiz",
                formTitle: "Edit Quiz",
                submitLabel: "Update",
                formAction: `/quizzes/${req.params.quizId}?_method=PUT`,
                quiz: {
                    ...payload,
                    _id: req.params.quizId
                },
                newQuestion,
                allQuestions: questionsResponse.data,
                errorMessage: getErrorMessage(error, "Cannot update quiz")
            });
        } catch (loadError) {
            res.status(500).send(getErrorMessage(loadError, "Cannot load quiz form"));
        }
    }
});

router.delete("/:quizId", async (req, res) => {
    try {
        await apiClient.delete(`/quizzes/${req.params.quizId}`);
        redirectWithSuccess(res, "/quizzes", "Delete quiz successfully");
    } catch (error) {
        res.status(500).send(getErrorMessage(error, "Cannot delete quiz"));
    }
});

router.post("/:quizId/link-questions", async (req, res) => {
    const selectedQuestionIds = normalizeIds(req.body.selectedQuestionIds);

    try {
        const quizResponse = await apiClient.get(`/quizzes/${req.params.quizId}`);
        const quiz = quizResponse.data;

        const mergedQuestionIds = [
            ...new Set([
                ...getExistingQuestionIds(quiz),
                ...selectedQuestionIds
            ])
        ];

        await apiClient.put(`/quizzes/${req.params.quizId}`, {
            title: quiz.title,
            description: quiz.description,
            questions: mergedQuestionIds
        });

        redirectWithSuccess(
            res,
            `/quizzes/${req.params.quizId}`,
            "Add questions to quiz successfully"
        );
    } catch (error) {
        res.status(500).send(getErrorMessage(error, "Cannot add questions to quiz"));
    }
});

router.post("/:quizId/questions/:questionId/remove", async (req, res) => {
    try {
        const quizResponse = await apiClient.get(`/quizzes/${req.params.quizId}`);
        const quiz = quizResponse.data;

        const remainingQuestionIds = getExistingQuestionIds(quiz).filter(
            questionId => questionId !== req.params.questionId
        );

        await apiClient.put(`/quizzes/${req.params.quizId}`, {
            title: quiz.title,
            description: quiz.description,
            questions: remainingQuestionIds
        });

        redirectWithSuccess(
            res,
            `/quizzes/${req.params.quizId}`,
            "Remove question from quiz successfully"
        );
    } catch (error) {
        res.status(500).send(getErrorMessage(error, "Cannot remove question from quiz"));
    }
});

module.exports = router;
