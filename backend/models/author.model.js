// File: backend/models/author.model.js
const mongoose = require('mongoose');
const authorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    bio: { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Author', authorSchema);