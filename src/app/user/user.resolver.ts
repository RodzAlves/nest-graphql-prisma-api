import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';
import { UserUpdateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-update.input';
import { UserCreateInput } from 'src/@generated/prisma-nestjs-graphql/user/user-create.input';
import { isRecordNotFoundError } from 'src/utils/Prisma';
import { ApolloError } from 'apollo-server-express';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, { name: 'createUser' })
  async createUser(@Args('createUserInput') createUserInput: UserCreateInput) {
    try {
      return await this.userService.create(createUserInput);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new ApolloError(
          `No resource was found for ${JSON.stringify(createUserInput)}`,
        );
      }

      throw error;
    }
  }

  @Query(() => [User], { name: 'users' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.userService.findOne(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('id') id: string,
    @Args('updateUserInput') updateUserInput: UserUpdateInput,
  ) {
    return await this.userService.update(id, updateUserInput);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  async deleteUser(@Args('id', { type: () => String }) id: string) {
    return await this.userService.delete(id);
  }
}
