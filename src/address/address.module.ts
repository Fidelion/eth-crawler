import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import Web3 from 'web3';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entity/address.entity';
import { Transaction } from './entity/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Transaction])],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
