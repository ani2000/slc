// backend/models/book.model.js
const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    description: { type: String, required: true },
    coverImageUrl: { type: String, required: true },
    pdfUrl: { type: String, required: true }, // For reading/downloading
    category: { type: String, enum: ['Biography', 'History', 'Teachings', 'Poetry'], required: true },
}, { timestamps: true });
module.exports = mongoose.model('Book', bookSchema);