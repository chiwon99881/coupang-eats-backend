import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from 'src/core/core.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { EditUserInput, EditUserOutput } from './dtos/edit-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly coreService: CoreService,
    private readonly mailService: MailService,
  ) {}

  async createUser(
    createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    try {
      const existUser = await this.users.findOne({
        email: createUserInput.email,
      });
      if (existUser) {
        return {
          ok: false,
          error: 'You already has account.',
        };
      }
      const newUser = this.users.create(createUserInput);
      await this.users.save(newUser);
      return {
        ok: true,
        user: newUser,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async loginUser(loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ email: loginInput.email });
      if (!user) {
        return {
          ok: false,
          error: "We can't found user with this email.",
        };
      }
      const isMatched = await user.checkPassword(loginInput.password);
      if (!isMatched) {
        return {
          ok: false,
          error: 'Wrong password.',
        };
      }
      const token = this.coreService.sign(user.id);
      this.mailService.sendMail();
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findUserById(userId: number): Promise<User | null> {
    try {
      const user = await this.users.findOne({ id: userId });
      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async editUser(
    user: User,
    editUserInput: EditUserInput,
  ): Promise<EditUserOutput> {
    try {
      const { id } = editUserInput;
      if (!id) {
        return {
          ok: false,
          error: 'User id required.',
        };
      }
      const findUser = await this.users.findOne({ id });
      if (!findUser) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
      if (user.id !== findUser.id) {
        return {
          ok: false,
          error: "You can't do this.",
        };
      }
      await this.users.update({ id: user.id }, { ...editUserInput });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
