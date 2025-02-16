const path = require('path');
const upload = require('../app-modules/multer-config');
const employeeService = require('../services/employee-service');
const express = require("express");
const router = express.Router();
const awsService = require('../app-modules/aws-service');
require('dotenv').config({ path: './app-modules/.env' });

router.put('/upload-picture', upload.single('file'), async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        } else {

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(req.file.originalname); // Get file extension

            let fileName = uniqueSuffix + ext;

            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            };

            const url = await awsService.uploadFileToS3(params);

            res.json({ message: 'File uploaded successfully!', url: url });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Probably some error occured so profile image could not be uploaded" });
    }


});

router.get('/download-picture/:employeeId', async (req, res) => {

    try {

        let fileUrl = await employeeService.getProfileImage(req.params.employeeId);

        res.status(200).json({ data: fileUrl });
    } catch (error) {

        if (error.message == 'Image not found') {
            res.status(404).json({ message: "Requested file does not exists" });
        } else {
            res.status(500).json({ message: "Probably some error occured so profile image could not be fetched" });
        }

    }

});


module.exports = router;