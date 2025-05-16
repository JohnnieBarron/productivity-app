const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    notes: String,
    
    location: String,

    dueDate: {
        type: Date,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    repeats: {
        type: Boolean,
        default: false
    },
    repeatDuration: {
        type: Number,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
        },
        timestamps: true,
});

const goalSchema = new Schema({
    Type: {
        type: String,
        enum: ['mind', 'body'],
        required: true,
    },
    timestamps: true,
    task: taskSchema,
});