// dto/user.dto.ts

// DTO for creating a new user
export interface CreateUserDTO {
  name: string;
  email: string;
  phone_no?: string;
  passwordHash: string;   // already hashed before repository call
  roleIds: number[];      // multiple roles
}

// Nested role info
export interface RoleInfoDTO {
  role_id: number;
  role_name: string;
}

// Role assigned to user
export interface RoleDTO {
  user_id: number;
  role_id: number;
  role: RoleInfoDTO;
}

// Credential assigned to user
export interface CredentialDTO {
  credential_id: number;
  user_id: number;
  provider: string;
  hashedPassword: string | null; // matches Prisma nullable field
  last_login?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Final DTO returned for user with credentials and roles
export interface UserWithCredentialsAndRolesDTO {
  user_id: number;
  email: string;
  name: string;
  phone_no?: string | null;
  createdAt: Date;
  updatedAt: Date;
  credentials: CredentialDTO[];
  roles: RoleDTO[];
}
