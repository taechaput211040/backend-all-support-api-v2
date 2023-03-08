import { HttpService } from '@nestjs/axios';
import { Injectable, Inject, CACHE_MANAGER, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { MemberService } from 'src/member/member.service';
import { DataSource, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Lockdowns } from 'src/entity/lockdowns.entity';
import { UpdateLockdownDto } from './dto/update.lockdowns.dto';
import { Notify } from 'src/entity/notify.entity';
import { AxiosResponse } from 'axios';

@Injectable()
export class SettingService {
  constructor(
    @InjectDataSource('all_setting')
    private dataSource: DataSource,
    private memberService: MemberService,
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Lockdowns, 'support')
    private readonly lockdownsRepository: Repository<Lockdowns>,
  ) {}

  async getTokenByDisplayName(displayName: string): Promise<string> {
    const member = await this.memberService.getMemberByDisplayName(displayName);
    const cacheName = `prefix_${member.companyKey}${member.agentKey}`;
    const cache = this.cacheManager.get<string>(cacheName);
    if (cache != null) {
      return cache;
    }
    const data = await this.dataSource.query(
      'select token from setting where lower(company) = lower($1) and lower(agent_username) = lower($2) limit 1;',
      [member.companyKey, member.agentKey],
    );
    if (data.length > 0) {
      const token = data[0].token;
      await this.cacheManager.set(cacheName, token, {
        ttl: 1000 * 30,
      });
      return token;
    }
    return null;
  }

  async getWebsiteList(search = undefined, systemStatus: boolean, withdrawStatus: boolean, page = 1, limit = 20): Promise<any> {
    let condition = ``;
    if (search) {
      search = search.toLowerCase();
      condition += ` where lower(member_site_name) like '%${search}%' `;
      condition += ` or (lower(companyKey) = '${search}' or lower(company) = '${search}' or lower(agent_username) = '${search}')  `;
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
                                        companyKey,
                                        agent_username,
                                        system_status,
                                        hash,
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

  async setLockdownStatus(siteId: string, status: boolean, operator = 'api'): Promise<any> {
    const [{ company, agent }] = await this.dataSource.query(
      'select company, agent_username as agent from setting where id =  $1 limit 1;',
      [siteId],
    );
    let lockdown = await this.getLockdownsByCompany(agent, company);

    if (!lockdown) {
      throw new NotFoundException();
    }
    lockdown = await this.updateLockdowns(lockdown, {
      company,
      agent,
      status,
      operator: operator,
    });

    const cacheName = `_lockdowns_${company.toLowerCase()}_${agent.toLowerCase()}`;

    await this.cacheManager.del(cacheName);
    await this.cacheManager.set(cacheName, lockdown, { ttl: null });
    let signoutAllUser = false;
    let websocket = false;
    if (status == true) {
      const sendLockdownSignout = await this.deleteAllUserToken(company, agent);
      const sendLockdownToWebsocket = await this.webSocketAll(company, agent);
      signoutAllUser = sendLockdownSignout?.status == 200;
      websocket = sendLockdownToWebsocket?.status == 200;
    }
    return {
      cache: 'deleted',
      lockdown: lockdown.status,
      signoutAllUser,
      websocket,
    };
  }

  public async getLockdownsByCompany(agent: string, company: string): Promise<Lockdowns> {
    return await this.lockdownsRepository.findOne({ where: { agent: agent.toUpperCase(), company: company.toLowerCase() } });
  }
  public async updateLockdowns(lockdowns: Lockdowns, input: UpdateLockdownDto): Promise<Lockdowns> {
    console.log(lockdowns.operator);
    return await this.lockdownsRepository.save(
      new Notify({
        ...lockdowns,
        ...input,
      }),
    );
  }
  public async deleteAllUserToken(company: string, agent: string) {
    const url_all_user = `${process.env.ALL_RICO_USER}/api/Auth/Lockdown/logout/${company}/${agent}/public`;
    try {
      return await this.httpService
        .get(url_all_user, {
          headers: {
            apikey: 'ramidasky',
          },
        })
        .toPromise();
    } catch (error) {
      console.log('sent to user error :', error.response.data);
      return error.response;
    }
  }
  public async webSocketAll(company: string, agent: string): Promise<AxiosResponse> {
    const url_all_topup = `${process.env.ALL_TOPUP}/all_topup/LockdownSocket/${company}/${agent}`;
    try {
      return await this.httpService.get(url_all_topup).toPromise();
    } catch (error) {
      console.log('sent to all_topup :', error);
      return error.response;
    }
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
