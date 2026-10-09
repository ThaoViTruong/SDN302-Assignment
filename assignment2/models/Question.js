const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: value => Array.isArray(value) && value.length >= 2,
                message: "A question must have at least 2 options"
            }
        },

        keywords: {
            type: [String],
            default: []
        },

        correctAnswerIndex: {
            type: Number,
            required: true,
            min: [0, "Correct answer index must be greater than or equal to 0"],
            validate: {
                validator: function (value) {
                    return Array.isArray(this.options) && value < this.options.length;
                },
                message: "Correct answer index must match one of the provided options"
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Question", questionSchema);
