import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from '../graphql';
import { User } from '../user/core/user.entity';
import { UserService } from '../user/core/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: User['username'], pass: string): Promise<User> {
    const user = await this.userService.getByUsername(username);
    if (user && user.password === pass) {
      return user;
    }
    throw new UnauthorizedException(
      `User ${username} not found, or incorrect password`
    );
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const user = await this.validateUser(username, password);

    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
