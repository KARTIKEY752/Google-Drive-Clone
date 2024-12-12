const express=require('express');
const authmiddleware=require('../middlewares/auth')
const FileInfo = require('../models/files.model');

const multer =require("multer");

const router=express.Router();
const storage = multer.diskStorage({
    destination:function (req, file, cb) {
        return cb(null,'./uploads');
    },
    filename: function (req, file, cb){
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
})

const upload = multer({ storage: storage })


router.get('/home',authmiddleware,async (req,res)=>{
    const userfiles= await FileInfo.find({
        user_id:req.user.userId,
        
    })

    console.log(userfiles)
    res.render('home',{
        files:userfiles,
    })
})



router.post("/upload-file", authmiddleware, upload.single('file'), async (req, res) => {
    try {
        const uploadedFileInfo = await FileInfo.create( {
            file_uploaded_by: req.user.username,
            user_id: req.user.userId,
            filename: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });

        // Save file information to MongoDB
        const fileRecord = new FileInfo(uploadedFileInfo);
        await fileRecord.save(); // Use `await` to save the document asynchronously

        console.log("File info saved:", fileRecord);

        // Send the uploaded file information as JSON
        return res.json({ message: "File uploaded successfully", fileRecord });
    } catch (error) {
        console.error("Error saving file info:", error);
        return res.status(500).json({ error: "Failed to upload file" });
    }
});




module.exports=router;