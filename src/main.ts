import { SDXValidationModule } from './shared/modules/validation.module';

// O SDXValidationModule precisa ser contruído antes das demais importações,
// para que as configurações globais existam antes do TS rodar os decoradores.
SDXValidationModule.setup({
  IsEmail: { options: { host_whitelist: ['company.org'] } },
  IsPhoneNumber: { region: 'BR' },
  IsUUID: { version: '4' },
});

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJS Swagger DX')
    .setDescription('')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
