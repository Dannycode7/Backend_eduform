import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService, // Injecter Supabase ici
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token manquant ou format invalide');
    }

    const token = authHeader.split(' ')[1];

    try {
      // 1. On demande à Supabase de valider le token
      // "getUser" décode et vérifie la signature JWT automatiquement
      const { data: { user: supabaseUser }, error } = await this.supabase.admin.auth.getUser(token);

      if (error || !supabaseUser) {
        throw new UnauthorizedException('Token invalide ou expiré');
      }

      // 2. On cherche l'utilisateur dans Prisma via son supabaseId (UUID)
      const user = await this.prisma.user.findUnique({
        where: { supabaseId: supabaseUser.id }
      });

      if (!user) {
        throw new ForbiddenException('Utilisateur non enregistré en base de données');
      }

      // 3. Injection de l'utilisateur complet dans la requête
      req['user'] = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Accès refusé');
    }
  }
}
