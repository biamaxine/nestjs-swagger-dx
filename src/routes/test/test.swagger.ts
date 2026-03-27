import { BadRequestException } from '@nestjs/common';
import { SDXResponses, SDXRoute } from 'src/index';
import {
  InjectByInferedTypeDto,
  InjectBySwaggerPropsDto,
  InjectByTransformerDto,
  InjectByValidatorsDto,
} from './test.dto';

const INFERED_TYPE: SDXRoute<{
  responses: SDXResponses<'OK' | 'BAD_REQUEST'>;
}> = {
  summary: 'Testa validação de tipagem inferida automaticamente',
  statusCode: 200,
  responses: {
    OK: {
      description: 'Corpo da requisição validado com sucesso.',
      type: InjectByInferedTypeDto,
    },
    BAD_REQUEST: {
      description: 'Falha na validação das propriedades inferidas.',
      type: BadRequestException,
    },
  },
};

const SWAGGER_PROPS: SDXRoute<{
  responses: SDXResponses<'OK' | 'BAD_REQUEST'>;
}> = {
  summary: 'Testa injeção de validação por propriedades do Swagger',
  statusCode: 200,
  responses: {
    OK: {
      description: 'Corpo da requisição validado com sucesso.',
      type: InjectBySwaggerPropsDto,
    },
    BAD_REQUEST: {
      description: 'Falha na validação baseada nas propriedades do Swagger.',
      type: BadRequestException,
    },
  },
};

const VALIDATORS: SDXRoute<{
  responses: SDXResponses<'OK' | 'BAD_REQUEST'>;
}> = {
  summary: 'Testa injeção de validação personalizada',
  statusCode: 200,
  responses: {
    OK: {
      description: 'Corpo da requisição validado com sucesso.',
      type: InjectByValidatorsDto,
    },
    BAD_REQUEST: {
      description: 'Falha na validação personalizada dos dados enviados.',
      type: BadRequestException,
    },
  },
};

const TRANSFORMERS: SDXRoute<{
  responses: SDXResponses<'OK' | 'BAD_REQUEST'>;
}> = {
  summary: 'Testa injeção de transformação personalizada',
  statusCode: 200,
  responses: {
    OK: {
      description: 'Corpo da requisição transformado e validado com sucesso.',
      type: InjectByTransformerDto,
    },
    BAD_REQUEST: {
      description: 'Falha na transformação e/ou validação dos dados enviados.',
      type: BadRequestException,
    },
  },
};

export default { INFERED_TYPE, SWAGGER_PROPS, VALIDATORS, TRANSFORMERS };
