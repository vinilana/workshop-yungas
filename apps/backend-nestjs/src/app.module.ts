import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { FranchiseModule } from './franchise/franchise.module';

@Module({
  imports: [DatabaseModule, AuthModule, FranchiseModule],
})
export class AppModule {}
