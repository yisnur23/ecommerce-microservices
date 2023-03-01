import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

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
