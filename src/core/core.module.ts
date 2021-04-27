import { DynamicModule, Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { UsersService } from 'src/users/users.service';
import { PRIVATE_KEY, PUB_SUB } from './core.constants';
import { CoreService } from './core.service';

interface Options {
  privateKey: string;
}

@Global()
@Module({})
export class CoreModule {
  static forRoot(options: Options): DynamicModule {
    return {
      module: CoreModule,
      providers: [
        {
          provide: PRIVATE_KEY,
          useValue: options.privateKey,
        },
        {
          provide: PUB_SUB,
          useValue: new PubSub(),
        },
        CoreService,
      ],
      exports: [CoreService, PUB_SUB],
    };
  }
}
