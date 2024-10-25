import { Injectable } from '@nestjs/common';
import {
     Category,
     CategoryCreateInput,
     CategoryUpdateInput,
} from '@/shared/interfaces/categories.interface';

import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class CategoriesRepository {
     constructor(private readonly prisma: PrismaService) {}

     async create(input: CategoryCreateInput): Promise<Category> {
          return this.prisma.category.create({
               data: {
                    name: input.name,
                    slug: input.slug,
               },
          });
     }

     async find(): Promise<Category[]> {
          return this.prisma.category.findMany();
     }

     async findById(id: string): Promise<Category> {
          return this.prisma.category.findUnique({
               where: { id },
          });
     }

     async findBySlug(slug: string): Promise<Category> {
          return this.prisma.category.findUnique({
               where: { slug },
          });
     }

     async update(id: string, data: CategoryUpdateInput): Promise<Category> {
          return this.prisma.category.update({
               where: { id },
               data,
          });
     }

     async delete(id: string): Promise<Category> {
          return this.prisma.category.delete({
               where: { id },
          });
     }
}
