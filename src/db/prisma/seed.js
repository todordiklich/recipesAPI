import { hashPassword } from '../../utils/password.js';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Clear existing data in correct order (respecting foreign keys)
  await prisma.user.deleteMany();

  // 1. Create Users with proper password hashing
  console.log('Creating users with hashed passwords...');

  // Hash passwords for test users
  const testPasswordHash = await hashPassword('Test123!@#');
  const adminPasswordHash = await hashPassword('Admin123!@#');
  const alicePasswordHash = await hashPassword('Alice123!@#');
  const bobPasswordHash = await hashPassword('Bob123!@#');

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: testPasswordHash,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        passwordHash: adminPasswordHash,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        name: 'Alice Johnson',
        passwordHash: alicePasswordHash,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        name: 'Bob Smith',
        passwordHash: bobPasswordHash,
        isActive: true,
      },
    }),
  ]);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
