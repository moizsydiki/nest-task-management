import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksService } from './tasks.service';
import { TasksRepository } from './task.repository';
import { TasksController } from './tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TasksRepository])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
