import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { BadRequestException } from '@nestjs/common';

export const catchError = (err: any, message = 'Error') => {
  if (err instanceof HttpException) {
    throw err;
  }
  throw new BadRequestException(err.message || message);
};
