import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import type {
  CreateCollaboratorDTO,
  UpdateCollaboratorDTO,
  ApiResponse,
  Collaborator,
} from '@franchise/shared';

@Controller('api/collaborators')
export class CollaboratorController {
  constructor(private readonly collaboratorService: CollaboratorService) {}

  @Get()
  findAll(@Query('search') search?: string): ApiResponse<Collaborator[]> {
    const data = this.collaboratorService.findAll(search);
    return { data };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): ApiResponse<Collaborator> {
    const data = this.collaboratorService.findOne(id);
    return { data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCollaboratorDTO): ApiResponse<Collaborator> {
    const data = this.collaboratorService.create(dto);
    return { data, message: 'Collaborator created successfully' };
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCollaboratorDTO,
  ): ApiResponse<Collaborator> {
    const data = this.collaboratorService.update(id, dto);
    return { data, message: 'Collaborator updated successfully' };
  }

  @Patch(':id')
  patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCollaboratorDTO,
  ): ApiResponse<Collaborator> {
    const data = this.collaboratorService.update(id, dto);
    return { data, message: 'Collaborator updated successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number): ApiResponse<null> {
    this.collaboratorService.remove(id);
    return { data: null, message: 'Collaborator deleted successfully' };
  }
}
