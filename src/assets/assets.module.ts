import { Module } from '@nestjs/common';
import { AssetController } from './assets.controller';
import { AssetService } from './assets.service';
import { Asset, AssetSchema } from "./schemas/asset.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Asset.name, schema: AssetSchema }
    ])
  ],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService]
})
export class AssetsModule {}
