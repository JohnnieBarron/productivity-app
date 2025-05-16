const mongoose = require("mongoose");
// shortcut variable
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  Name: {
    type: String
  },
  password: {
    type: String,
    required: true,
  },
  Goal:{
    type: String,
  },
}, {
  // Mongoose will maintain a createdAt & updatedAt property
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
