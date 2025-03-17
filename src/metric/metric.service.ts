import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { METRIC_QUEUE_NAME } from './constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetricEntity } from './metric.entity';

@Injectable()
export class MetricService {
  constructor(
    @InjectQueue(METRIC_QUEUE_NAME) private metricQueue: Queue,
    @InjectRepository(MetricEntity)
    private metricRepository: Repository<MetricEntity>,
  ) {}

  async addJob(metric: string): Promise<void> {
    await this.metricQueue.add('store-metric', metric);
  }

  async storeMetric(metric: string): Promise<void> {
    await this.metricRepository.save({
      label: 'test',
      value: metric,
      timestamp: new Date(),
    });
  }
}
