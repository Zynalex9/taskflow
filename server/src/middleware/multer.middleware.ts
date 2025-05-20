import { NextFunction, Request, Response } from "express";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
      console.log("file from multer",file)
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})

export const uploadOptional = (req:Request, res:Response, next:NextFunction) => {
  const uploader = upload.single("cover-image");
  uploader(req, res, function (err) {
    if (err && err.code === "LIMIT_UNEXPECTED_FILE") {
      // Skip file upload if field is missing
      return next();
    } else if (err && err.code === "MulterError" && err.message === "Field name missing") {
      // Skip the error if no file field provided
      return next();
    } else if (err) {
      return res.status(400).json({ message: "File upload error", err });
    }
    next();
  });
};
