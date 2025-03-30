const express = require('express');
const authmiddleware = require('../middlewares/auth');
const FileInfo = require('../models/files.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Get user files
router.get('/home', authmiddleware, async (req, res) => {
    try {
        const userFiles = await FileInfo.find({ user_id: req.user.userId });
        res.render('home', { 
            files: userFiles, 
            username: req.user.username,
            success: req.query.success 
        });
    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).json({ error: 'Failed to retrieve files' });
    }
});

// Upload file
router.post('/upload-file', authmiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileRecord = new FileInfo({
            file_uploaded_by: req.user.username,
            user_id: req.user.userId,
            filename: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });

        await fileRecord.save();
        res.json({ 
            success: true, 
            file: fileRecord,
            message: 'File uploaded successfully!' 
        });
    } catch (error) {
        console.error('Error saving file info:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// Delete file
router.delete('/delete-file/:id', authmiddleware, async (req, res) => {
    try {
        const file = await FileInfo.findOne({
            _id: req.params.id,
            user_id: req.user.userId
        });

        if (!file) return res.status(404).json({ error: 'File not found' });

        fs.unlinkSync(file.path);
        await FileInfo.deleteOne({ _id: req.params.id });
        
        res.json({ success: true, message: 'File deleted successfully!' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

// Search files
router.get('/search', authmiddleware, async (req, res) => {
    try {
        const searchQuery = req.query.q;
        if (!searchQuery) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const searchResults = await FileInfo.find({
            user_id: req.user.userId,
            filename: { $regex: searchQuery, $options: 'i' }
        });

        res.render('home', { 
            files: searchResults, 
            username: req.user.username 
        });
    } catch (error) {
        console.error('Error searching files:', error);
        res.status(500).json({ error: 'Failed to search files' });
    }
});

module.exports = router;