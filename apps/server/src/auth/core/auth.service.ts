import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, SignUpInput } from '../../graphql';
import { User } from '../../user/core/user.entity';
import { UserService } from '../../user/core/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    username: User['username'],
    password: string
  ): Promise<User> {
    const user = await this.userService.getByUsername(username);

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (user && isMatch) {
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

  async registerUser(userInput: SignUpInput): Promise<User> {
    const passwordHash = await bcrypt.hash(userInput.password, 12);

    const user = await this.userService.create({ ...userInput, passwordHash });

    return user;
  }
}
