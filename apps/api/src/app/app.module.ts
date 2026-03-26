import { Module } from '@nestjs/common';
import { DrizzleModule } from '../db/drizzle.module';
import { LinksModule } from '../links/links.module';
import { TelemetryModule } from '../telemetry/telemetry.module';

@Module({
  imports: [DrizzleModule, LinksModule, TelemetryModule],
})
export class AppModule {}
