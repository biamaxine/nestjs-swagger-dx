import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SDXRoute } from 'src/index';
import {
  InjectByInferedTypeDto,
  InjectBySwaggerPropsDto,
  InjectByTransformerDto,
  InjectByValidatorsDto,
} from './test.dto';
import TestSwagger from './test.swagger';

@ApiTags('Testes de Validação SDX')
@Controller('test')
export class TestController {
  @Post('infered-type')
  @SDXRoute(TestSwagger.INFERED_TYPE)
  INFERED_TYPE(@Body() dto: InjectByInferedTypeDto) {
    return dto;
  }

  @Post('swagger-props')
  @SDXRoute(TestSwagger.SWAGGER_PROPS)
  SWAGGER_PROPS(@Body() dto: InjectBySwaggerPropsDto) {
    return dto;
  }

  @Post('validators')
  @SDXRoute(TestSwagger.VALIDATORS)
  VALIDATORS(@Body() dto: InjectByValidatorsDto) {
    return dto;
  }

  @Post('transformer')
  @SDXRoute(TestSwagger.TRANSFORMERS)
  TRANSFORMERS(@Body() dto: InjectByTransformerDto) {
    return dto;
  }
}
