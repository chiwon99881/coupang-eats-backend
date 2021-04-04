import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/core/core.decorator';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { EditUserInput, EditUserOutput } from './dtos/edit-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  VerifiedEmailInput,
  VerifiedEmailOutput,
} from './dtos/verified-email.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation((returns) => CreateUserOutput)
  createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.usersService.createUser(createUserInput);
  }

  @Mutation((returns) => LoginOutput)
  loginUser(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.loginUser(loginInput);
  }

  @Mutation((returns) => EditUserOutput)
  editUser(
    @CurrentUser() user: User,
    @Args('input') editUserInput: EditUserInput,
  ): Promise<EditUserOutput> {
    return this.usersService.editUser(user, editUserInput);
  }

  @Query((returns) => User)
  findUserById(@Args('id') userId: number): Promise<User | null> {
    return this.usersService.findUserById(userId);
  }

  @Mutation((returns) => VerifiedEmailOutput)
  verifiedEmail(
    @CurrentUser() user: User,
    @Args('input') verifiedEmailInput: VerifiedEmailInput,
  ): Promise<VerifiedEmailOutput> {
    return this.usersService.verifiedEmail(user, verifiedEmailInput);
  }
}
