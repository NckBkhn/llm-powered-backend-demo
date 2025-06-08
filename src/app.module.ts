import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AssetsModule } from './assets/assets.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DatabaseSetupService } from './database/setup.service';
import { Asset, AssetSchema } from './assets/schemas/asset.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI', 'mongodb://ac-hbhldeg-shard-00-00.hgymcw0.mongodb.net:27017,ac-hbhldeg-shard-00-01.hgymcw0.mongodb.net:27017,ac-hbhldeg-shard-00-02.hgymcw0.mongodb.net:27017/?replicaSet=atlas-5lb7lg-shard-0" --ssl --authenticationDatabase admin --username nickbokhan --password cxYi40w81PdzHu52'),
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        w: 'majority',
        connectionFactory: (connection) => {
          connection.on('connected', () =>
            console.log('📦 MongoDB connected successfully'));
          connection.on('error', (error) =>
            console.error('MongoDB connection error:', error));
          return connection;
        }
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([
      { name: Asset.name, schema: AssetSchema }
    ]),
    AssetsModule,
    AnalyticsModule
  ],
  controllers: [AppController],
  providers: [DatabaseSetupService],
})
export class AppModule {}
