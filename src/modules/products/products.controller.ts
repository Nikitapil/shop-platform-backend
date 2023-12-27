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
import { Roles } from '../../decorators/Roles.decorator';
import { EUserRoles, IUserFromToken } from '../../domain/users';
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
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';
import { JwtGuard } from '../../guards/auth/jwt.guard';
import { ToggleFavoritesDto } from './dto/ToggleFavoritesDto';
import { User } from '../../decorators/User.decorator';
import { ToggleFavoriteReturnDto } from './dto/ToggleFavoriteReturnDto';
import { ApplyUserGuard } from '../../guards/users/apply-user.guard';

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
    @Body() dto: CreateProductDto,
    @User() user: IUserFromToken
  ): Promise<ProductReturnDto> {
    return this.productsService.createProduct({ dto, file, user });
  }

  @ApiOperation({ summary: 'Edit product' })
  @ApiResponse({ status: 200, type: ProductReturnDto })
  @Put()
  @Roles([EUserRoles.ADMIN])
  @UseInterceptors(FileInterceptor('image', { ...getFileInterceptorOptions('products') }))
  edit(
    @UploadedFile(getFileParsePipeWithTypeValidation('image/*'))
    file: Express.Multer.File,
    @Body() dto: UpdateProductDto,
    @User() user: IUserFromToken
  ): Promise<ProductReturnDto> {
    return this.productsService.editProduct({ dto, file, user });
  }

  @ApiOperation({ summary: 'get products' })
  @ApiResponse({ status: 200, type: [ProductReturnDto] })
  @UseGuards(ApplyUserGuard)
  @Get()
  getProducts(
    @Query() dto: GetProductsQueryDto,
    @User() user: IUserFromToken | null
  ): Promise<ProductReturnDto[]> {
    return this.productsService.getProducts({ dto, user });
  }

  @ApiOperation({ summary: 'get products' })
  @ApiResponse({ status: 200, type: SuccessMessageDto })
  @Roles([EUserRoles.ADMIN])
  @Delete(':id')
  deleteProduct(@Param('id') id: string): Promise<SuccessMessageDto> {
    return this.productsService.deleteProduct(id);
  }

  @ApiOperation({ summary: 'get products' })
  @ApiResponse({ status: 200, type: SuccessMessageDto })
  @UseGuards(JwtGuard)
  @Patch('/favorites')
  toggleFavorites(
    @Body() dto: ToggleFavoritesDto,
    @User() user: IUserFromToken
  ): Promise<ToggleFavoriteReturnDto> {
    return this.productsService.toggleFavorite({ dto, user });
  }
}
