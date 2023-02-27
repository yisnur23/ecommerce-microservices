import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAddress } from '../address/address.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  username: string;

  @OneToMany(() => UserAddress, (userAddress) => userAddress.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  addresses: UserAddress[];
}
