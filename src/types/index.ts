export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface TidePoint {
  dt: number;
  date: string;
  height: number;
  type: 'High' | 'Low';
}

export interface TideData {
  station: {
    name: string;
    lat: number;
    lon: number;
  };
  extremes: TidePoint[];
  heights: Array<{
    dt: number;
    date: string;
    height: number;
  }>;
}

export interface ActivityRecommendation {
  activity: string;
  icon: string;
  recommendation: string;
  bestTime: string;
  confidence: 'high' | 'medium' | 'low';
}