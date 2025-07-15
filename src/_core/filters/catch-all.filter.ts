import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ReturnStatus } from '../constants/common.constants';
import { ICommonResponse } from '../interceptors/common.interface';

@Catch()
export class CatchAllFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { httpAdapter } = this.httpAdapterHost;

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.log('[ERROR 🐛] ', exception);
    }

    const responseBody: ICommonResponse = {
      code: statusCode,
      status: ReturnStatus.ERROR,
      error: exception?.response?.error || 'Internal server error',
      message: exception?.response?.message || 'Internal server error',
      data: null,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
