import {
     Body,
     Controller,
     Delete,
     Get,
     Param,
     Patch,
     Post,
     Put,
     UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ResponseInterceptor } from '@/shared/interceptors/response.interceptor';
import { CategoriesService } from '@/modules/categories/categories.service';
import { CreateCategoryDto } from '@/modules/categories/dtos/create.dto';
import { UpdateCategoryDto } from '@/modules/categories/dtos/update.dto';
import { Category } from '@prisma/client';

@Controller('categories')
@ApiTags('Categories')
@UseInterceptors(ResponseInterceptor)
export class CategoriesController {
     constructor(private readonly categoriesService: CategoriesService) {}

     @Post('new')
     @ApiOperation({ summary: 'Create a new category' })
     @ApiResponse({ status: 201, description: 'Category successfully created.' })
     @ApiResponse({ status: 400, description: 'Invalid data.' })
     async create(@Body() category: CreateCategoryDto): Promise<Category> {
          return this.categoriesService.create(category);
     }

     @Get('all')
     @ApiOperation({ summary: 'Get all categories' })
     @ApiResponse({ status: 200, description: 'All categories.' })
     async findAll(): Promise<Category[]> {
          return this.categoriesService.find();
     }

     @Get('detail/:id')
     @ApiParam({ name: 'id', required: true, description: 'Category ID' })
     @ApiOperation({ summary: 'Get a category by ID' })
     @ApiResponse({ status: 200, description: 'Category found.' })
     @ApiResponse({ status: 404, description: 'Category not found.' })
     async findOne(@Param('id') id: string): Promise<Category> {
          return this.categoriesService.findById(id);
     }

     @Get('s/:slug')
     @ApiParam({ name: 'slug', required: true, description: 'Category slug' })
     @ApiOperation({ summary: 'Get a category by slug' })
     @ApiResponse({ status: 200, description: 'Category found.' })
     @ApiResponse({ status: 404, description: 'Category not found.' })
     async findBySlug(@Param('slug') slug: string): Promise<Category> {
          return this.categoriesService.findBySlug(slug);
     }

     @Put('edit/:id')
     @ApiParam({ name: 'id', required: true, description: 'Category ID' })
     @ApiOperation({ summary: 'Update a category by ID' })
     @ApiResponse({ status: 200, description: 'Category updated.' })
     @ApiResponse({ status: 404, description: 'Category not found.' })
     async update(@Param('id') id: string, @Body() data: UpdateCategoryDto): Promise<Category> {
          return this.categoriesService.update(id, data);
     }

     @Delete('delete/:id')
     @ApiParam({ name: 'id', required: true, description: 'Category ID' })
     @ApiOperation({ summary: 'Delete a category by ID' })
     @ApiResponse({ status: 200, description: 'Category successfully deleted.' })
     @ApiResponse({ status: 404, description: 'Category not found.' })
     async delete(@Param('id') id: string): Promise<Category> {
          return this.categoriesService.delete(id);
     }
}
