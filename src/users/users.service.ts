import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreService } from 'src/core/core.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { EditUserInput, EditUserOutput } from './dtos/edit-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  VerifiedEmailInput,
  VerifiedEmailOutput,
} from './dtos/verified-email.dto';
import { User } from './entities/users.entity';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verification: Repository<Verification>,
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
      const verificationCode = this.mailService.generatedCode();
      const verification = await this.verification.save(
        this.verification.create({
          userId: newUser.id,
          code: verificationCode,
        }),
      );
      this.mailService.sendMail(verification.code);
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
      const test = await this.verification.findOne({ id: 1 });
      console.log(test);
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

  async verifiedEmail(
    user: User,
    verifiedEmailInput: VerifiedEmailInput,
  ): Promise<VerifiedEmailOutput> {
    try {
      if (user.verified) {
        return {
          ok: false,
          error: 'You are already verified.',
        };
      }
      const verification = await this.verification.findOne({
        code: verifiedEmailInput.code,
      });
      if (!verification) {
        return {
          ok: false,
          error: 'Wrong code.',
        };
      }
      if (verification.userId !== user.id) {
        return {
          ok: false,
          error: 'You are not authorized.',
        };
      }
      await this.users.update({ id: user.id }, { verified: true });
      await this.verification.delete({ code: verifiedEmailInput.code });
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
