import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column()
  price: number;

  @Column()
  item_count: number;

  @Column()
  user_id: string;
}
