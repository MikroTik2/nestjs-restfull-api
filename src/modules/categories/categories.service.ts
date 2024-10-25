import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

import { CreateCategoryDto } from '@/modules/categories/dtos/create.dto';
import { UpdateCategoryDto } from '@/modules/categories/dtos/update.dto';

import { Category } from '@prisma/client';
import { CategoryCreateInput } from '@/shared/interfaces/categories.interface';

import slugify from 'slugify';

@Injectable()
export class CategoriesService {
     constructor(private readonly categoriesRepository: CategoriesRepository) {}

     async create(createDto: CreateCategoryDto): Promise<Category> {
          let input: CategoryCreateInput = {
               name: createDto.name,
               slug: slugify(createDto.name, {
                    lower: true,
               }),
          };

          const hasExist = await this.categoriesRepository.findBySlug(input.slug);
          if (hasExist) throw new BadRequestException('Categories already exist for this category');

          const created = await this.categoriesRepository.create(input);

          return created;
     }

     async find(): Promise<Category[]> {
          const categories = await this.categoriesRepository.find();

          if (categories.length === 0) throw new BadRequestException('Categories not found');

          return categories;
     }

     async findById(id: string): Promise<Category> {
          const category = this.categoriesRepository.findById(id);
          if (!category) throw new BadRequestException('Category not found');

          return category;
     }

     async findBySlug(slug: string): Promise<Category> {
          const category = this.categoriesRepository.findBySlug(slug);
          if (!category) throw new BadRequestException('Category not found');

          return category;
     }

     async update(id: string, data: UpdateCategoryDto): Promise<Category> {
          const exist = await this.categoriesRepository.findBySlug(slugify(data.name));
          if (exist && exist.id !== id) throw new BadRequestException('Category not found');

          const updated = await this.categoriesRepository.update(id, {
               name: data.name,
               slug: slugify(data.name, {
                    lower: true,
               }),
          });
          return updated;
     }

     async delete(id: string): Promise<Category> {
          const category = await this.categoriesRepository.findById(id);
          if (!category) throw new BadRequestException('Category not found');

          return await this.categoriesRepository.delete(category.id);
     }
}
