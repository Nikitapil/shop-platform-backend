import { CreateProductDto } from './dto/CreateProductDto';

export interface ICreateProductParams {
  dto: CreateProductDto;
  file: Express.Multer.File;
}
