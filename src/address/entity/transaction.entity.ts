import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  blockNumber: string;

  @Column()
  timeStamp: string;

  @Column()
  hash: string;

  @Column()
  nonce: string;

  @Column()
  blockHash: string;

  @Column()
  transactionIndex: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  value: string;

  @Column()
  gas: string;

  @Column()
  gasPrice: string;

  @Column()
  isError: string;

  @Column()
  txreceipt_status: string;

  @Column()
  input: string;

  @Column()
  cumulativeGasUsed: string;

  @Column()
  gasUsed: string;

  @Column()
  confirmations: string;

  @Column()
  methodId: string;

  @Column()
  functionName: string;

  @ManyToOne((type) => Address, (address) => address.transactions)
  address: Address;
}
