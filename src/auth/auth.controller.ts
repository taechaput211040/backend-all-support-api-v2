import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ChangePasswordModel } from './dto/changepassword.model';
import { AuthService } from './auth.service';
import { AuthModel } from './dto/auth.model';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Public } from './auth.public';
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('init')
  async InitUser() {
    return await this.authService.initUser();
  }

  @ApiBody({
    type: AuthModel,
  })
  @Public()
  @Post('SignIn')
  async signIn(@Body() model: AuthModel) {
    return await this.authService.signIn(model);
  }
  @ApiBody({
    type: ChangePasswordModel,
  })
  @Post('ChangePassword')
  async changePassword(@Request() req, @Body() model: ChangePasswordModel) {
    return await this.authService.changePassword(req.user.username, model);
  }
}
