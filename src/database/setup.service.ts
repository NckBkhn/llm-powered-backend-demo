import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asset, AssetDocument } from "../assets/schemas/asset.schema";
import { AssetType } from "../assets/asser-type.enum";

@Injectable()
export class DatabaseSetupService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSetupService.name);
  private isInitialized = false;

  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>
  ) {}

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      const assetsExist = await this.checkIfDataExists();

      if (!assetsExist) {
        await this.createIndexes();
        await this.seedInitialData();
        this.logger.log('Database initialized successfully');
      } else {
        this.logger.log('Database already contains data. Skipping initialization.');
      }

      this.isInitialized = true;
    } catch (error) {
      this.logger.error(`Database initialization failed: ${error.message}`);
    }
  }

  private async checkIfDataExists(): Promise<boolean> {
    try {
      const count = await this.assetModel.countDocuments();
      return count > 0;
    } catch (error) {
      this.logger.error('Data check failed. Assuming database is empty.');
      return false;
    }
  }

  private async createIndexes(): Promise<void> {
    try {
      await this.assetModel.collection.createIndex({ 'dataChannels.key': 1 });
      await this.assetModel.collection.createIndex({ serial: 1 }, { unique: true });
      this.logger.log('Database indexes created');
    } catch (error) {
      this.logger.warn('Index creation skipped (might already exist)');
    }
  }

  private async seedInitialData(): Promise<void> {
    try {
      const initialAssets = this.getInitialSeedData();
      await this.assetModel.insertMany(initialAssets);
      this.logger.log(`🌱 Seeded ${initialAssets.length} initial assets`);
    } catch (error) {
      this.logger.error('Seed data insertion failed');
    }
  }

  private getInitialSeedData(): Partial<Asset>[] {
    return [
      {
        name: 'Main Solar Array',
        assetType: AssetType.SOLAR_PANEL,
        serial: 'SP-2023-001',
        dataChannels: [
          {
            key: 'energy_output',
            name: 'Energy Output',
            unit: 'kWh',
            dataPoints: []
          }
        ]
      },
      {
        name: 'Grid Transformer',
        assetType: AssetType.TRANSFORMER,
        serial: 'TR-2023-001',
        dataChannels: [
          {
            key: 'temperature',
            name: 'Temperature',
            unit: '°C',
            dataPoints: []
          }
        ]
      }
    ];
  }
}
