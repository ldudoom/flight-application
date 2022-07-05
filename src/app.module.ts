import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './auth/user/user.module';
import { PassengerModule } from './manage/passenger/passenger.module';
import { FlightModule } from './manage/flight/flight.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true 
    }), 
    MongooseModule.forRoot(process.env.URI_MONGODB), 
    UserModule, PassengerModule, FlightModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
