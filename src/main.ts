import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { DataTransformInteceptor } from './interceptors/dataTransform.interceptor';
import { FileUrlTransformInterceptor } from './interceptors/fileUrlTransform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(
    new DataTransformInteceptor(),
    new FileUrlTransformInterceptor()
  );

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  const config = new DocumentBuilder()
    .setTitle('The Star Wars API')
    .setDescription('The API for Star Wars Site')
    .setVersion('1.0')
    .addTag('The Star Wars')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
