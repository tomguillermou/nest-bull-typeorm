import { Module } from '@nestjs/common';

import { MetricModule } from './metric/metric.module';

@Module({
  imports: [MetricModule],
})
export class AppModule {}
