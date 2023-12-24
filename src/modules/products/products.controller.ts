import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Roles } from '../../decorators/Roles.decorator';
import { EUserRoles } from '../../domain/users';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  getFileInterceptorOptions,
  getFileParsePipeWithTypeValidation
} from '../../utils/files';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/CreateProductDto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @Roles([EUserRoles.ADMIN])
  @UseInterceptors(FileInterceptor('image', { ...getFileInterceptorOptions('products') }))
  create(
    @UploadedFile(getFileParsePipeWithTypeValidation('image/*'))
    file: Express.Multer.File,
    @Body() dto: CreateProductDto
  ) {
    return this.productsService.createProduct({ dto, file });
  }
}
