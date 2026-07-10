import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role';


@Injectable()
export class RoleGuard implements CanActivate {
  // On injecte le Reflector pour pouvoir lire le décorateur @Roles
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Récupérer les rôles requis définis sur la route
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), 
      context.getClass(),   
    ]);

    // Si aucun rôle n'est spécifié sur la route, l'accès est autorisé par défaut
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("Accès refusé. Aucun utilisateur authentifié trouvé.");
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Accès interdit. Rôle(s) requis : [${requiredRoles.join(', ')}]. Votre rôle actuel : '${user.role}'`
      );
    }

    return true;
  }
}
