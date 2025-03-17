import { Job } from 'bullmq';

import { Processor, WorkerHost } from '@nestjs/bullmq';

import { METRIC_QUEUE_NAME } from './constants';
import { MetricService } from './metric.service';

@Processor(METRIC_QUEUE_NAME)
export class MetricConsumer extends WorkerHost {
  constructor(private readonly metricService: MetricService) {
    super();
  }

  async process(job: Job<string>): Promise<void> {
    await this.metricService.storeMetric(job.data);
  }
}
