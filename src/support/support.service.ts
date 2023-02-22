import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { SettingService } from 'src/setting/setting.service';

@Injectable()
export class SupportService {
  constructor(private settingService: SettingService, private readonly httpService: HttpService) {}

  async getToken(username: string) {
    return await this.settingService.getTokenByDisplayName(username);
  }

  async getCreditHistory(username: string, page: number, limit: number) {
    console.log(`${process.env.SMART_URL}/v1alpha/permanant/credit-tranfer-history/${username}`);
    const token = await this.getToken(username);
    const res = await lastValueFrom(
      this.httpService.get(`/v1alpha/permanant/credit-tranfer-history/${username}`, {
        params: { limit: limit, page: page },
        headers: { apikey: token },
      }),
    );
    return res.data;
  }
}
