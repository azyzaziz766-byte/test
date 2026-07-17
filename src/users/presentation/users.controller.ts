import {Controller,Get,Post,Put,Delete,Param,Body, Patch,Query,UploadedFile,UseInterceptors,} from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { CreateUserDto } from '../dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto/update-user.dto';
import { PaginationDto } from '../dto/pagination.dto/pagination.dto';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

@Get()
findAll(@Query() query: PaginationDto) {
  return this.usersService.findAll(query);
}
  @Get('/:id/')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Post()
  create(@Body() createUserDto:CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto:UpdateUserDto) {
    return this.usersService.update(Number(id), updateUserDto);
  }
  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateUserDto:UpdateUserDto) {
    return this.usersService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }

}