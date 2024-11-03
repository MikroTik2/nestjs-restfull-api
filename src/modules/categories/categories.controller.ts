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
     @ApiOperation({ summary: 'create a new category' })
     async create(@Body() category: CreateCategoryDto): Promise<Category> {
          return this.categoriesService.create(category);
     }

     @Get('all')
     @ApiOperation({ summary: 'get all categories' })
     async findAll(): Promise<Category[]> {
          return this.categoriesService.find();
     }

     @Get('detail/:id')
     @ApiOperation({ summary: 'get a category by ID' })
     async findOne(@Param('id') id: string): Promise<Category> {
          return this.categoriesService.findById(id);
     }

     @Get('s/:slug')
     @ApiOperation({ summary: 'get a category by slug' })
     async findBySlug(@Param('slug') slug: string): Promise<Category> {
          return this.categoriesService.findBySlug(slug);
     }

     @Put('edit/:id')
     @ApiOperation({ summary: 'update a category by ID' })
     async update(@Param('id') id: string, @Body() data: UpdateCategoryDto): Promise<Category> {
          return this.categoriesService.update(id, data);
     }

     @Delete('delete/:id')
     @ApiOperation({ summary: 'delete a category by ID' })
     async delete(@Param('id') id: string): Promise<Category> {
          return this.categoriesService.delete(id);
     }
}
