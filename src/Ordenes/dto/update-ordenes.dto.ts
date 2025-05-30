import { IsOptional, IsString } from 'class-validator';

export class UpdateOrdenDto {
  @IsString()
  @IsOptional()
  orden?: string;
}
