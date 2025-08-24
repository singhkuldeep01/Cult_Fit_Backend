import { CreateUserDTO, UserWithCredentialsAndRolesDTO } from "../dto/user.dto";
import { prisma } from "../prisma/client";
import { Prisma, users } from "@prisma/client";

export class UserRepository {
  async createUser(data: CreateUserDTO) : Promise<users> {
    return await prisma.$transaction(async (tx) => {
      // Step 1: Create base user
      const user = await tx.users.create({
        data: {
          email: data.email,
          name: data.name,
          phone_no: data.phone_no,
        },
      });

      // Step 2: Create local credentials
      await tx.credentials.create({
        data: {
          user_id: user.user_id,
          provider: "local",
          hashedPassword: data.passwordHash,
        },
      });

      // Step 3: Assign roles (many-to-many)
      if (data.roleIds.length > 0) {
        await tx.users_roles.createMany({
          data: data.roleIds.map((roleId) => ({
            user_id: user.user_id,
            role_id: roleId,
          })),
        });
      }

      return user;
    });
  }

  async getUserByEmail(email: string): Promise<users | null> {
    return prisma.users.findUnique({
      where: { email },
    });
  }

  async getUserByPhone(phone_no: string ): Promise<users | null> {
    return prisma.users.findUnique({
      where: { phone_no },
    });
  }
    async getUserWithPasswordAndRole(email: string): Promise<UserWithCredentialsAndRolesDTO | null> {
    return prisma.users.findUnique({
        where: { email },
        include: {
        credentials: true,
        roles: {
            include: { role: true }, // includes role_id, role_name
        },
        },
    });
    }
}