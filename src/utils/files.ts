import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

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
