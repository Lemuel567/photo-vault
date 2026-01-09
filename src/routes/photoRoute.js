import express from 'express'
import prisma from '../utils/db.js'
import upload from '../utils/multer.js'
import cloudinary from '../middleware/cloudinary.js'
import fs from 'fs' // Add this import

const router = express.Router()

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, description, visibility, userId } = req.body;

        // 1. Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'my_gallery'
        });

        // 2. DELETE file after upload is complete
        fs.unlinkSync(req.file.path); 

        // 3. Save to SQLite
        const photo = await prisma.photos.create({
            data: {
                title,
                description,
                isPublic: visibility === 'public', 
                imageUrl: result.secure_url,
                publicId: result.public_id,
                userId: Number(userId)
            }
        });

        res.status(201).json(photo);
    } catch (error) {
        // If upload fails, try to clean up the local file if it exists
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
    }
});

export default router;