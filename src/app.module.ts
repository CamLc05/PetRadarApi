import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/envs';
import { LostPet } from './core/entities/lost-pet.entity';
import { FoundPet } from './core/entities/found-pet.entity';
import { LostPetsModule } from './lost-pets/lost-pets.module';
import { FoundPetsModule } from './found-pets/found-pets.module';
import { EmailModule } from './email/email.module';

// Railway y Render proveen DATABASE_URL automáticamente.
// Si está presente, lo usamos directamente; si no, usamos las variables individuales.
const dbConfig = envs.DATABASE_URL
  ? {
      url: envs.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      username: envs.DB_USER,
      password: envs.DB_PASSWORD,
      database: envs.DB_NAME,
    };

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...dbConfig,
      entities: [LostPet, FoundPet],
      synchronize: true,
    }),
    LostPetsModule,
    FoundPetsModule,
    EmailModule,
  ],
})
export class AppModule {}
