import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { join } from 'path';
import { PostModule } from './app/post/post.module';
import { UserModule } from './app/user/user.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      debug: false,
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            error.extensions?.exception?.response?.message || error.message,
        };
        return graphQLFormattedError;
      },
      // formatError: (error: GraphQLError) => {
      //   if (error.message === 'VALIDATION_ERROR') {
      //     const extensions = {
      //       code: 'VALIDATION_ERROR',
      //       errors: [],
      //     };

      //     Object.keys(error.extensions.invalidArgs).forEach((key) => {
      //       const constraints = [];
      //       Object.keys(error.extensions.invalidArgs[key].constraints).forEach(
      //         (_key) => {
      //           constraints.push(
      //             error.extensions.invalidArgs[key].constraints[_key],
      //           );
      //         },
      //       );

      //       extensions.errors.push({
      //         field: error.extensions.invalidArgs[key].property,
      //         errors: constraints,
      //       });
      //     });

      //     const graphQLFormattedError: GraphQLFormattedError = {
      //       message: 'VALIDATION_ERROR',
      //       extensions: extensions,
      //     };

      //     return graphQLFormattedError;
      //   } else {
      //     return error;
      //   }
      // },
    }),
    PostModule,
    UserModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
