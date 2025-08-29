import { CreateUserDTO } from "../dto/user.dto";
import { UserRepository } from "../repository/user.repository";
import { RegisterUserInput } from "../validations/registerUser.validation";
import { PasswordUtil } from "../utils/password.util";
import { prisma } from "../prisma/client";
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/errors/app.error";
import { LoginUserInput } from "../validations/registerUser.validation";
import { TokenUtil } from "../utils/jwtToken.util";
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
  if (data.role_id === 2 || data.role_id === 3) {
    roleIds.push(data.role_id); // Host/Gym Owner
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

export const loginUserService = async (data:LoginUserInput) =>{
    const user = await userRepository.getUserWithPasswordAndRole(data.email);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const hashPassword = user.credentials[0].hashedPassword;

    if(hashPassword && !PasswordUtil.comparePassword(data.password, hashPassword)){
        throw new UnauthorizedError("Invalid password");
    }

    const payload = {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        roles: user.roles.map(r => Number(r.role.role_id)) // array of role IDs
    };

    const token = TokenUtil.generateToken(payload);
    return { 
        token,
        user: {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            roles: user.roles.map(r => r.role.role_name)
        }
     };
};
