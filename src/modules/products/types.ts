import { CreateProductDto } from './dto/CreateProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';

export interface ICreateProductParams {
  dto: CreateProductDto;
  file: Express.Multer.File;
}

export interface IUpdateProductParams {
  dto: UpdateProductDto;
  file: Express.Multer.File;
}
