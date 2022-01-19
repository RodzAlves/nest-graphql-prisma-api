import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostService } from './post.service';
import { PostUpdateInput } from 'src/@generated/prisma-nestjs-graphql/post/post-update.input';
import { PostCreateInput } from 'src/@generated/prisma-nestjs-graphql/post/post-create.input';
import { Post } from 'src/@generated/prisma-nestjs-graphql/post/post.model';
import { isRecordNotFoundError } from 'src/utils/Prisma';
import { ApolloError } from 'apollo-server-express';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post, { name: 'createPost' })
  async createPost(@Args('createPostInput') createPostInput: PostCreateInput) {
    try {
      return await this.postService.create(createPostInput);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new ApolloError(
          `No resource was found for ${JSON.stringify(createPostInput)}`,
        );
      }

      throw error;
    }
  }

  @Query(() => [Post], { name: 'posts' })
  findAll() {
    try {
      return this.postService.findAll();
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new ApolloError(`No resource was found`);
      }

      throw error;
    }
  }

  @Query(() => Post, { name: 'post' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.postService.findOne(id);
  }

  @Mutation(() => Post, { name: 'updatePost' })
  async updatePost(
    @Args('id') id: string,
    @Args('updatePostInput') updatePostInput: PostUpdateInput,
  ) {
    try {
      return await this.postService.update(id, updatePostInput);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new ApolloError(
          `No resource was found for ID: ${JSON.stringify(id)}`,
        );
      }

      throw error;
    }
  }

  @Mutation(() => Post, { name: 'deletePost' })
  async deletePost(@Args('id', { type: () => String }) id: string) {
    return await this.postService.delete(id);
  }
}
