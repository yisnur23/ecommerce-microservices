import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  street_address: string;
  @Column()
  city: string;
  @Column()
  state: string;
  @Column()
  country: string;
  @Column({
    nullable: true,
  })
  zip_code: string;
  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
