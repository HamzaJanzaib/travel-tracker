
import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';


@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (typeof connectionString !== 'string' || connectionString.trim().length === 0) {
      throw new Error(
        'DATABASE_URL is missing. Add it to .env (example: postgresql://user:password@host:5432/db?sslmode=require).',
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(connectionString);
    } catch {
      throw new Error('DATABASE_URL is not a valid URL.');
    }

    if (!parsedUrl.password || parsedUrl.password.length === 0) {
      throw new Error(
        'DATABASE_URL must include a password in the URL (postgresql://user:password@host/db).',
      );
    }

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }
}
