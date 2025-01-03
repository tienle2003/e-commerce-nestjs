import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddressesService } from '../addresses/addresses.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserParams } from 'src/common/decorators/user.decorator';
import { User } from './entities/user.entity';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly addressesService: AddressesService,
  ) {}
  @Get(':userId/addresses')
  getAllAddress(@Param('userId', ParseIntPipe) userId: number) {
    return this.addressesService.findAllByUserId(userId);
  }

  @Put('change-password')
  @ResponseMessage('Update password successfully')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @UserParams() user,
  ) {
    await this.usersService.updatePassword(user.id, updatePasswordDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch()
  update(@UserParams() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(user.id, updateUserDto);
  }
}
