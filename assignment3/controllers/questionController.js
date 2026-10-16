const Question = require("../models/Question");

// GET /question
const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();

        res.json(questions);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET /question/:questionId
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);

        if (!question) {
            return res.status(404).json({
                message: "Question not found"
            });
        }

        res.json(question);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// POST /questions
const createQuestion = async (req, res, next) => {
    try {
        const { author, ...questionData } = req.body;

        const question = await Question.create({
            ...questionData,
            author: req.user._id
        });

        return res.status(201).json(question);
    } catch (error) {
        next(error);
    }
};


// PUT /questions/:questionId
const updateQuestion = async (req, res, next) => {
    try {
        const { author, ...updates } = req.body;

        req.question.set(updates);
        await req.question.save();

        return res.json(req.question);
    } catch (error) {
        return next(error);
    }
};


// DELETE /questions/:questionId
const deleteQuestion = async (req, res, next) => {
    try {
        await req.question.deleteOne();

        return res.json({
            message: "Question deleted successfully"
        });
    } catch (error) {
        return next(error);
    }
};


module.exports = {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
};
