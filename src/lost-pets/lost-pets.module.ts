import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from '../core/entities/lost-pet.entity';
import { LostPetsController } from './lost-pets.controller';
import { LostPetsService } from './lost-pets.service';

@Module({
  imports: [TypeOrmModule.forFeature([LostPet])],
  controllers: [LostPetsController],
  providers: [LostPetsService],
  exports: [LostPetsService],
})
export class LostPetsModule {}
