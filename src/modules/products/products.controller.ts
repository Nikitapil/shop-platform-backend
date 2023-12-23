import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Roles } from '../../decorators/Roles.decorator';
import { EUserRoles } from '../../domain/users';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileInterceptorOptions } from '../../utils/files';

@Controller('products')
export class ProductsController {
  @Roles([EUserRoles.ADMIN])
  @Post()
  @UseInterceptors(FileInterceptor('image', { ...getFileInterceptorOptions('products') }))
  create(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
