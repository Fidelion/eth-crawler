import { IsString } from 'class-validator';
import { Transaction } from '../entity/transaction.entity';

export class AddressDto {
  @IsString()
  address: string;

  transactions?: Transaction[];
}
