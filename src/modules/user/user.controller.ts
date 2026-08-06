import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
