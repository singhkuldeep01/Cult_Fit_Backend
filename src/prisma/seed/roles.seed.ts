import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedRoles() {
  const roles = [
    { role_id: 1, role_name: "MEMBER", description: "Regular member of the gym" },
    { role_id: 2, role_name: "TRAINER", description: "Trainer conducting gym classes" },
    { role_id: 3, role_name: "HOST", description: "Person who owns or manages the gym center" },
    { role_id: 4, role_name: "ADMIN", description: "System administrator with full access" },
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
