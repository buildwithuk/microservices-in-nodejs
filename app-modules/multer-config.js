const multer = require('multer');
const path = require('path');

    // Set up storage engine for multer
 const storage = multer.memoryStorage({
   filename: (req, file, cb) => {
       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
       const ext = path.extname(file.originalname); // Get file extension
       cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Generate unique filename
   },
});


// // File filter to allow only images
 const fileFilter = (req, file, cb) => {
   const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; // Allowed image types
   if (allowedMimeTypes.includes(file.mimetype)) {
       cb(null, true); // Accept the file
   } else {
       cb(new Error('Only image files (JPEG, PNG, GIF) are allowed!'), false); // Reject the file
   }
 };

// Initialize multer with storage, file filter, and limits
const upload = multer({
   storage,
   fileFilter,
   limits: { fileSize: 1 * 1024 * 1024 }, // 1MB file size limit
 });


 module.exports = upload;