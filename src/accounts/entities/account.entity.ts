import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('accounts')
export class AccountEntity {
    @PrimaryGeneratedColumn({type: 'int', name: 'id'})
    id?:number

    @Column({type: 'varchar', length: 255, name: 'name'})
    name: string

    @Column({type: 'varchar', length: 255, name: 'password'})
    password: string
}