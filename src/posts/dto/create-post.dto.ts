import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreatePostDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsString()
    @IsOptional()
    author?: string;

    @IsUUID()
    @IsOptional()
    categoryId?: string;
}


