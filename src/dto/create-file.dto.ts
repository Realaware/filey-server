import { IsBoolean } from 'class-validator';

// TODO: implement private file system
export class CreateFileDto {
  @IsBoolean()
  private: boolean;
}
