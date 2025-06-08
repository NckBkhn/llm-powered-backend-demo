export type ReduceFunction = 'min' | 'max' | 'sum' | 'avg' | 'count';

export interface TimeRangeQuery {
  start: number; // Unix timestamp (seconds)
  end: number;   // Unix timestamp (seconds)
}

export interface AnalyticsResult {
  value: number | null;
  count: number;
  unit: string;
  reduceFn: ReduceFunction;
}

export interface DataPointQuery {
  dataModelId: string;
  reduceFn: ReduceFunction;
  timeRange?: TimeRangeQuery;
}

export interface MultiAssetQuery {
  assetIds: string[];
  dataModelKey: string;
  reduceFn: ReduceFunction;
  timeRange?: TimeRangeQuery;
}
