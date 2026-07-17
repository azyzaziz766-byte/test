import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(),new LoggingInterceptor());
   const config = new DocumentBuilder()
    .setTitle('نظام إدارة المستخدمين')
    .setDescription('API لإدارة المستخدمين والصلاحيات')
    .setVersion('1.0')
    .addTag('users', 'عمليات المستخدمين')
    .addTag('auth', 'عمليات المصادقة')
    .addTag('admin', 'عمليات المديرين')
    .addBearerAuth() // لإضافة JWT Authentication
    .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'api-key')
    .setContact('أحمد', 'https://example.com', 'ahmed@example.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'بيئة التطوير')
    .addServer('https://api.example.com', 'بيئة الإنتاج')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
