import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id?: number;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ type: 'varchar', length: 255, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password' })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'register_token',
    nullable: true,
  })
  readonly register_token: string | null;

  @Column({
    type: 'varchar',
    length: 6,
    name: 'activation_code',
    nullable: true,
  })
  readonly activation_code: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'rp_token',
    nullable: true,
  })
  readonly rp_token: string | null;

  @Column({
    type: 'int',
    name: 'is_blocked',
  })
  readonly is_blocked: number;
}
