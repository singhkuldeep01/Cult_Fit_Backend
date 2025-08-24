export interface CreateUserDTO {
  name: string;
  email: string;
  phone_no?: string;
  passwordHash: string;   // already hashed before repository call
  roleIds: number[];      // multiple roles
}
