import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserRequest } from 'src/types/user-request.interface';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async createFile(user: UserRequest, path: string) {
    return await this.prisma.file.create({
      data: {
        private: false,
        uploaderId: user.id,
        path,
      },
    });
  }

  async findFiles(user: UserRequest) {
    return await this.prisma.file.findMany({
      where: {
        uploaderId: user.id,
      },
    });
  }
}
