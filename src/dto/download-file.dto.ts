import { IsString } from 'class-validator';

export class DownloadFileDto {
  @IsString()
  path: string;
}
