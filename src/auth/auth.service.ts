import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/entity/user.entity';
import { AuthModel } from './dto/auth.model';
import { ChangePasswordModel } from './dto/changepassword.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private saltRounds = 10;

  constructor(@InjectRepository(Users, 'support_v2') private userRepos: Repository<Users>, private jwtService: JwtService) {}
  async initUser() {
    const isExist = await this.userRepos.exist({
      where: { username: 'superadmin' },
    });
    if (isExist) {
      return { message: 'Already initial' };
    }
    const user = new Users();
    const password = Math.random().toString(36).slice(-8).toString();
    user.username = 'superadmin';
    user.password = await bcrypt.hash(password, this.saltRounds);
    await this.userRepos.save(user);
    return { message: 'initial', data: { username: 'superadmin', password: password } };
  }

  async signIn(model: AuthModel) {
    const user = await this.userRepos.findOne({ where: { username: model.username } });
    const match = await bcrypt.compare(model.password, user.password);
    if (!match) {
      throw new UnauthorizedException({ message: 'Username or Password Incorrect' });
    }
    const payload = { username: user.username, sub: user.id, isAdmin: user.isAdmin };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.AUTH_SECRET,
      }),
      username: user.username,
    };
  }

  async changePassword(username: string, model: ChangePasswordModel) {
    if (model.new_password.trim() != model.retype_new_password.trim()) {
      throw new BadRequestException({ message: 'Password and confirm password does not match. ' });
    }
    const user = await this.userRepos.findOne({ where: { username } });
    user.password = await bcrypt.hash(model.new_password.trim(), this.saltRounds);
    await this.userRepos.save(user);
    return { message: 'Password changed.' };
  }
}
