import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from 'src/@generated/prisma-nestjs-graphql/post/post.model';
import { PostCreateInput } from 'src/@generated/prisma-nestjs-graphql/post/post-create.input';
import { PostUpdateInput } from 'src/@generated/prisma-nestjs-graphql/post/post-update.input';
import { ApolloError } from 'apollo-server-express';
@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async create(data: PostCreateInput): Promise<Post> {
    const user = await this.prismaService.user.findUnique({
      where: { id: data.author.connect.id },
    });

    if (!user) {
      throw new ApolloError(`Author not found`);
    }

    return await this.prismaService.post.create({
      data,
      include: {
        author: true,
      },
    });
  }

  async findAll(): Promise<Post[]> {
    return await this.prismaService.post.findMany({
      include: {
        author: true,
      },
    });
  }

  async findOne(id: string): Promise<Post | null> {
    const post = await this.prismaService.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw new ApolloError(`Post cannot find by id.`);
    }

    return post;
  }

  async update(id: string, data: PostUpdateInput): Promise<Post> {
    const post = await this.prismaService.post.findUnique({ where: { id } });

    if (!post) {
      throw new ApolloError(`Post cannot find by id ${id}`);
    }

    return await this.prismaService.post.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    });
  }

  async delete(id: string): Promise<Post | null> {
    const post = await this.prismaService.post.findUnique({ where: { id } });

    if (!post) {
      throw new ApolloError(`Record cannot find by id ${id}`);
    }

    return await this.prismaService.post.delete({
      where: { id },
    });
  }
}
