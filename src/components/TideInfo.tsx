import React, { useState, useEffect } from 'react';
import { Waves, TrendingUp, TrendingDown, Clock, RefreshCw } from 'lucide-react';
import { formatTideTime, getTimeUntilTide, getCurrentTime, isUpcomingTide } from '../utils/timeUtils';
import type { TideData } from '../types';

interface TideInfoProps {
  tideData: TideData;
  loading: boolean;
  onRefresh: () => void;
}

const TideInfo: React.FC<TideInfoProps> = ({ tideData, loading, onRefresh }) => {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const upcomingTides = tideData.extremes
    .filter(tide => isUpcomingTide(tide.dt))
    .slice(0, 6);

  const nextHighTide = upcomingTides.find(tide => tide.type === 'High');
  const nextLowTide = upcomingTides.find(tide => tide.type === 'Low');

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Waves className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Tide Information</h2>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-1 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2 text-blue-100">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{currentTime}</span>
        </div>
        
        <p className="text-blue-100 mt-2">
          📍 {tideData.station.name}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Next High Tide */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="text-blue-600 w-5 h-5" />
              <h3 className="font-semibold text-blue-900">Next High Tide</h3>
            </div>
            {nextHighTide ? (
              <div>
                <div className="text-2xl font-bold text-blue-900 mb-1">
                  {formatTideTime(nextHighTide.dt)}
                </div>
                <div className="text-blue-700 mb-2">
                  Height: {nextHighTide.height.toFixed(2)}m
                </div>
                <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                  In {getTimeUntilTide(nextHighTide.dt)}
                </div>
              </div>
            ) : (
              <div className="text-blue-600">No upcoming high tide in the next 7 days</div>
            )}
          </div>

          {/* Next Low Tide */}
          <div className="bg-teal-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingDown className="text-teal-600 w-5 h-5" />
              <h3 className="font-semibold text-teal-900">Next Low Tide</h3>
            </div>
            {nextLowTide ? (
              <div>
                <div className="text-2xl font-bold text-teal-900 mb-1">
                  {formatTideTime(nextLowTide.dt)}
                </div>
                <div className="text-teal-700 mb-2">
                  Height: {nextLowTide.height.toFixed(2)}m
                </div>
                <div className="text-sm text-teal-600 bg-teal-100 px-3 py-1 rounded-full inline-block">
                  In {getTimeUntilTide(nextLowTide.dt)}
                </div>
              </div>
            ) : (
              <div className="text-teal-600">No upcoming low tide in the next 7 days</div>
            )}
          </div>
        </div>

        {/* Upcoming Tides Timeline */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Upcoming Tides</h3>
          <div className="space-y-3">
            {upcomingTides.map((tide, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  tide.type === 'High' 
                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                    : 'bg-teal-50 border-l-4 border-teal-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {tide.type === 'High' ? (
                    <TrendingUp className="text-blue-600 w-5 h-5" />
                  ) : (
                    <TrendingDown className="text-teal-600 w-5 h-5" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {tide.type} Tide
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTideTime(tide.dt)} • {tide.height.toFixed(2)}m
                    </div>
                  </div>
                </div>
                <div className={`text-sm px-3 py-1 rounded-full ${
                  tide.type === 'High'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-teal-100 text-teal-700'
                }`}>
                  {getTimeUntilTide(tide.dt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TideInfo;