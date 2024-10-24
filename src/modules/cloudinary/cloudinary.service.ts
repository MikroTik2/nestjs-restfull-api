import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
     constructor() {}

     private async uplaodFile(
          file: string,
          options: any,
     ): Promise<UploadApiResponse | UploadApiErrorResponse> {
          try {
               return await cloudinary.uploader.upload(file, options);
          } catch (error) {
               throw new BadRequestException(
                    `Failed to upload file from Cloudinary: ${error.message}`,
               );
          }
     }

     private async updateFile(
          file: string,
          id: string,
          options: any,
     ): Promise<UploadApiResponse | UploadApiErrorResponse> {
          try {
               await this.destroyFile(id);
               return await this.uplaodFile(file, options);
          } catch (error) {
               throw new BadRequestException(
                    `Failed to upload file from Cloudinary: ${error.message}`,
               );
          }
     }

     public async destroyFile(id: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
          try {
               return await cloudinary.uploader.destroy(id);
          } catch (error) {
               throw new BadRequestException(
                    `Failed to delete file from Cloudinary: ${error.message}`,
               );
          }
     }

     public async uploadImage(file: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return await this.uplaodFile(file, {
               folder: 'images',
               crop: 'fill',
               format: 'jpg',
               resource_type: 'image',
          });
     }

     public async updateImage(
          file: string,
          id: string,
     ): Promise<UploadApiResponse | UploadApiErrorResponse> {
          return await this.updateFile(file, id, {
               folder: 'images',
               crop: 'fill',
               format: 'jpg',
               resource_type: 'image',
          });
     }
}
