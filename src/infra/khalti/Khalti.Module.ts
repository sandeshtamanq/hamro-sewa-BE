import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { KhaltiService } from './Khalti.Service';

@Module({
  imports: [HttpModule],
  providers: [KhaltiService],
  exports: [KhaltiService],
})
export class KhaltiModule {}
