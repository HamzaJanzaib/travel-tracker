import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobsService } from './cron.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CronJobsService],
})
export class CronModule {}
