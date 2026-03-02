import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { FranchiseModule } from './franchise/franchise.module';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [DatabaseModule, AuthModule, FranchiseModule, CollaboratorModule, HealthModule],
})
export class AppModule {}
