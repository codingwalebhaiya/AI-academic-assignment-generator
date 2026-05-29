import multer, { FileFilterCallback } from "multer"
import { Request } from "express"


const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true)
    } else {
        cb(new Error("Only pdf files are allowed"))
    }

}

export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB
    }
})