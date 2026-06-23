import {
  Body,
  Controller,
  Get,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  // ─── POST ──────────────────────────────────────────────────────────────────

  @Post()
  create(@Body() dto: CreateLostPetDto) {
    return this.lostPetsService.create(dto);
  }

  // ─── GET ───────────────────────────────────────────────────────────────────

  /** GET /lost-pets  — devuelve todas las mascotas perdidas */
  @Get()
  findAll() {
    return this.lostPetsService.findAll();
  }

  /** GET /lost-pets/nearby?lat=XX&lng=YY&radius=500 */
  @Get('nearby')
  findNearby(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radius') radius?: string,
  ) {
    const radiusMeters = radius ? parseFloat(radius) : 500;
    return this.lostPetsService.findNearby(lat, lng, radiusMeters);
  }

  /** GET /lost-pets/:id */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lostPetsService.findOne(id);
  }
}
