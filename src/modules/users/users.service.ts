import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserCreateInput, UserUpdateInput } from '@/shared/interfaces/user.interface';
import { UsersRepository } from '@/modules/users/users.repository';
import { FindUserDto } from '@/modules/users/dtos/find-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
     constructor(
          private readonly usersRepository: UsersRepository,
          private readonly cloudinaryService: CloudinaryService,
     ) {}

     async create(user: UserCreateInput): Promise<User> {
          return this.usersRepository.create(user);
     }

     async find(params: FindUserDto): Promise<User[]> {
          const users = await this.usersRepository.find(params);

          if (users.length === 0) throw new NotFoundException('Users not found.');

          return users;
     }

     async findById(id: string): Promise<User> {
          const user = await this.usersRepository.findById(id);

          if (!user) throw new NotFoundException(`User not found - ID: ${id}`);

          return user;
     }

     async findByEmail(email: string): Promise<User> {
          const user = await this.usersRepository.findByEmail(email);

          if (!user) throw new NotFoundException(`User not found - EMAIL: ${email}`);

          return user;
     }

     async findByUsername(username: string): Promise<User> {
          const user = await this.usersRepository.findByUsername(username);

          if (!user) throw new NotFoundException(`User not found - USERNAME: ${username}`);

          return user;
     }

     async findByProviderId(provider: string, email: string, id: string): Promise<User> {
          const user = await this.usersRepository.findByProviderId(provider, email, id);
          return user;
     }

     async findOneByEmailAndUsername(email: string, username: string): Promise<User> {
          const user = await this.usersRepository.findOneByEmailAndUsername(email, username);
          return user;
     }

     async findOneByResetToken(token: string): Promise<User> {
          const user = await this.usersRepository.findOneByResetToken(token);
          if (!user) throw new NotFoundException(`User not found - RESET TOKEN: ${token}`);

          return user;
     }

     async update(id: string, data: UserUpdateInput): Promise<User> {
          await this.findById(id);

          if (data?.avatar?.url) {
               const { url, public_id } = await this.cloudinaryService.uploadImage(
                    data?.avatar?.url,
               );

               await this.update(id, {
                    avatar: {
                         public_id,
                         url,
                    },
               });

               return;
          }

          const user = await this.usersRepository.update(id, {
               ...data,
          });

          return user;
     }

     async updateByRole(id: string, role: 'ADMIN' | 'USER' | 'MODERATOR'): Promise<User> {
          await this.findById(id);
          const user = await this.usersRepository.updateByRole(id, role);

          if (!user) throw new NotFoundException(`User not found - ID: ${id}`);

          return user;
     }

     async block(id: string): Promise<User> {
          await this.findById(id);
          const user = await this.usersRepository.block(id);

          return user;
     }

     async unBlock(id: string): Promise<User> {
          await this.findById(id);
          const user = await this.usersRepository.unBlock(id);

          return user;
     }

     async delete(id: string): Promise<User> {
          const user = await this.findById(id);
          await this.cloudinaryService.destroyFile(user?.avatar?.public_id);

          return await this.usersRepository.delete(id);
     }
}
