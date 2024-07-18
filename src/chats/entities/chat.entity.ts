import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chats')
export class ChatEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'url_key' })
  url_key: string;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ type: 'int', name: 'account_id' })
  account_id: number;
}
