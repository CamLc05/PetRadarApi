import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FoundPet } from '../core/entities/found-pet.entity';
import { LostPetsService } from '../lost-pets/lost-pets.service';
import { EmailService } from '../email/email.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepo: Repository<FoundPet>,
    private readonly dataSource: DataSource,
    private readonly lostPetsService: LostPetsService,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateFoundPetDto): Promise<any> {
    const result = await this.dataSource.query(
      `INSERT INTO found_pets (
          species, breed, color, size, description, photo_url,
          finder_name, finder_email, finder_phone,
          location, address, found_date, created_at, updated_at
      ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9,
          ST_SetSRID(ST_MakePoint($10, $11), 4326),
          $12, $13, NOW(), NOW()
      ) RETURNING *`,
      [
        dto.species,
        dto.breed ?? null,
        dto.color,
        dto.size,
        dto.description,
        dto.photo_url ?? null,
        dto.finder_name,
        dto.finder_email,
        dto.finder_phone,
        dto.lng,
        dto.lat,
        dto.address,
        dto.found_date,
      ],
    );

    const savedPet = result[0];

    // Notificar por email — se atrapa el error para que no cancele la respuesta
    try {
      const nearbyLostPets = await this.lostPetsService.findNearby(dto.lat, dto.lng);
      for (const lostPet of nearbyLostPets) {
        const html = this.emailService.buildFoundPetEmail(
          { ...savedPet, found_lng: dto.lng, found_lat: dto.lat },
          { ...lostPet },
        );
        await this.emailService.sendEmail({
          to: lostPet.owner_email,
          subject: `🐾 PetRadar - Encontraron una mascota cerca de donde perdiste a ${lostPet.name}`,
          html,
        });
      }
    } catch (error) {
      console.warn('Notificación por email omitida:', error.message);
    }

    return savedPet;
  }

  async findAll(): Promise<any[]> {
    return this.dataSource.query(`
      SELECT
        id, species, breed, color, size, description, photo_url,
        finder_name, finder_phone,
        ST_X(location::geometry) AS lng,
        ST_Y(location::geometry) AS lat,
        address, found_date, created_at, updated_at
      FROM found_pets
      ORDER BY created_at DESC
    `);
  }

  async findOne(id: number): Promise<any> {
    const result = await this.dataSource.query(
      `SELECT
        id, species, breed, color, size, description, photo_url,
        finder_name, finder_email, finder_phone,
        ST_X(location::geometry) AS lng,
        ST_Y(location::geometry) AS lat,
        address, found_date, created_at, updated_at
      FROM found_pets
      WHERE id = $1`,
      [id],
    );
    if (!result.length) {
      throw new NotFoundException(`Mascota encontrada con id ${id} no encontrada`);
    }
    return result[0];
  }
}
