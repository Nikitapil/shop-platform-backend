import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../decorators/Roles.decorator';
import { EUserRoles } from '../../domain/users.domain';
import { CreateCategoryDto } from './dto/CreateCategoryDto';
import { CategoriesService } from './categories.service';
import { CategoryReturnDto } from '../../dtos-global/CategoryReturnDto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create category', operationId: 'createCategory' })
  @ApiResponse({ status: 201, type: CategoryReturnDto })
  @Roles([EUserRoles.ADMIN])
  @Post()
  createCategory(@Body() dto: CreateCategoryDto): Promise<CategoryReturnDto> {
    return this.categoriesService.createCategory(dto);
  }

  @ApiOperation({ summary: 'Update category', operationId: 'updateCategory' })
  @ApiResponse({ status: 201, type: CategoryReturnDto })
  @Roles([EUserRoles.ADMIN])
  @Put()
  updateCategory(@Body() dto: UpdateCategoryDto): Promise<CategoryReturnDto> {
    return this.categoriesService.updateCategory(dto);
  }

  @ApiOperation({ summary: 'Delete category', operationId: 'deleteCategory' })
  @ApiResponse({ status: 201, type: SuccessMessageDto })
  @Roles([EUserRoles.ADMIN])
  @Delete(':id')
  deleteCategory(@Param('id') id: string): Promise<SuccessMessageDto> {
    return this.categoriesService.deleteCategory(id);
  }

  @ApiOperation({ summary: 'Get categories', operationId: 'getCategories' })
  @ApiResponse({ status: 201, type: [CategoryReturnDto] })
  @Get()
  getCategories(): Promise<CategoryReturnDto[]> {
    return this.categoriesService.getCategories();
  }
}
