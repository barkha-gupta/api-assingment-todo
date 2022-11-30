const mongoose = require("mongoose");
const todoSchema= new mongoose.Schema({
    title: String,
    isComplete: Boolean,
    id: Number
})
const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;