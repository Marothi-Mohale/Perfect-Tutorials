import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse, ApiFieldError } from '../dto/api-error-response.dto';

type ExceptionPayload = {
  message?: string | string[];
  errors?: ApiFieldError[];
  code?: string;
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as
        | string
        | ExceptionPayload;
      const payload = this.normalizeHttpException(exceptionResponse, status);

      response.status(status).json(payload);
      return;
    }

    this.logger.error(
      `Unhandled error on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const payload: ApiErrorResponse = {
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong while processing your request.',
      errors: [],
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(payload);
  }

  private normalizeHttpException(
    exceptionResponse: string | ExceptionPayload,
    status: number,
  ): ApiErrorResponse {
    if (typeof exceptionResponse === 'string') {
      return {
        success: false,
        code: this.defaultCode(status),
        message: exceptionResponse,
        errors: [],
      };
    }

    const message = Array.isArray(exceptionResponse.message)
      ? exceptionResponse.message.join(' ')
      : (exceptionResponse.message ?? this.defaultMessage(status));

    return {
      success: false,
      code: exceptionResponse.code ?? this.defaultCode(status),
      message,
      errors: exceptionResponse.errors ?? [],
    };
  }

  private defaultCode(status: number) {
    if (status === 400) {
      return 'BAD_REQUEST';
    }

    if (status === 409) {
      return 'CONFLICT';
    }

    if (status === 404) {
      return 'NOT_FOUND';
    }

    return 'HTTP_ERROR';
  }

  private defaultMessage(status: number) {
    if (status === 400) {
      return 'The request could not be processed.';
    }

    if (status === 409) {
      return 'The request conflicts with an existing resource.';
    }

    if (status === 404) {
      return 'The requested resource was not found.';
    }

    return 'Request failed.';
  }
}
