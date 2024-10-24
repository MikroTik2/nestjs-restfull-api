import { Module } from '@nestjs/common';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import { CloudinaryProvider } from '@/modules/cloudinary/cloudinary.provide';

@Module({
     providers: [CloudinaryProvider, CloudinaryService],
     exports: [CloudinaryService],
})
export class CloudinaryModule {}
