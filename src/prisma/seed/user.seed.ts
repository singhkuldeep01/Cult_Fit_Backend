import { prisma } from "../client";
import bcrypt from "bcrypt";

export async function seedUsers() {
  const passwordHash = await bcrypt.hash("123456789", 10);

  // Fetch roles to map IDs
  const roles = await prisma.roles.findMany();
  const roleMap = Object.fromEntries(roles.map((r) => [r.role_name, r.role_id]));

  const usersData = [
    // 4 HOST + MEMBER
    ...Array.from({ length: 4 }).map((_, i) => ({
      name: `HostMember${i + 1}`,
      email: `abc${i + 1}@gmail.com`,
      phone: `+91111111111${i + 1}`, // fake e.164
      roleNames: ["HOST", "MEMBER"],
    })),
    // 4 MEMBER only
    ...Array.from({ length: 4 }).map((_, i) => ({
      name: `Member${i + 1}`,
      email: `abc${i + 5}@gmail.com`,
      phone: `+92222222222${i + 1}`,
      roleNames: ["MEMBER"],
    })),
    // 2 TRAINER + MEMBER
    ...Array.from({ length: 2 }).map((_, i) => ({
      name: `TrainerMember${i + 1}`,
      email: `abc${i + 9}@gmail.com`,
      phone: `+93333333333${i + 1}`,
      roleNames: ["TRAINER", "MEMBER"],
    })),
  ];

  for (const user of usersData) {
    // Upsert user
    const createdUser = await prisma.users.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        phone_no: user.phone,
      },
    });

    // Upsert credentials (LOCAL provider)
    await prisma.credentials.upsert({
      where: {
        user_id_provider: {
          user_id: createdUser.user_id,
          provider: "LOCAL",
        },
      },
      update: { hashedPassword: passwordHash },
      create: {
        user_id: createdUser.user_id,
        provider: "LOCAL",
        hashedPassword: passwordHash,
      },
    });

    // Attach roles
    for (const roleName of user.roleNames) {
      await prisma.users_roles.upsert({
        where: {
          user_id_role_id: {
            user_id: createdUser.user_id,
            role_id: roleMap[roleName],
          },
        },
        update: {},
        create: {
          user_id: createdUser.user_id,
          role_id: roleMap[roleName],
        },
      });
    }
  }

  console.log("✅ 10 users seeded with roles + credentials");
}
