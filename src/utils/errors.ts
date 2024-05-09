import { BadRequestException, HttpException } from '@nestjs/common';

export const catchError = (err: any, message = 'Error') => {
  if (err instanceof HttpException) {
    throw err;
  }
  throw new BadRequestException(err.message || message);
};
