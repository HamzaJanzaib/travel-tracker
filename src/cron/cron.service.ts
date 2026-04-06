import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  Cron,
  CronExpression,
  SchedulerRegistry,
} from '@nestjs/schedule';

@Injectable()
export class CronJobsService implements OnModuleInit {
  private readonly logger = new Logger(CronJobsService.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  onModuleInit() {
    const cronJobs = Array.from(this.schedulerRegistry.getCronJobs().keys());
    this.logger.log(
      `Registered cron jobs: ${cronJobs.length ? cronJobs.join(', ') : 'none'}`,
    );
  }

  // Runs every minute to confirm scheduler health.
  @Cron(CronExpression.EVERY_MINUTE)
  handleHeartbeat() {
    this.logger.log('Cron heartbeat: scheduler is running');
  }

  // Example: daily maintenance task at midnight server time.
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'daily-maintenance' })
  handleDailyMaintenance() {
    this.logger.log('Daily maintenance cron executed');
  }

  // Example: Monday 09:00 in Asia/Karachi for weekly summaries.
  @Cron('0 0 9 * * 1', {
    name: 'weekly-summary',
    timeZone: 'Asia/Karachi',
  })
  handleWeeklySummary() {
    this.logger.log('Weekly summary cron executed (Asia/Karachi)');
  }
}
