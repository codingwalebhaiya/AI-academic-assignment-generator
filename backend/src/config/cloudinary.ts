import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true,
});

interface UploadResponse {
    secure_url: string;
    public_id: string;
}

//  pdf file (source or generated) upload to cloudinary with different folder name (source_pdfs and generated_pdfs)
const uploadOnCloudinary = (fileBuffer: Buffer, folder = "source_pdfs", fileName?: string): Promise<UploadResponse> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "raw",
                ...(fileName && { public_id: fileName }),
                overwrite: true,
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                if (!result) {
                    return reject(new Error("Cloudinary upload failed"));
                }
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id
                });
            }
        );

        // Pipe the buffer into the stream to start the upload
        uploadStream.end(fileBuffer);
    });
};


const deleteFromCloudinary = (publicId: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, { resource_type: "raw" }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};

export { uploadOnCloudinary, deleteFromCloudinary };