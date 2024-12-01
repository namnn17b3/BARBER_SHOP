import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: configService.get('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const bucket_name = this.configService.get('AWS_S3_PUBLIC_BUCKET');
    const key = `${this.configService.get('AWS_S3_PUBLIC_FOLDER')}/${uuidv4()}.${file.originalname.split('.').pop()}`;
    const baseUrl = this.configService.get('AWS_S3_BASE_URL');
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket_name,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: 'public-read',
        ContentLength: file.size, // calculate length of buffer
      }),
    );

    return `${baseUrl}/${key}`;
  }

  async deleteFile(key: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.get('AWS_S3_PUBLIC_BUCKET'),
        Key: key,
      }),
    );
  }
}
