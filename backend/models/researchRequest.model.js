// backend/models/researchRequest.model.js
const mongoose = require('mongoose');
const researchRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    institution: { type: String, required: true },
    bookTitle: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Closed'], default: 'Pending' },
}, { timestamps: true });
module.exports = mongoose.model('ResearchRequest', researchRequestSchema);
