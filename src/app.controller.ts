import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  someTest() {
    return 'Api is working successfully';
  }
}