import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse, SignUpInput } from '../graphql';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client-xeo';

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

    const user = await this.userService.create({
      firstName: userInput.firstName,
      lastName: userInput.lastName,
      username: userInput.username,
      passwordHash,
    });

    return user;
  }
}
