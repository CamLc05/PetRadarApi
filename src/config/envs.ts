import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').default('3000').asPortNumber(),
  DB_HOST: env.get('DB_HOST').required().asString(),
  DB_NAME: env.get('DB_NAME').required().asString(),
  DB_PORT: env.get('DB_PORT').default('5432').asPortNumber(),
  DB_USER: env.get('DB_USER').required().asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
  // DATABASE_URL tiene prioridad si está presente (Railway/Render lo proveen)
  DATABASE_URL: env.get('DATABASE_URL').asString(),
  MAILER_EMAIL: env.get('MAILER_EMAIL').required().asString(),
  MAILER_PASSWORD: env.get('MAILER_PASSWORD').required().asString(),
  MAILER_SERVICE: env.get('MAILER_SERVICE').default('gmail').asString(),
  MAPBOX_TOKEN: env.get('MAPBOX_TOKEN').asString(),
};
