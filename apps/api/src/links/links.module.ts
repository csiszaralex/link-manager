import { Module } from '@nestjs/common';
import { KvSyncService } from '../kv/kv-sync.service';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';

@Module({
  controllers: [LinksController],
  providers: [LinksService, KvSyncService],
})
export class LinksModule {}
