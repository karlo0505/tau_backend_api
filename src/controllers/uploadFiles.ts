import multer from "multer";
import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";

const uploadImages = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      cloudinary.uploader.upload(
        dataURI,
        { public_id: "tau_file" },
        function (error, result: any) {
          return res.status(200).json({
            origin: req.file?.originalname,
            image: result.secure_url,
            message: "Successfully uploaded",
          });
        }
      );
    } else {
      return res.status(400).json({
        message: "File not found",
      });
    }
  } catch (error) {
    console.log("error 500", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }

  // try {
  //   console.log("req", req.body)
  //   await multipleUpload(req, res, function (err) {
  //     if (err instanceof multer.MulterError) {
  //       // A Multer error occurred when uploading.
  //       res
  //         .status(400)
  //         .json({
  //           message: `Multer uploading error: ${err.message}`,
  //         })
  //         .end();
  //       return;
  //     } else if (err) {
  //       // An unknown error occurred when uploading.
  //       if (err.name == "ExtensionError") {
  //         res.status(413).json({ message: err.message }).end();
  //       } else {
  //         res
  //           .status(400)
  //           .json({
  //             message: `unknown uploading error: ${err.message}`,
  //           })
  //           .end();
  //       }
  //       return;
  //     }
  //     res.status(200).json({ data: req.files });
  //   });
  // } catch (error) {
  //   console.log("error 500", error);
  //   res.status(500).json({ message: "Internal server error" });
  // }
};

export default uploadImages;
