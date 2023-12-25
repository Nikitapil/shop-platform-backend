import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { Roles } from '../../decorators/Roles.decorator';
import { EUserRoles } from '../../domain/users';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  getFileInterceptorOptions,
  getFileParsePipeWithTypeValidation
} from '../../utils/files';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/CreateProductDto';
import { ProductsService } from './products.service';
import { ProductReturnDto } from '../../dtos-global/ProductReturnDto';
import { GetProductsQueryDto } from './dto/GetProductsQueryDto';
import { UpdateProductDto } from './dto/UpdateProductDto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, type: ProductReturnDto })
  @Post()
  @Roles([EUserRoles.ADMIN])
  @UseInterceptors(FileInterceptor('image', { ...getFileInterceptorOptions('products') }))
  create(
    @UploadedFile(getFileParsePipeWithTypeValidation('image/*'))
    file: Express.Multer.File,
    @Body() dto: CreateProductDto
  ): Promise<ProductReturnDto> {
    return this.productsService.createProduct({ dto, file });
  }

  @ApiOperation({ summary: 'Edit product' })
  @ApiResponse({ status: 200, type: ProductReturnDto })
  @Put()
  @Roles([EUserRoles.ADMIN])
  @UseInterceptors(FileInterceptor('image', { ...getFileInterceptorOptions('products') }))
  edit(
    @UploadedFile(getFileParsePipeWithTypeValidation('image/*'))
    file: Express.Multer.File,
    @Body() dto: UpdateProductDto
  ): Promise<ProductReturnDto> {
    return this.productsService.editProduct({ dto, file });
  }

  @ApiOperation({ summary: 'get products' })
  @ApiResponse({ status: 200, type: [ProductReturnDto] })
  @Get()
  getProducts(@Query() dto: GetProductsQueryDto): Promise<ProductReturnDto[]> {
    return this.productsService.getProducts(dto);
  }
}
