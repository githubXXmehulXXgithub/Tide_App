import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import type { Location, TideData } from '../types';

const API_KEY = '288dc9d6-a17a-4cac-8443-e181911de674';
const BASE_URL = 'https://www.worldtides.info/api/v3';

export const useTideData = (location: Location | null) => {
  const [tideData, setTideData] = useState<TideData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      fetchTideData(location);
    }
  }, [location]);

  const fetchTideData = async (loc: Location) => {
    setLoading(true);
    setError(null);

    try {
      const now = dayjs();
      const endTime = now.add(7, 'days');
      
      // Fetch extremes (high/low tides)
      const extremesUrl = `${BASE_URL}?extremes&lat=${loc.latitude}&lon=${loc.longitude}&start=${now.unix()}&length=${endTime.diff(now, 'seconds')}&key=${API_KEY}&format=json`;
      
      // Fetch heights for chart
      const heightsUrl = `${BASE_URL}?heights&lat=${loc.latitude}&lon=${loc.longitude}&start=${now.unix()}&length=${endTime.diff(now, 'seconds')}&step=1800&key=${API_KEY}&format=json`;

      const [extremesResponse, heightsResponse] = await Promise.all([
        fetch(extremesUrl),
        fetch(heightsUrl)
      ]);

      if (!extremesResponse.ok || !heightsResponse.ok) {
        throw new Error('Failed to fetch tide data');
      }

      const [extremesData, heightsData] = await Promise.all([
        extremesResponse.json(),
        heightsResponse.json()
      ]);

      if (extremesData.error || heightsData.error) {
        throw new Error(extremesData.error || heightsData.error || 'API returned an error');
      }

      const processedData: TideData = {
        station: {
          name: extremesData.stationName || 'Nearest Coast',
          lat: extremesData.station?.lat || loc.latitude,
          lon: extremesData.station?.lon || loc.longitude
        },
        extremes: extremesData.extremes?.map((extreme: any) => ({
          dt: extreme.dt,
          date: extreme.date,
          height: extreme.height,
          type: extreme.type
        })) || [],
        heights: heightsData.heights?.map((height: any) => ({
          dt: height.dt,
          date: height.date,
          height: height.height
        })) || []
      };

      setTideData(processedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tide data';
      setError(errorMessage);
      console.error('Tide data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { tideData, loading, error, refetch: () => location && fetchTideData(location) };
};