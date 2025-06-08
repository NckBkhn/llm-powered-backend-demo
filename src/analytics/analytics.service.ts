import { Injectable } from '@nestjs/common';
import { AssetService } from "../assets/assets.service";

export type ReduceFunction = 'min' | 'max' | 'sum' | 'avg' | 'count';

@Injectable()
export class AnalyticsService {
  constructor(private readonly assetService: AssetService) {}

  async getChannelStats(
    assetId: string,
    channelKey: string,
    reduceFn: ReduceFunction,
    timeRange?: { start: number; end: number }
  ): Promise<{ value: number | null; unit: string }> {
    const asset = await this.assetService.findById(assetId);
    const channel = asset.dataChannels.find(c => c.key === channelKey);

    if (!channel) {
      return { value: null, unit: '' };
    }

    let points = channel.dataPoints;
    points = this.applyDateRangeFilter(timeRange, points);

    return {
      value: this.reduceData(points, reduceFn),
      unit: channel.unit
    };
  }

  private reduceData(points: { t: number; v: number }[], reduceFn: "min" | "max" | "sum" | "avg" | "count") {
    if (points.length === 0) {
      return null;
    }
    const values = points.map(p => p.v);
    let result: number | null = null;

    switch (reduceFn) {
      case 'min':
        result = Math.min(...values);
        break;
      case 'max':
        result = Math.max(...values);
        break;
      case 'sum':
        result = values.reduce((a, b) => a + b, 0);
        break;
      case 'avg':
        result = values.reduce((a, b) => a + b, 0) / values.length;
        break;
      case 'count':
        result = values.length;
        break;
    }
    return result;
  }

  private applyDateRangeFilter(timeRange: { start: number; end: number } | undefined, points: { t: number; v: number }[]) {
    if (timeRange) {
      points = points.filter(p =>
        p.t >= timeRange.start && p.t <= timeRange.end
      );
    }
    return points;
  }

  async compareChannels(
    assetIds: string[],
    channelKey: string,
    reduceFn: ReduceFunction,
    timeRange?: { start: number; end: number }
  ): Promise<Record<string, number | null>> {
    const results: Record<string, number | null> = {};

    for (const assetId of assetIds) {
      const { value } = await this.getChannelStats(
        assetId, channelKey, reduceFn, timeRange
      );
      results[channelKey] = value;
    }

    return results;
  }
}
