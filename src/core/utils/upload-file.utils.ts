import { diskStorage } from 'multer';
import { extname, basename } from 'path';

export function createMulterOptions(allowedMimeTypes: string[], maxSize: number) {
    return {
        storage: diskStorage({
            filename: (req, file, cb) => {
                const originalName = basename(file.originalname, extname(file.originalname));
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const extension = extname(file.originalname);
                const newFilename = `${uniqueSuffix}-${originalName}${extension}`;

                cb(null, newFilename);
            },
        }),
        limits: {
            fileSize: maxSize,
        },
        fileFilter: (req: any, file: any, cb: any) => {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(
                    new Error(`Invalid file type. Allowed types are ${allowedMimeTypes.join(', ')}`),
                    false
                );
            }
            cb(null, true);
        },
    };
}

// Image upload options
export const imageUploadOptions = createMulterOptions(
    [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/webp',
        'image/tiff',
        'image/svg+xml',
    ],
    5 * 1024 * 1024
);

// Document upload options
export const documentUploadOptions = createMulterOptions(
    [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip',
        'application/x-rar-compressed',
        'application/x-tar',
        'text/plain',
        'application/json',
        'application/octet-stream',
    ],
    5 * 1024 * 1024
); 
