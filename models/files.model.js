const mongoose = require('mongoose');

const fileInfoSchema = new mongoose.Schema({
    file_uploaded_by: { type: String, required: true },
    user_id: { type: String, required: true },
    filename: { type: String, required: true, index: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true, index: true },
    size: { type: Number, required: true },
    uploaded_at: { type: Date, default: Date.now, index: true }
});

fileInfoSchema.index({ filename: "text", mimetype: 1, uploaded_at: -1 });

const FileInfo = mongoose.model('FileInfo', fileInfoSchema);

module.exports = FileInfo;
