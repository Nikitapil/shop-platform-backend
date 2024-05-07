import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { Roles } from '../../decorators/Roles.decorator';
import { User } from '../../decorators/User.decorator';

import { JwtGuard } from '../../guards/auth/jwt.guard';
import { ApplyUserGuard } from '../../guards/users/apply-user.guard';

import {
  getFileInterceptorOptions,
  getFileParsePipeWithTypeValidation
} from '../../utils/files';

import { EUserRoles, IUserFromToken } from '../../domain/users.domain';

import { ProductsService } from './products.service';

import { ToggleFavoritesDto } from './dto/ToggleFavoritesDto';
import { ToggleFavoriteReturnDto } from './dto/ToggleFavoriteReturnDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';
import { UpdateProductDto } from './dto/UpdateProductDto';
import { GetProductsQueryDto } from './dto/GetProductsQueryDto';
import { GetProductsReturnDto } from './dto/GetProductsReturnDto';
import { GetFavoriteProductsDto } from './dto/GetFavoriteProductsDto';
import { ProductReturnDto } from './dto/ProductReturnDto';
import { EditProductDiscountDto } from './dto/EditProductDiscountDto';
import { CreateProductDto } from './dto/CreateProductDto';
import { CreateProductBody } from './dto/CreateProductBody';
import { UpdateProductBody } from './dto/UpdateProductBody';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create product', operationId: 'createProduct' })
  @ApiResponse({ status: 201, type: ProductReturnDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create product body',
    type: CreateProductBody
  })
  @Roles([EUserRoles.ADMIN])
  @UseInterceptors(FileInterceptor('image', { ...getFileInterceptorOptions('products') }))
  @Post()
  create(
    @UploadedFile(getFileParsePipeWithTypeValidation('image/*'))
    file: Express.Multer.File,
    @Body() dto: CreateProductDto,
    @User() user: IUserFromToken
  ): Promise<ProductReturnDto> {
    return this.productsService.createProduct({ dto, file, user });
  }

  @ApiOperation({ summary: 'Edit product', operationId: 'editProduct' })
  @ApiResponse({ status: 200, type: ProductReturnDto })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update product body',
    type: UpdateProductBody
  })
  @Roles([EUserRoles.ADMIN])
  @UseInterceptors(FileInterceptor('image', { ...getFileInterceptorOptions('products') }))
  @Put()
  edit(
    @UploadedFile(getFileParsePipeWithTypeValidation('image/*'))
    file: Express.Multer.File,
    @Body() dto: UpdateProductDto,
    @User() user: IUserFromToken
  ): Promise<ProductReturnDto> {
    return this.productsService.editProduct({ dto, file, user });
  }

  @ApiOperation({ summary: 'get products', operationId: 'getProducts' })
  @ApiResponse({ status: 200, type: GetProductsReturnDto })
  @UseGuards(ApplyUserGuard)
  @Get()
  getProducts(
    @Query() dto: GetProductsQueryDto,
    @User() user: IUserFromToken | null
  ): Promise<GetProductsReturnDto> {
    return this.productsService.getProducts({ dto, user });
  }

  @ApiOperation({ summary: 'get favorite products', operationId: 'getFavoriteProducts' })
  @ApiResponse({ status: 200, type: GetProductsReturnDto })
  @UseGuards(JwtGuard)
  @Get('favorites')
  getFavoriteProducts(
    @Query() dto: GetFavoriteProductsDto,
    @User() user: IUserFromToken | null
  ): Promise<GetProductsReturnDto> {
    return this.productsService.getFavoritesProducts({ dto, user });
  }

  @ApiOperation({ summary: 'Get product', operationId: 'getProduct' })
  @ApiResponse({ status: 200, type: ProductReturnDto })
  @UseGuards(ApplyUserGuard)
  @Get(':id')
  getProduct(
    @Param('id') id: string,
    @User() user: IUserFromToken | null
  ): Promise<ProductReturnDto> {
    return this.productsService.getProduct({ id, user });
  }

  @ApiOperation({ summary: 'delete product', operationId: 'deleteProduct' })
  @ApiResponse({ status: 200, type: SuccessMessageDto })
  @Roles([EUserRoles.ADMIN])
  @Delete(':id')
  deleteProduct(@Param('id') id: string): Promise<SuccessMessageDto> {
    return this.productsService.deleteProduct(id);
  }

  @ApiOperation({ summary: 'toggle favorites', operationId: 'toggleFavorites' })
  @ApiResponse({ status: 200, type: ToggleFavoriteReturnDto })
  @UseGuards(JwtGuard)
  @Patch('/favorites')
  toggleFavorites(
    @Body() dto: ToggleFavoritesDto,
    @User() user: IUserFromToken
  ): Promise<ToggleFavoriteReturnDto> {
    return this.productsService.toggleFavorite({ dto, user });
  }

  @ApiOperation({ summary: 'edit product discount', operationId: 'editProductDiscount' })
  @ApiResponse({ status: 200, type: ProductReturnDto })
  @Roles([EUserRoles.ADMIN])
  @Put('/discount')
  editProductDiscount(
    @Body() dto: EditProductDiscountDto,
    @User() user: IUserFromToken
  ): Promise<ToggleFavoriteReturnDto> {
    return this.productsService.editProductDiscount({ dto, user });
  }
}
