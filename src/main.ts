import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  if (process.env.BIBLE) {
    const config = new DocumentBuilder().setTitle('Bible').setDescription('The Bible API description').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('bible', app, document);
  }
  await app.listen(3000);
}
bootstrap();
