import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserInputError } from 'apollo-server-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const error_messages = errors.map((error) =>
          Object.values(error.constraints),
        );
        return new BadRequestException(error_messages.toString());
      },
      forbidUnknownValues: false,
    }),
  );

  await app.listen(3000);
}
bootstrap();
