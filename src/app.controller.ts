import { Controller, Get } from '@nestjs/common';
import { HealthStatusService } from './app.service';

@Controller()
export class HealthStatusController {
  constructor(private readonly appService: HealthStatusService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
