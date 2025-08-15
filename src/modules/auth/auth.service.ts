import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { LoginAuthDto } from './dto/login-auth.dto'
import { UserService } from '@/modules/user/user.service'
import type { User } from '@/modules/user/entities/user.entity'
import { encryptData } from '@/utils/crypto'
import { ApiErrorCode } from '@/common/enum'
import { ApiException } from '@/common/filters'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const { username, password } = loginAuthDto

    const user = await this.validateUser(username, password)
    if (!user) {
      throw new ApiException('密码错误', ApiErrorCode.USER_PASSWORD_INVALID)
    }

    const token = this.generateToken(user)
    return { ...user, ...token }
  }

  generateToken(user: User) {
    return {
      accessToken: this.jwtService.sign(user),
      refreshToken: this.jwtService.sign(user, { expiresIn: '8d' }),
    }
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByUserName(username)
    if (user && user.password === encryptData(password)) {
      delete user.password
      return user
    }
    return null
  }

  verifyToken(token: string): User {
    const info = this.jwtService.verify<User>(token, {
      secret: this.configService.get('JWT_SECRET'),
    })
    return info
  }

  async refreshToken(refreshToken: string) {
    const res = this.jwtService.verify<User>(refreshToken)

    if (res && res.username) {
      const user = await this.userService.findOneByUserName(res.username)
      return this.generateToken(user)
    }
    return null
  }
}
