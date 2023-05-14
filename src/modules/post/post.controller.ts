import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { FilterDto } from './dto/filter.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get('get-all')
  findAll(@Query() params: FilterDto) {
    return this.postService.findAll(params);
  }

  @Get('get-one/:id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.postService.findOne(id);
  }

  @Put('update/:id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }
}
