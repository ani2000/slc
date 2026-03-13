// backend/models/galleryImage.model.js
const mongoose = require('mongoose');
const galleryImageSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    caption: { type: String, required: true },
    category: { type: String, enum: ['SUST', 'Dargah Sharif', 'Library', 'Events'], required: true },
}, { timestamps: true });
module.exports = mongoose.model('GalleryImage', galleryImageSchema);