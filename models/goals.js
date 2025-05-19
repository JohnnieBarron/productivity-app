const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
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
    },    
    notes: String,
    location: String,
});

const goalSchema = new Schema({
    name: String,
    Type: {
        type: String,
        enum: ['mind', 'body'],
        required: true,
    },
    task: [taskSchema],
        user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
}, {
  // Mongoose will maintain a createdAt & updatedAt property
  timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);