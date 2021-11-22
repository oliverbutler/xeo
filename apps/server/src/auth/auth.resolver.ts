import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthResponse, SignUpInput, User } from '../graphql';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('signUp')
  public async signUp(@Args('input') input: SignUpInput): Promise<User> {
    const user = await this.authService.registerUser(input);
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  @Mutation('signIn')
  public async signIn(
    @Args('username') username: string,
    @Args('password') password: string
  ): Promise<AuthResponse> {
    return this.authService.login(username, password);
  }
}
