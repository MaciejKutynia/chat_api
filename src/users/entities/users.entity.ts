import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id?: number;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ type: 'int', name: 'account_id' })
  account_id: number;

  @Column({ type: 'varchar', name: 'url_key', length: 100 })
  url_key: string;
}
