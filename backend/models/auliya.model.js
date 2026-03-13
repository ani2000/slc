// backend/models/auliya.model.js
const mongoose = require('mongoose');
const auliyaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true }, // e.g., "Companion of Shahjalal (Rah.)"
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    mazarLocation: {
        address: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
}, { timestamps: true });
module.exports = mongoose.model('Auliya', auliyaSchema);
