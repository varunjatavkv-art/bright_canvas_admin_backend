export const multer_error = (err, req, res, next) => {
    // Check if the error is from Multer (specifically from fileFilter)
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message // This message comes directly from your fileFilter: "Only .jpg, .jpeg and .png files are allowed"
        });
    }
    
    // Pass the error along if it's not a Multer error
    next(err);
}