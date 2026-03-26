import type { TelemetryEvent } from '@link-manager/shared-types';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetry: TelemetryService) {}

  @Post()
  record(@Body() event: TelemetryEvent) {
    return this.telemetry.record(event);
  }

  @Get(':slug')
  stats(@Param('slug') slug: string) {
    return this.telemetry.stats(slug);
  }
}
