import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'url_key' })
  url_key: string;

  @Column({ type: 'text', name: 'content' })
  content: string;

  @Column({ type: 'int', name: 'user_id' })
  user_id: number;

  @Column({ type: 'bigint', name: 'timestamp' })
  timestamp: number;

  @Column({ type: 'int', name: 'account_id' })
  account_id: number;
}
