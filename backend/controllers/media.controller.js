import cloudinary from "../config/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, message: "No file uploaded" });

  const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "auto",
  });

  res.status(201).json({ success: true, url: result.secure_url });
});

export const deleteFile = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId)
    return res.status(400).json({ success: false, message: "publicId required" });

  await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, message: "File deleted" });
});
