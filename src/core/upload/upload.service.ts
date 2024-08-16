import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';

@Injectable()
export class FileUploadService {
  private readonly fileServerUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.fileServerUrl = this.configService.get<string>('FILE_SERVER_URL');
  }

  async uploadFileToServer(
    tenantId: string,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      console.log('Uploading file:', file.originalname);

      const form = new FormData();
      form.append('tenantId', tenantId);
      form.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const headers = {
        ...form.getHeaders(),
        'Content-Type': 'multipart/form-data',
      };

      const response = await this.httpService
        .post(this.fileServerUrl, form, { headers })
        .toPromise();

      console.log('Response from file server:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload failed:', error.message);
      throw new HttpException(
        `Failed to upload file. Please try again later. ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
