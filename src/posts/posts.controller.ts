import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostModel } from '../../generated/prisma/models';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number): Promise<PostModel | null> {
    return this.postsService.post({ id });
  }

  @Get()
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postsService.posts({
      where: { published: true },
    });
  }

  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postsService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  @Post()
  async createDraft(
    @Body() postData: CreatePostDto,
  ): Promise<PostModel> {
    const { title, content, authorEmail } = postData;
    return this.postsService.createPost({
      title,
      content,
      author: {
        connect: { email: authorEmail },
      },
    });
  }

  @Put('publish/:id')
  async publishPost(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
    return this.postsService.updatePost({
      where: { id },
      data: { published: true },
    });
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
    return this.postsService.deletePost({ id });
  }

}
