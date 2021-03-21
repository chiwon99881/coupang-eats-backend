import { DynamicModule, Global, Module } from '@nestjs/common';
import { MAIL_API_KEY, MAIL_DOMAIN } from './mail.constants';
import { MailService } from './mail.service';

interface Options {
  mailApiKey: string;
  mailDomain: string;
}

@Global()
@Module({})
export class MailModule {
  static forRoot(options: Options): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: MAIL_API_KEY,
          useValue: options.mailApiKey,
        },
        {
          provide: MAIL_DOMAIN,
          useValue: options.mailDomain,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
