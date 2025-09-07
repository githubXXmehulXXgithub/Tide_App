import React from 'react';
import { Star, Clock, TrendingUp } from 'lucide-react';
import { generateActivityRecommendations } from '../utils/activityRecommendations';
import type { TideData } from '../types';

interface ActivityRecommendationsProps {
  tideData: TideData;
}

const ActivityRecommendations: React.FC<ActivityRecommendationsProps> = ({ tideData }) => {
  const recommendations = generateActivityRecommendations(tideData.extremes);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <Star className="w-4 h-4 fill-current" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">🌊 Activity Recommendations</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500">No recommendations available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <div className="text-2xl">🌊</div>
        <h3 className="text-xl font-semibold text-gray-900">Smart Activity Recommendations</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-white"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{rec.icon}</span>
                <h4 className="font-semibold text-gray-900 text-sm">{rec.activity}</h4>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getConfidenceColor(rec.confidence)}`}>
                {getConfidenceIcon(rec.confidence)}
                <span className="capitalize">{rec.confidence}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
              {rec.recommendation}
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <div className="flex items-center space-x-1 text-blue-700">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-medium">Best Time:</span>
              </div>
              <p className="text-xs text-blue-800 mt-1">{rec.bestTime}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="text-amber-600 mt-0.5">⚠️</div>
          <div>
            <p className="text-sm font-medium text-amber-800 mb-1">Safety First</p>
            <p className="text-xs text-amber-700">
              Always check local weather conditions, follow safety guidelines, and inform others of your plans. 
              Tide conditions can change rapidly - use this as a guide but exercise personal judgment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityRecommendations;