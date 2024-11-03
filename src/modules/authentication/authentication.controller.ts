import {
     Controller,
     UseGuards,
     Req,
     Res,
     HttpCode,
     HttpStatus,
     Post,
     Body,
     Get,
     Query,
     UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiBody, ApiParam, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthenticationService, _User } from '@/modules/authentication/authentication.service';
import { Request, Response } from 'express';

import { SignInDto } from '@/modules/authentication/dtos/signin.dto';
import { SignUpDto } from '@/modules/authentication/dtos/signup.dto';

import { TokenInterceptor } from '@/shared/interceptors/token.interceptor';
import { ResponseInterceptor } from '@/shared/interceptors/response.interceptor';
import { GithubOauthGuard } from '@/shared/guards/github-auth.guard';
import { GoogleOauthGuard } from '@/shared/guards/google-auth.guard';

@ApiTags('Authentication')
@Controller('authentication')
@UseInterceptors(ResponseInterceptor)
export class AuthenticationController {
     constructor(private readonly authService: AuthenticationService) {}

     @Get('github')
     @UseGuards(GithubOauthGuard)
     @UseInterceptors(TokenInterceptor)
     @ApiOperation({ summary: 'redirect to Github OAuth' })
     @ApiResponse({ status: HttpStatus.FOUND, description: 'Redirecting to Github OAuth.' })
     async githubAuth() {}

     @Get('github/callback')
     @UseGuards(GithubOauthGuard)
     @UseInterceptors(TokenInterceptor)
     async githubAuthCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
          return req.user;
     }

     @Get('google')
     @UseGuards(GoogleOauthGuard)
     @UseInterceptors(TokenInterceptor)
     @ApiOperation({ summary: 'redirect to Google OAuth' })
     @ApiResponse({ status: HttpStatus.FOUND, description: 'Redirecting to Google OAuth.' })
     async googleAuth() {}

     @Get('google/callback')
     @UseGuards(GoogleOauthGuard)
     @UseInterceptors(TokenInterceptor)
     async googleAuthCallback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
          return req.user;
     }

     @Post('signup')
     @HttpCode(HttpStatus.CREATED)
     @UseInterceptors(TokenInterceptor)
     @ApiOperation({ summary: 'signup a new user' })
     @ApiResponse({
          status: HttpStatus.CREATED,
          description: 'The user has been successfully created.',
     })
     @ApiBody({ type: SignUpDto })
     signup(@Body() userDto: SignUpDto) {
          return this.authService.signup(userDto);
     }

     @Post('signin')
     @HttpCode(HttpStatus.OK)
     @UseInterceptors(TokenInterceptor)
     @ApiOperation({ summary: 'signin a user' })
     @ApiResponse({
          status: HttpStatus.OK,
          description: 'The user has been successfully logged in.',
     })
     @ApiBody({ type: SignInDto })
     async login(@Body() loginDto: SignInDto) {
          return await this.authService.signin(loginDto);
     }

     @Post('logout')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'logout a user' })
     @ApiResponse({
          status: HttpStatus.OK,
          description: 'The user has been successfully logged out.',
     })
     @ApiBody({ type: SignInDto })
     async logout(@Res({ passthrough: true }) response: Response) {
          response.clearCookie('token');
          return { message: 'Successfully logged out' };
     }

     @Post('forgot-password')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'forgot password' })
     @ApiResponse({
          status: HttpStatus.OK,
          description: 'The user has been successfully logged out.',
     })
     async forgotPassword(@Query('email') email: string) {
          return this.authService.forgotPassword(email);
     }

     @Post('reset-password')
     @HttpCode(HttpStatus.OK)
     @ApiOperation({ summary: 'reset password' })
     @ApiResponse({
          status: HttpStatus.OK,
          description: 'The user has been successfully logged out.',
     })
     async resetPassword(@Query('token') token: string, @Body('password') password: string) {
          return this.authService.resetPassword(token, password);
     }
}
