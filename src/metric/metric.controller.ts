import { Body, Controller, Post } from '@nestjs/common';
import { MetricService } from './metric.service';

@Controller('metrics')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Post()
  async createMetric(@Body() data: string): Promise<void> {
    await this.metricService.addJob(data);
  }
}
