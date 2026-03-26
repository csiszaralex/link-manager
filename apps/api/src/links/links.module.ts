import { Module } from '@nestjs/common';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { KvSyncService } from '../kv/kv-sync.service';

@Module({
  controllers: [LinksController],
  providers: [LinksService, KvSyncService],
})
export class LinksModule {}
