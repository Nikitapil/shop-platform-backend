import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import {
  FileTypeValidator,
  HttpException,
  HttpStatus,
  ParseFilePipe
} from '@nestjs/common';
import fs from 'fs';

export const generateFileName = (file: Express.Multer.File) => {
  return `${uuidv4()}${extname(file.originalname)}`;
};

export const getFileInterceptorOptions = (destination: string): MulterOptions => {
  return {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const filePath = path.resolve(__dirname, '..', 'static', destination);
        if (!existsSync(filePath)) {
          mkdirSync(filePath, { recursive: true });
        }
        callback(null, filePath);
      },
      filename: (req, file, callback) => {
        callback(null, generateFileName(file));
      }
    })
  };
};

export const createFileLink = (destination: string, filename: string) => {
  return `${destination}/${filename}`;
};

export const getFileParsePipeWithTypeValidation = (fileType: string) => {
  return new ParseFilePipe({
    validators: [new FileTypeValidator({ fileType: fileType })]
  });
};

export const deleteFile = (link: string) => {
  try {
    const filePath = path.join(__dirname, '..', 'static', link);
    fs.unlinkSync(filePath);
  } catch (e) {
    throw new HttpException('Error in writing file', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
