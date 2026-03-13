import {
  BadRequestException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

export const validationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (validationErrors: ValidationError[]) =>
    new BadRequestException({
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: validationErrors.flatMap((validationError) => {
        const constraints = Object.values(validationError.constraints ?? {});

        if (!constraints.length) {
          return [];
        }

        return [
          {
            field: validationError.property,
            messages: constraints,
          },
        ];
      }),
    }),
};
