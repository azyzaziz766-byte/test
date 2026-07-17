import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto/update-user.dto';
import { PaginationDto } from '../dto/pagination.dto/pagination.dto';

@Injectable()
export class UsersService {
  // Cache TTL constants

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async findAll(dto: PaginationDto) {
    const { page, limit, search, role, sort, order } = dto;
    const query = this.userRepository.createQueryBuilder('user');
    const cacheKey = `users:${page}:${limit}:${search ?? ''}:${role ?? ''}:${sort}:${order}`;
    const cachedUsers = await this.cacheManager.get(cacheKey);
    if (cachedUsers) {
      console.log('Returned From Cache');
      return cachedUsers;
    }
    if (search) {
      query.where('(user.name LIKE :search OR user.email LIKE :search)', {
        search: `%${search}%`,
      });
    }
    if (role) {
      query.andWhere('user.role = :role', { role });
    }
    query.orderBy(`user.${sort}`, order);
    query.skip((page - 1) * limit).take(limit);
    const [data, total] = await query.getManyAndCount();
    const result = {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
    await this.cacheManager.set(cacheKey, result, 300000);

    console.log('Returned From Database');

    return result;
  }
  async findOne(id: number) {
    const cacheKey = `user${id}`;
    const cachedUser = await this.cacheManager.get(cacheKey);
    if (cachedUser) {
      console.log('Returned From Cache');
      return cachedUser;
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    console.log('Returned From Database');
    await this.cacheManager.set(cacheKey, user, 300000);
    return user;
  }
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }
  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
    return {
      message: 'User deleted successfully',
    };
  }
}
