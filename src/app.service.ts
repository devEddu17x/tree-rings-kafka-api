import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthStatusService {
  getHello(): string {
    return 'API is healthy';
  }
}
