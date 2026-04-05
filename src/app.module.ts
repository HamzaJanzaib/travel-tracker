import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from "@nestjs/config";
@Module({
  imports: [UsersModule, PostsModule, ConfigModule.forRoot({
    isGlobal: true,
  }
  )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
