import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { EUserRoles } from '../domain/users.domain';
import { RolesGuard } from '../guards/users/role.guard';
import { JwtGuard } from '../guards/auth/jwt.guard';

export const Roles = (roles: EUserRoles[]) => {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtGuard, RolesGuard));
};
