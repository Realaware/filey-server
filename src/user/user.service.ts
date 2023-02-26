import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(param: {
    id?: number;
    name?: string;
  }): Promise<User | undefined> {
    return await this.prisma.user.findFirst({
      where: param,
    });
  }

  async createUser(param: { name: string; password: string }) {
    return await this.prisma.user.create({
      data: param,
    });
  }
}
