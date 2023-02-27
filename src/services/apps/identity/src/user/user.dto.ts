export enum UserRoles {
  Buyer = 'buyer',
  Seller = 'seller',
  Admin = 'admin',
}
export class UserDto {
  readonly email: string;
  readonly username: string;
}

export class UpdateUserDto {
  readonly username: string;
}
