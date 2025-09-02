import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./seed/roles.seed";
import { seedUsers } from "./seed/user.seed";
import { seedGymCenters } from "./seed/gymCenter.seed";
import { seedClassTemplates } from "./seed/classTemplate.seed";
import { seedCenterHolidays } from "./seed/holidays.seed";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  await seedRoles();
  await seedUsers();
  await seedGymCenters();
  await seedClassTemplates();
  await seedCenterHolidays();

  console.log("🌱 Seeding finished!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => { 
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
