import { CreateUserDTO } from "../dto/user.dto";
import { UserRepository } from "../repository/user.repository";
import { RegisterUserInput } from "../validations/registerUser.validation";
import { PasswordUtil } from "../utils/password.util";
import { prisma } from "../prisma/client";
import { ConflictError } from "../utils/errors/app.error";

const userRepository = new UserRepository();


export const registerUserService = async (data: RegisterUserInput) => {
  // 🔹 Step 1: Check if user already exists
  const existingUser = await userRepository.getUserByEmail(data.email);
  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  if (data.phone_no) {
    const existingPhone = await userRepository.getUserByPhone(data.phone_no);
    if (existingPhone) {
      throw new ConflictError("User with this phone number already exists");
    }
  }

  // 🔹 Step 2: Hash password
  const hashedPassword = await PasswordUtil.hashPassword(data.password);

  // 🔹 Step 3: Assign default roles
  const roleIds: number[] = [1]; // default role: Member
  if (data.role_id === 2) {
    roleIds.push(2); // Host/Gym Owner
  }

  // 🔹 Step 4: Create user + roles inside a transaction
  const user = await prisma.$transaction(async (tx) => {
    return userRepository.createUser(
      {
        email: data.email,
        name: data.name,
        phone_no: data.phone_no,
        passwordHash: hashedPassword,
        roleIds,
      }
    );
  });

  // 🔹 Step 5: Return sanitized response
  return {
    id: user.user_id,
    email: user.email,
    name: user.name,
    phone_no: user.phone_no
  };
};