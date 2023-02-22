import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MemberDto } from './dto/member.dto';

@Injectable()
export class MemberService {
  constructor(private readonly httpService: HttpService) {}

  async getMemberByDisplayName(displayName: string): Promise<MemberDto> {
    const res = await lastValueFrom(this.httpService.get<MemberDto>(`/api/Member/ByDisplayname/${displayName}`));
    return res.data;
  }
}
