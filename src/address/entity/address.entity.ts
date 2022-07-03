import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @OneToMany((type) => Transaction, (transactions) => transactions.address, {
    cascade: true,
  })
  @JoinTable()
  transactions: Transaction[];
}
