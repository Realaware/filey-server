import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FileService } from './file.service';

@Module({
  providers: [FileService, PrismaService],
  exports: [FileService],
})
export class FileModule {}
