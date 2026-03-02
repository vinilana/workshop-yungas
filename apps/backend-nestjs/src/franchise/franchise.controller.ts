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
import { FranchiseService } from './franchise.service';
import type {
  CreateFranchiseDTO,
  UpdateFranchiseDTO,
  ApiResponse,
  Franchise,
} from '@franchise/shared';

@Controller('api/franchises')
export class FranchiseController {
  constructor(private readonly franchiseService: FranchiseService) {}

  @Get()
  findAll(@Query('search') search?: string): ApiResponse<Franchise[]> {
    const data = this.franchiseService.findAll(search);
    return { data };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): ApiResponse<Franchise> {
    const data = this.franchiseService.findOne(id);
    return { data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateFranchiseDTO): ApiResponse<Franchise> {
    const data = this.franchiseService.create(dto);
    return { data, message: 'Franchise created successfully' };
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFranchiseDTO,
  ): ApiResponse<Franchise> {
    const data = this.franchiseService.update(id, dto);
    return { data, message: 'Franchise updated successfully' };
  }

  @Patch(':id')
  patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFranchiseDTO,
  ): ApiResponse<Franchise> {
    const data = this.franchiseService.update(id, dto);
    return { data, message: 'Franchise updated successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number): ApiResponse<null> {
    this.franchiseService.remove(id);
    return { data: null, message: 'Franchise deleted successfully' };
  }
}
