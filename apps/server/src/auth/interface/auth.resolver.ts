import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthResponse, SignUpInput, User } from '../../graphql';
import { UserService } from '../../user/core/user.service';
import { AuthService } from '../auth.service';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Mutation('signUp')
  public async signUp(@Args('input') input: SignUpInput): Promise<User> {
    const user = await this.userService.create(input);
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      blocks: [],
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
