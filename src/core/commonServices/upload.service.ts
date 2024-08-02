import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {
    constructor(private readonly httpService: HttpService) { }
    async uploadFileToServer(tenantId: string, file: Express.Multer.File): Promise<Object> {
        try {
            const formData = { tenantId, file: fs.createReadStream(file.path) };
            const response = await this.httpService.post(process.env.FILE_SERVER_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).toPromise();

            return response.data;

        } catch (error) {
            throw new HttpException(
                'Failed to upload file. Please try again later.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
