import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 15)
  name: string;

  @IsString()
  @Length(10, 100)
  password: string;
}
