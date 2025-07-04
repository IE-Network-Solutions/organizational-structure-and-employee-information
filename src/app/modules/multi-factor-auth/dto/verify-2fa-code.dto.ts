import { IsString, IsNotEmpty } from 'class-validator';

export class Verify2FACodeDto {
  @IsString()
  @IsNotEmpty()
  uid: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
