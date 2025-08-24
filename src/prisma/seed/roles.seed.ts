import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedRoles() {
  const roles = [
    { role_name: "MEMBER", description: "Regular member of the gym" },
    { role_name: "TRAINER", description: "Trainer conducting gym classes" },
    { role_name: "ADMIN", description: "System administrator with full access" },
    { role_name: "GYM_OWNER", description: "Person who owns or manages the gym center" },
  ];

  for (const role of roles) {
    await prisma.roles.upsert({
      where: { role_name: role.role_name },
      update: {}, // do nothing if already exists
      create: role,
    });
  }

  console.log("✅ Roles seeded successfully");
}
