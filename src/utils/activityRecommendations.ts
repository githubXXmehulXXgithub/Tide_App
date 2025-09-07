import dayjs from 'dayjs';
import type { TidePoint, ActivityRecommendation } from '../types';

export const generateActivityRecommendations = (extremes: TidePoint[]): ActivityRecommendation[] => {
  const upcomingTides = extremes
    .filter(tide => dayjs.unix(tide.dt).isAfter(dayjs()))
    .slice(0, 4);

  const recommendations: ActivityRecommendation[] = [];

  upcomingTides.forEach((tide, index) => {
    const tideTime = dayjs.unix(tide.dt);
    const timeStr = tideTime.format('h:mm A');
    
    if (tide.type === 'High') {
      // High tide recommendations
      recommendations.push({
        activity: 'Deep Water Fishing',
        icon: '🎣',
        recommendation: `Excellent for deep water fishing as fish move closer to shore`,
        bestTime: `${timeStr} (High Tide)`,
        confidence: 'high'
      });

      recommendations.push({
        activity: 'Surfing',
        icon: '🏄‍♂️',
        recommendation: `Great wave conditions for surfing and bodyboarding`,
        bestTime: `1-2 hours before ${timeStr}`,
        confidence: 'high'
      });

      if (tide.height > 2) {
        recommendations.push({
          activity: 'Kayaking',
          icon: '🛶',
          recommendation: `Perfect water levels for kayaking in shallow areas`,
          bestTime: `Around ${timeStr}`,
          confidence: 'medium'
        });
      }
    } else {
      // Low tide recommendations
      recommendations.push({
        activity: 'Beach Combing',
        icon: '🐚',
        recommendation: `Perfect for finding shells, sea glass, and exploring tide pools`,
        bestTime: `${timeStr} (Low Tide)`,
        confidence: 'high'
      });

      recommendations.push({
        activity: 'Shore Fishing',
        icon: '🎣',
        recommendation: `Ideal for fishing from rocks and piers as fish feed in shallow water`,
        bestTime: `2 hours before to 1 hour after ${timeStr}`,
        confidence: 'high'
      });

      if (Math.abs(tide.height) < 0.5) {
        recommendations.push({
          activity: 'Tide Pool Exploring',
          icon: '🦀',
          recommendation: `Exceptional conditions for discovering marine life in exposed tide pools`,
          bestTime: `${timeStr} onwards for 2 hours`,
          confidence: 'high'
        });
      }
    }
  });

  // Remove duplicates and limit to 6 recommendations
  const uniqueRecommendations = recommendations.reduce((acc, current) => {
    const existing = acc.find(item => item.activity === current.activity);
    if (!existing) {
      acc.push(current);
    }
    return acc;
  }, [] as ActivityRecommendation[]);

  return uniqueRecommendations.slice(0, 6);
};