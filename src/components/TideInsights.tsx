import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Clock, Waves } from 'lucide-react';
import dayjs from 'dayjs';
import type { TideData } from '../types';

interface TideInsightsProps {
  tideData: TideData;
}

const TideInsights: React.FC<TideInsightsProps> = ({ tideData }) => {
  // Calculate comprehensive tide statistics
  const heights = tideData.heights.map(h => h.height);
  const maxHeight = Math.max(...heights);
  const minHeight = Math.min(...heights);
  const avgHeight = heights.reduce((sum, h) => sum + h, 0) / heights.length;
  const tideRange = maxHeight - minHeight;

  // Analyze tide frequency and patterns
  const highTides = tideData.extremes.filter(e => e.type === 'High');
  const lowTides = tideData.extremes.filter(e => e.type === 'Low');
  
  // Calculate average time between tides
  const tideIntervals = [];
  for (let i = 1; i < tideData.extremes.length; i++) {
    const interval = tideData.extremes[i].dt - tideData.extremes[i - 1].dt;
    tideIntervals.push(interval / 3600); // Convert to hours
  }
  const avgInterval = tideIntervals.reduce((sum, interval) => sum + interval, 0) / tideIntervals.length;

  // Determine tide type
  const getTideType = () => {
    if (avgInterval > 11 && avgInterval < 13) return 'Semi-diurnal (2 highs, 2 lows per day)';
    if (avgInterval > 23 && avgInterval < 25) return 'Diurnal (1 high, 1 low per day)';
    return 'Mixed (irregular pattern)';
  };

  // Calculate moon phase influence (simplified)
  const getMoonPhaseInfluence = () => {
    if (tideRange > 3) return { phase: 'Spring Tides', influence: 'High', description: 'New/Full moon amplifies tides' };
    if (tideRange < 1.5) return { phase: 'Neap Tides', influence: 'Low', description: 'Quarter moon reduces tidal range' };
    return { phase: 'Moderate Tides', influence: 'Medium', description: 'Transitional lunar influence' };
  };

  const moonInfluence = getMoonPhaseInfluence();

  // Best activity recommendations based on data
  const getOptimalTimes = () => {
    const now = dayjs();
    const upcomingExtremes = tideData.extremes
      .filter(e => dayjs.unix(e.dt).isAfter(now))
      .slice(0, 4);

    return {
      surfing: upcomingExtremes.find(e => e.type === 'High' && e.height > avgHeight),
      fishing: upcomingExtremes.find(e => e.type === 'High'),
      beachcombing: upcomingExtremes.find(e => e.type === 'Low'),
      photography: upcomingExtremes.find(e => e.type === 'Low' && Math.abs(e.height) < 0.5)
    };
  };

  const optimalTimes = getOptimalTimes();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">Advanced Tide Analytics</h3>
      </div>

      {/* Statistical Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-blue-900">Tidal Characteristics</h4>
            <Waves className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Type:</span>
              <span className="font-medium text-blue-900">{getTideType().split(' ')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Avg Interval:</span>
              <span className="font-medium text-blue-900">{avgInterval.toFixed(1)}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Range Category:</span>
              <span className="font-medium text-blue-900">
                {tideRange > 3 ? 'Macro' : tideRange > 1.5 ? 'Meso' : 'Micro'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-purple-900">Lunar Influence</h4>
            <div className="text-lg">🌙</div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-purple-700">Phase:</span>
              <span className="font-medium text-purple-900">{moonInfluence.phase.split(' ')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Influence:</span>
              <span className={`font-medium ${
                moonInfluence.influence === 'High' ? 'text-red-600' :
                moonInfluence.influence === 'Medium' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {moonInfluence.influence}
              </span>
            </div>
            <p className="text-xs text-purple-600 mt-2">{moonInfluence.description}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-green-900">Activity Score</h4>
            <div className="text-lg">⭐</div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">Fishing:</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < (tideRange > 2 ? 5 : tideRange > 1 ? 3 : 2) ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Surfing:</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < (maxHeight > 2 ? 5 : maxHeight > 1 ? 3 : 2) ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Exploration:</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < (Math.abs(minHeight) < 0.5 ? 5 : Math.abs(minHeight) < 1 ? 3 : 2) ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimal Activity Times */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span>Optimal Activity Windows (Next 48 Hours)</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { activity: 'Surfing', icon: '🏄‍♂️', time: optimalTimes.surfing, color: 'blue' },
            { activity: 'Fishing', icon: '🎣', time: optimalTimes.fishing, color: 'green' },
            { activity: 'Beach Combing', icon: '🐚', time: optimalTimes.beachcombing, color: 'yellow' },
            { activity: 'Photography', icon: '📸', time: optimalTimes.photography, color: 'purple' }
          ].map((item, index) => (
            <div key={index} className={`bg-${item.color}-50 border border-${item.color}-200 rounded-lg p-3`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{item.icon}</span>
                <span className={`font-medium text-${item.color}-900 text-sm`}>{item.activity}</span>
              </div>
              {item.time ? (
                <div className={`text-xs text-${item.color}-700`}>
                  <div className="font-medium">{dayjs.unix(item.time.dt).format('MMM D, h:mm A')}</div>
                  <div className="opacity-75">{item.time.type} tide • {item.time.height.toFixed(1)}m</div>
                </div>
              ) : (
                <div className="text-xs text-gray-500">No optimal window found</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Professional Insights */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4" />
          <span>Professional Analysis</span>
        </h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• <strong>Tidal Pattern:</strong> {getTideType()}</p>
          <p>• <strong>Current Conditions:</strong> {moonInfluence.phase} with {moonInfluence.influence.toLowerCase()} lunar influence</p>
          <p>• <strong>Safety Note:</strong> {tideRange > 3 ? 'Large tidal range - exercise caution during tide changes' : 'Moderate conditions suitable for most activities'}</p>
          <p>• <strong>Best Overall Time:</strong> 2 hours before to 1 hour after high tide for most water activities</p>
        </div>
      </div>
    </div>
  );
};

export default TideInsights;