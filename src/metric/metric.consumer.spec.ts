import { Queue, QueueEvents } from 'bullmq';
import { Repository } from 'typeorm';

import { getQueueToken } from '@nestjs/bullmq';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { METRIC_JOB_NAME, METRIC_QUEUE_NAME } from './constants';
import { MetricEntity } from './metric.entity';
import { MetricModule } from './metric.module';

describe('MetricConsumer', () => {
  let module: TestingModule;
  let queue: Queue;
  let metricRepository: Repository<MetricEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [MetricModule],
    }).compile();

    await module.init(); // calls the onModuleInit hook which binds processors

    queue = module.get(getQueueToken(METRIC_QUEUE_NAME));
    metricRepository = module.get(getRepositoryToken(MetricEntity));
  });

  beforeEach(async () => {
    await queue.drain();
    await metricRepository.clear();
  });

  afterAll(async () => {
    await queue.close();
    await module.close();
  });

  it('should store metric', async () => {
    // Arrange
    const metricValue = 'metric value';
    const job = await queue.add(METRIC_JOB_NAME, metricValue);

    // Act
    await job.waitUntilFinished(new QueueEvents(METRIC_QUEUE_NAME));

    // Assert
    await expect(queue.getCompleted()).resolves.toContainEqual(
      expect.objectContaining({ id: job.id }),
    );

    await expect(metricRepository.find()).resolves.toContainEqual(
      expect.objectContaining({ value: metricValue }),
    );
  });
});
