import { LikeDishInput, LikeDishOutput } from './dtos/like-dish.dto';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/core/core.decorator';
import { isLoggedGuard } from 'src/core/core.guard';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { EditUserInput, EditUserOutput } from './dtos/edit-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { MeOutput } from './dtos/my-profile.dto';
import {
  VerifiedEmailInput,
  VerifiedEmailOutput,
} from './dtos/verified-email.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { UnlikeDishOutput, UnlikeDishInput } from './dtos/unlike-dish.dto';

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
  @UseGuards(isLoggedGuard)
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
  @UseGuards(isLoggedGuard)
  verifiedEmail(
    @CurrentUser() user: User,
    @Args('input') verifiedEmailInput: VerifiedEmailInput,
  ): Promise<VerifiedEmailOutput> {
    return this.usersService.verifiedEmail(user, verifiedEmailInput);
  }

  @Query((returns) => MeOutput)
  @UseGuards(isLoggedGuard)
  me(@CurrentUser() user: User): Promise<MeOutput> {
    console.log(user);
    return this.usersService.me(user);
  }

  @Mutation((returns) => LikeDishOutput)
  @UseGuards(isLoggedGuard)
  likeDish(
    @CurrentUser() user: User,
    @Args('input') likeDishInput: LikeDishInput,
  ): Promise<LikeDishOutput> {
    return this.usersService.likeDish(user, likeDishInput);
  }

  @Mutation((returns) => UnlikeDishOutput)
  @UseGuards(isLoggedGuard)
  unlikeDish(
    @CurrentUser() user: User,
    @Args('input') unlikeDishInput: UnlikeDishInput,
  ): Promise<UnlikeDishOutput> {
    return this.usersService.unlikeDish(user, unlikeDishInput);
  }
}
