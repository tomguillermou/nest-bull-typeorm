import { Queue } from 'bullmq';

import { getQueueToken } from '@nestjs/bullmq';
import { Test, TestingModule } from '@nestjs/testing';

import { METRIC_QUEUE_NAME } from './constants';
import { MetricController } from './metric.controller';
import { MetricModule } from './metric.module';

describe('MetricController', () => {
  let module: TestingModule;
  let controller: MetricController;
  let queue: Queue;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [MetricModule],
    }).compile();

    controller = module.get(MetricController);
    queue = module.get(getQueueToken(METRIC_QUEUE_NAME));
  });

  beforeEach(async () => {
    await queue.drain();
  });

  afterAll(async () => {
    await queue.close();
    await module.close();
  });

  it('should add a job when creating a metric', async () => {
    // Arrange
    const metric = 'metric value';

    // Act
    await controller.createMetric(metric);

    // Assert
    await expect(queue.getWaiting()).resolves.toContainEqual(
      expect.objectContaining({
        name: 'store-metric',
        data: metric,
      }),
    );
  });
});
