import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asset, AssetDocument } from './schemas/asset.schema';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AddDataChannelDto } from './dto/add-data-channel.dto';
import { AddDataPointsDto } from './dto/add-data-points.dto';

@Injectable()
export class AssetService {
  constructor(@InjectModel(Asset.name) private assetModel: Model<AssetDocument>) {}

  async create(createDto: CreateAssetDto): Promise<AssetDocument | null> {
    return this.assetModel.create(createDto);
  }

  async findAll(): Promise<AssetDocument[] | null> {
    return this.assetModel.find().exec();
  }

  async findById(id: string): Promise<AssetDocument> {
    const asset = await this.assetModel.findById(id).exec();
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async addDataChannel(addDto: AddDataChannelDto): Promise<AssetDocument | null> {
    const asset = await this.findById(addDto.assetId);

    // Check channel limit
    if (asset.dataChannels.length >= 4) {
      throw new BadRequestException('Maximum 4 channels per asset');
    }

    // Check for duplicate channel name
    if (asset.dataChannels.some(ch => ch.name === addDto.name)) {
      throw new BadRequestException('Channel name already exists');
    }

    // Add new channel
    return this.assetModel.findByIdAndUpdate(
      addDto.assetId,
      {
        $push: {
          dataChannels: {
            name: addDto.name,
            key: addDto.key,
            description: addDto.description,
            unit: addDto.unit,
            dataPoints: addDto.dataPoints
          }
        }
      },
      { new: true }
    );
  }

  async addDataPoints(addDto: AddDataPointsDto): Promise<AssetDocument | null> {
    const asset = await this.findById(addDto.assetId);
    const channel = asset.dataChannels.find(ch => ch.name === addDto.channelName);

    if (!channel) throw new NotFoundException('Channel not found');

    // Check data point limit
    const newCount = channel.dataPoints.length + addDto.dataPoints.length;
    if (newCount > 60) {
      throw new BadRequestException('Maximum 60 data points per channel');
    }

    // Add new data points
    return this.assetModel.findOneAndUpdate(
      {
        _id: addDto.assetId,
        'dataChannels.name': addDto.channelName
      },
      {
        $push: {
          'dataChannels.$.dataPoints': {
            $each: addDto.dataPoints
          }
        }
      },
      { new: true }
    );
  }

  async getChannelDataPoints(
    assetId: string,
    channelName: string
  ): Promise<{ t: number; v: number }[]> {
    const asset = await this.findById(assetId);
    const channel = asset.dataChannels.find(ch => ch.name === channelName);
    return channel?.dataPoints || [];
  }

  async getChannelStats(
    assetId: string,
    channelName: string
  ): Promise<{ min: number; max: number; avg: number; count: number }> {
    const dataPoints = await this.getChannelDataPoints(assetId, channelName);

    if (dataPoints.length === 0) {
      return { min: 0, max: 0, avg: 0, count: 0 };
    }

    const values = dataPoints.map(dp => dp.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;

    return { min, max, avg, count: values.length };
  }
}
