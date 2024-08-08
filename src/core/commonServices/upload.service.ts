import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';

@Injectable()
export class FileUploadService {
    private readonly fileServerUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.fileServerUrl = this.configService.get<string>('FILE_SERVER_URL');
    }

    async uploadFileToServer(tenantId: string, file: Express.Multer.File): Promise<Object> {
        try {
            const form = new FormData();
            form.append('tenantId', tenantId);
            form.append('file', file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });

            const headers = form.getHeaders();
            const response = await this.httpService.post(this.fileServerUrl, form, { headers }).toPromise();

            return response.data;
        } catch (error) {
            console.error('Upload error:', error.response ? error.response.data : error.message);
            throw new HttpException(
                'Failed to upload file. Please try again later.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
