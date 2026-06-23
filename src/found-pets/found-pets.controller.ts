import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  // ─── POST ──────────────────────────────────────────────────────────────────

  @Post()
  create(@Body() dto: CreateFoundPetDto) {
    return this.foundPetsService.create(dto);
  }

  // ─── GET ───────────────────────────────────────────────────────────────────

  /** GET /found-pets  — devuelve todas las mascotas encontradas */
  @Get()
  findAll() {
    return this.foundPetsService.findAll();
  }

  /** GET /found-pets/:id */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.foundPetsService.findOne(id);
  }
}
