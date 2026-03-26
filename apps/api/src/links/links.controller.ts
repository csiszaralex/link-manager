import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LinksService } from './links.service';
import type { CreateLinkDto, UpdateLinkDto } from '@link-manager/shared-types';

@Controller('links')
export class LinksController {
  constructor(private readonly links: LinksService) {}

  @Get()      findAll()                                  { return this.links.findAll(); }
  @Get(':id') findOne(@Param('id') id: string)           { return this.links.findOne(id); }
  @Post()     create(@Body() dto: CreateLinkDto)         { return this.links.create(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateLinkDto) { return this.links.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string)        { return this.links.remove(id); }
}
