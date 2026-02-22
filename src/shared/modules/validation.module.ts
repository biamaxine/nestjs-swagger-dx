import { Logger } from '@nestjs/common';

import { SDXValidationConfig } from '../types/validation-config';

export class SDXValidationModule {
  private static config: SDXValidationConfig = {};
  private static readonly logger = new Logger('SDXValidation');

  static setup(config: SDXValidationConfig) {
    this.config = {
      ...this.config,
      ...config,
    };

    this.logger.log('Global validation rules initialized successfully');
  }

  static _getConfig(): SDXValidationConfig {
    return this.config;
  }
}
