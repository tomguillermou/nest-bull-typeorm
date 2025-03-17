import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '../database.module';
import { QueueModule } from '../queue.module';
import { METRIC_QUEUE_NAME } from './constants';
import { MetricConsumer } from './metric.consumer';
import { MetricController } from './metric.controller';
import { MetricEntity } from './metric.entity';
import { MetricService } from './metric.service';

@Module({
  imports: [
    QueueModule,
    DatabaseModule,
    TypeOrmModule.forFeature([MetricEntity]),
    BullModule.registerQueue({ name: METRIC_QUEUE_NAME }),
  ],
  controllers: [MetricController],
  providers: [MetricService, MetricConsumer],
})
export class MetricModule {}
