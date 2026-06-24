import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, jpeg, png, gif, webp)"));
  }
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const upload = {
  single: (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      multerUpload.single(fieldName)(req, res, (err: unknown) => {
        if (err instanceof multer.MulterError) {
          res.status(400).json({
            success: false,
            message:
              err.code === "LIMIT_FILE_SIZE"
                ? "File size must be less than 5MB"
                : err.message,
          });
          return;
        }
        if (err instanceof Error) {
          res.status(400).json({ success: false, message: err.message });
          return;
        }
        next();
      });
    };
  },
};
