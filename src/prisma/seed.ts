import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./seed/roles.seed";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  await seedRoles();

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
