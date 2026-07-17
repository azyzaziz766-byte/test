import { Body, Controller, Post ,Get} from '@nestjs/common';
import { AuthService } from '../application/auth.service';

import { RegisterDto } from '../../common/dto/registre.dto/registre.dto';
import { LoginDto } from '../../common/dto/login.dto/login.dto';
import { RefreshTokenDto } from '../../common/dto/refreshToken.Dto/refreshToken.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserGuard } from '../../common/guards/user.guard';
import { Request } from '@nestjs/common';

@Controller('auth')
export class AuthController {

 constructor(private authService:AuthService){}

 @Post('register')
  register(@Body() registerDto:RegisterDto){
    return this.authService.register(registerDto);
  }

 @Post('login')
 login(@Body() loginDto:LoginDto){
    return this.authService.login(loginDto);
 }
 @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

 @UseGuards(JwtAuthGuard,RolesGuard)
 @Roles("user")
 @Get('profile/user')
 getProfile(@Request() req) {
    return req.user;
 }

 @UseGuards(JwtAuthGuard,RolesGuard)
 @Roles("admin")
 @Get('profile/admin')
 getProfileAdmin(@Request() req) {
    return req.user;
 }
 @UseGuards(JwtAuthGuard)
 @Post("logout")
 logOut(@Request() req){
   return this.authService.logout(Number(req.user.userId))
 }

}