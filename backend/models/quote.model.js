// backend/models/quote.model.js
const mongoose = require('mongoose');
const quoteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String, default: 'Hazrat Shahjalal (Rah.)' },
}, { timestamps: true });
module.exports = mongoose.model('Quote', quoteSchema);
