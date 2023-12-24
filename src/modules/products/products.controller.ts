import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Roles } from '../../decorators/Roles.decorator';
import { EUserRoles } from '../../domain/users';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileInterceptorOptions } from '../../utils/files';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/CreateProductDto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Roles([EUserRoles.ADMIN])
  @Post()
  @UseInterceptors(FileInterceptor('image', { ...getFileInterceptorOptions('products') }))
  create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateProductDto) {
    this.productsService.createProduct({ dto, file });
  }
}
