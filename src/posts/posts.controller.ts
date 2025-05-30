import { Controller, Post as HttpPost, Body, Get, Param, Put, Delete, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Post } from './post.entity';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @HttpPost()
    create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Post>> {
    limit = limit > 100 ? 100 : limit;
    return this.postsService.findAll({ page, limit });
  }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(id, updatePostDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.postsService.remove(id);
    }
}