import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      throw new ApolloError(`User with ${data.email} already exists`);
    }

    return await this.prismaService.user.create({
      data,
    });
  }

  async findAll(): Promise<User[] | []> {
    return await this.prismaService.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });

    if (!user) {
      throw new ApolloError(`User with Id: ${id} not found`);
    }

    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApolloError(`User with Id: ${id} not found`);
    }

    return await this.prismaService.user.update({
      data,
      where: { id },
      include: {
        posts: true,
      },
    });
  }

  async delete(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApolloError(`User with Id: ${id} not found`);
    }

    return await this.prismaService.user.delete({
      where: { id },
    });
  }
}
