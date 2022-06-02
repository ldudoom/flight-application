import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './auth/user/user.module';
import { PassengerModule } from './manage/passenger/passenger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true 
    }), 
    MongooseModule.forRoot(process.env.URI_MONGODB), 
    UserModule, PassengerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
