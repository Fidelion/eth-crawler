import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import axios from 'axios';
import { Repository } from 'typeorm';
import Web3 from 'web3';
import { AddressDto } from './dto/address.dto';
import { Address } from './entity/address.entity';
import { Transaction } from './entity/transaction.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
  ) {}

  async getAddressTransactions(address: string, block: number) {
    console.log('getAddressTransactions executing...');
    const account = await this.findOne(address);
    let transactions = [];
    let accountTxs = [];
    if (account) {
      for (let txs of account.transactions) {
        let blockNum = txs['blockNumber'];
        accountTxs.push(blockNum);
      }
    }
    const request = await axios.get(
      `${process.env.API_URL}/api?module=account&action=txlist&address=${address}&startblock=${block}&endblock=latest&page=1&sort=asc&${process.env.API_KEY}`,
    );
    const results = request.data.result;
    for (let data of results) {
      let accountTransactions = {
        blockNumber: data['blockNumber'],
        timeStamp: data['timeStamp'],
        hash: data['hash'],
        nonce: data['nonce'],
        blockHash: data['blockHash'],
        transactionIndex: data['transactionIndex'],
        from: data['from'],
        to: data['to'],
        value: data['value'],
        gas: data['gas'],
        gasPrice: data['gasPrice'],
        isError: data['isError'],
        txreceipt_status: data['txreceipt_status'],
        input: data['input'],
        cumulativeGasUsed: data['cumulativeGasUsed'],
        gasUsed: data['gasUsed'],
        confirmations: data['confirmations'],
        methodId: data['methodId'],
        functionName: data['functionName'],
      };
      if (accountTxs.includes(data['blockNumber'])) {
        const allMissingBlocks = await this.addTransaction(transactions);
        //O(n) not ideal
        account.transactions.unshift(...allMissingBlocks);
        this.addressRepo.save(account);
        return account;
      }
      transactions.push(accountTransactions);
    }
    let addressDto: AddressDto = {
      address,
      transactions,
    };
    this.addAddress(addressDto);
    return addressDto;
  }

  addAddress(addressDto: AddressDto) {
    const address = this.addressRepo.create(addressDto);
    return this.addressRepo.save(address);
  }

  addTransaction(transactionDto) {
    const transaction = this.txRepo.create(transactionDto);
    return this.txRepo.save(transaction);
  }

  async getAddressInfo(address: string) {
    return await this.findOne(address);
  }

  async findOne(addressId: string) {
    const address = await this.addressRepo.findOne({
      where: { address: addressId },
      relations: ['transactions'],
    });
    return address;
  }

  // async getAddressBalanceByDate() {
  //   const web3 = new Web3(
  //     new Web3.providers.HttpProvider(
  //       'https://mainnet.infura.io/v3/74766e6def444f2a968169d11b5a6783',
  //     ),
  //   );

  //   let blockNum = web3.eth.blockNumber;
  //   console.log(blockNum);
  //   let historicDate = `2022, 06, 27`;
  //   const historicTimestamp = new Date.now().getTime();
  //   while (true) {
  //     const block = web3.eth.getBlock(blockNum);
  //     if (block.timestamp < historicTimestamp) break;
  //     --blockNum;
  //   }

  //   web3.eth.getBalance(
  //     '0x98771321ad898ed7e2a367fc860aaf398e070807',
  //     block,
  //     function (err, result) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log(web3.utils.fromWei(result, 'ether') + ' ETH');
  // console.log(`Balance at block number is ${balance}`);
  //       }
  //     },
  //   );
  // }
}
