import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SettingService } from 'src/setting/setting.service';
import { SupportMemberDto } from './dto/support-member.dto';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private support: SupportService, private setting: SettingService) {}

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('credit-history/:username')
  async getCreditHistory(@Param('username') username: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return await this.support.getCreditHistory(username, page, limit);
  }

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'system_status', type: Boolean, required: false })
  @ApiQuery({ name: 'withdraw_status', type: Boolean, required: false })
  @Get('site/list')
  async getList(
    @Query('search') search: string,
    @Query('system_status') system_status: boolean = undefined,
    @Query('withdraw_status') withdraw_status: boolean = undefined,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return await this.setting.getWebsiteList(search, system_status, withdraw_status, page, limit);
  }
}
