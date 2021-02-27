import { DynamicModule, Global, Module } from '@nestjs/common';
import { PRIVATE_KEY } from './core.constants';
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
        CoreService,
      ],
      exports: [CoreService],
    };
  }
}
