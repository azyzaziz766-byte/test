import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../users/domain/user.entity';
import { RegisterDto } from '../../common/dto/registre.dto/registre.dto';
import { LoginDto } from '../../common/dto/login.dto/login.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { MailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    this.logger.log(`Login attempt: ${email}`);

    // 1. البحث على المستخدم
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      this.logger.warn(`Login failed: user ${email} not found`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. التحقق من كلمة السر
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: invalid password for ${email}`);
      throw new UnauthorizedException('mdp');
    }

    // 3. Payload
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // 4. Generate Access Token
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    // 5. Generate Refresh Token
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // 6. Hash Refresh Token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // 7. Save Hash في قاعدة البيانات
    user.hashedRefreshToken = hashedRefreshToken;
    await this.userRepository.save(user);

    this.logger.log(`User ${email} logged in successfully`);

    // 8. Return Tokens
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  async refresh(refreshToken: string) {
    // 1. verify token
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET!,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 2. find user
    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('User not found');
    }

    // 3. compare hash
    const isValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 4. generate new access token
    const newAccessToken = this.jwtService.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      {
        secret: process.env.JWT_ACCESS_SECRET!,
        expiresIn: '15m',
      },
    );

    return {
      access_token: newAccessToken,
    };
  }
  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    // 1. check if user exists
    const userExists = await this.userRepository.findOneBy({ email });

    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = randomBytes(32).toString('hex');

    // 3. create user
    const user = this.userRepository.create({
      name,
      email,
      role: UserRole.USER,
      password: hashedPassword,
      verificationToken: token,
      isVerified: false,
    });

    // 4. save
    await this.mailService.sendVerificationEmail(user.email, token);

    return {
      message: 'Check your email to verify account',
    };
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, {
      hashedRefreshToken: null,
    });

    return {
      message: 'Logged out successfully',
    };
  }
  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    user.isVerified = true;

    user.verificationToken = null;

    await this.userRepository.save(user);

    return {
      message: 'Email verified successfully',
    };
  }
}
