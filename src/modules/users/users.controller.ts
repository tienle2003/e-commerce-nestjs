import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Put,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddressesService } from '../addresses/addresses.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserParams } from 'src/common/decorators/user.decorator';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly addressesService: AddressesService,
  ) {}
  @Get('addresses')
  getAllAddress(@UserParams() user: User) {
    return this.addressesService.findAllByUserId(user.id);
  }

  @Put('change-password')
  @ResponseMessage('Update password successfully')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @UserParams() user: User,
  ) {
    await this.usersService.updatePassword(user.id, updatePasswordDto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UserParams() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.usersService.uploadAvatar(user.id, file);
  }

  @Get('me')
  getCurrentUser(@UserParams() user: User) {
    return this.usersService.findOne(user.id);
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
