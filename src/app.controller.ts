import {
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guard/jwt-auth-guard';
import { LocalAuthGuard } from './guard/local-auth-guard';
import { getFileExtension } from './utility/getFileExtension';
import * as fsPromise from 'fs/promises';
import * as fs from 'fs';
import { FileService } from './file/file.service';
import { DownloadFileDto } from './dto/download-file.dto';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private fileService: FileService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('auth/register')
  async register(@Body() data: CreateUserDto) {
    return await this.authService.register(data.name, data.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/profile')
  async profile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: path.join(__dirname, '../storage'),
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const time = new Date().getTime();
    const filename = `${file.originalname}.${time}.${getFileExtension(
      file.originalname,
    )}`;

    try {
      await fsPromise.rename(
        file.path,
        path.join(__dirname, `../storage/${filename}`),
      );

      return await this.fileService.createFile(req.user, filename);
    } catch (err: any) {
      throw new HttpException({ message: '5002:' }, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/files')
  async getFiles(@Request() req) {
    return await this.fileService.findFiles(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('download')
  async download(@Body() data: DownloadFileDto) {
    const file = fs.createReadStream(
      path.join(__dirname, `../storage/${data.path}`),
    );

    return new StreamableFile(file);
  }
}
