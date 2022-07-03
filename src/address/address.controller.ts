import { Controller, Get, Param } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get('/:address/:block')
  async getAddressTransactions(
    @Param('address') address: string,
    @Param('block') block: number,
  ) {
    return await this.addressService.getAddressTransactions(address, block);
  }

  @Get('/:address')
  async getAddress(@Param('address') address: string) {
    return await this.addressService.getAddressInfo(address);
  }

  // @Get()
  // async getTestData() {
  //   return await this.addressService.getTestData();
  // }
}
