// backend/models/timelineEvent.model.js
const mongoose = require('mongoose');
const timelineEventSchema = new mongoose.Schema({
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    sortOrder: { type: Number, required: true, unique: true }, // To order events correctly
}, { timestamps: true });
module.exports = mongoose.model('TimelineEvent', timelineEventSchema);