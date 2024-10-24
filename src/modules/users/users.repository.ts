import { Injectable } from '@nestjs/common';
import { User, UserCreateInput, UserUpdateInput } from '@/shared/interfaces/user.interface';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { FindUserDto } from '@/modules/users/dtos/find-user.dto';

@Injectable()
export class UsersRepository {
     constructor(private readonly prisma: PrismaService) {}

     async create(user: UserCreateInput): Promise<User> {
          return this.prisma.user.create({ data: { ...user } });
     }

     async find(params: FindUserDto): Promise<User[]> {
          return this.prisma.user.findMany({ ...params });
     }

     async findById(id: string): Promise<User> {
          return this.prisma.user.findUnique({ where: { id } });
     }

     async findByEmail(email: string): Promise<User> {
          return this.prisma.user.findUnique({ where: { email } });
     }

     async findByUsername(username: string): Promise<User> {
          return this.prisma.user.findUnique({ where: { username } });
     }

     async findByProviderId(provider: string, email: string, id: string): Promise<User | null> {
          const user = await this.prisma.user.findFirst({
               where: {
                    OR: [{ [provider + '_id']: id }, { email }],
               },
          });
          return user;
     }

     async findOneByEmailAndUsername(email: string, username: string): Promise<User> {
          return this.prisma.user.findUnique({ where: { email, username } });
     }

     async findOneByResetToken(token: string): Promise<User> {
          return this.prisma.user.findFirst({ where: { reset_password_token: token } });
     }

     async update(id: string, data: UserUpdateInput): Promise<User> {
          return this.prisma.user.update({ where: { id }, data: data });
     }

     async updateByRole(id: string, role: 'ADMIN' | 'USER' | 'MODERATOR'): Promise<User> {
          return this.prisma.user.update({ where: { id }, data: { role: role } });
     }

     async block(id: string): Promise<User> {
          return this.prisma.user.update({ where: { id }, data: { blocked: true } });
     }

     async unBlock(id: string): Promise<User> {
          return this.prisma.user.update({ where: { id }, data: { blocked: false } });
     }

     async delete(id: string): Promise<User> {
          return this.prisma.user.delete({ where: { id } });
     }
}
