import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllHttpExceptionsFilter } from './commons/filters/http-exceptions.filter';
import { TimeoutInterceptor } from './commons/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllHttpExceptionsFilter());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
                          .setTitle('Flight App API')
                          .setDescription('Scheduled Flights App')
                          .setVersion('1.0.0')
                          .addBearerAuth()
                          .build();
  const document = SwaggerModule.createDocument(app, options);  
  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: {
      filter: true
    }
  });

  await app.listen(process.env.port || 3000);
}
bootstrap();
