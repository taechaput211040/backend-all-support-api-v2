import { HttpService } from '@nestjs/axios';
import { Injectable, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { MemberService } from 'src/member/member.service';
import { DataSource } from 'typeorm';

@Injectable()
export class SettingService {
  constructor(
    @InjectDataSource('all_setting')
    private dataSource: DataSource,
    private memberService: MemberService,
    private httpService: HttpService,
  ) {}

  async getTokenByDisplayName(displayName: string): Promise<string> {
    const member = await this.memberService.getMemberByDisplayName(displayName);
    const token = await this.dataSource.query(
      'select token from setting where lower(company) = lower($1) and lower(agent_username) = lower($2) limit 1;',
      [member.companyKey, member.agentKey],
    );
    if (token.length > 0) {
      return token[0].token;
    }
    return null;
  }

  async getWebsiteList(search = undefined, systemStatus: boolean, withdrawStatus: boolean, page = 1, limit = 20): Promise<any> {
    const params: Array<any> = [page, limit];
    let condition = ``;
    if (search) {
      condition += ` where member_site_name like '%${search}%' `;
    }
    if (systemStatus) {
      if (condition == '') {
        condition += ' where ';
      } else {
        condition += 'and ';
      }
      condition += ` system_status = ${systemStatus} `;
    }
    if (withdrawStatus) {
      if (condition == '') {
        condition += ' where ';
      } else {
        condition += 'and ';
      }
      condition += ` wd_status = ${withdrawStatus} `;
    }
    const query =
      `select id,
                                        replace(member_site_name, 'member.', '') as site_name,
                                        company,
                                        agent_username,
                                        system_status,
                                        wd_status,
                                        updated_at
                                    from setting` +
      condition +
      ` limit ${limit} offset ${page <= 1 ? 0 : (page - 1) * limit}`;
    const [{ count }] = await this.dataSource.query(`select count(*) from setting ` + condition);
    const data = await this.dataSource.query(query);
    return {
      data: data,
      total: Number(count),
      page: page,
      size: limit,
    };
  }

  async setLockdown(siteId: string, status: boolean): Promise<string> {
    const [{ company, agent }] = await this.dataSource.query(
      'select company, agent_username as agent from setting where id =  $1 limit 1;',
      [siteId],
    );
    const res = await lastValueFrom(this.httpService.post('/api/Lockdowns/', { company, agent, status }));
    return res.statusText;
  }

  async setSystemStatus(siteId: string, status: boolean): Promise<any> {
    const [{ company, agent, system_status }] = await this.dataSource.query(
      'update setting set system_status = $1 where id =  $2 returning  company, agent_username as agent, system_status',
      [status, siteId],
    );
    return { company, agent, system_status };
  }
  async setWithdrawStatus(siteId: string, status: boolean): Promise<any> {
    const [{ company, agent, wd_status }] = await this.dataSource.query(
      'update setting set wd_status = $1 where id =  $2 returning  company, agent_username as agent, wd_status',
      [status, siteId],
    );
    return { company, agent, wd_status };
  }
}
