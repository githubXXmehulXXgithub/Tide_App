import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import dayjs from 'dayjs';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import type { TideData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TideChartProps {
  tideData: TideData;
}

const TideChart: React.FC<TideChartProps> = ({ tideData }) => {
  // Calculate tide statistics for insights
  const heights = tideData.heights.map(h => h.height);
  const maxHeight = Math.max(...heights);
  const minHeight = Math.min(...heights);
  const avgHeight = heights.reduce((sum, h) => sum + h, 0) / heights.length;
  const tideRange = maxHeight - minHeight;

  // Identify extreme points for annotations
  const extremePoints = tideData.extremes.filter(extreme => {
    const extremeTime = dayjs.unix(extreme.dt);
    const chartStart = dayjs.unix(tideData.heights[0].dt);
    const chartEnd = dayjs.unix(tideData.heights[tideData.heights.length - 1].dt);
    return extremeTime.isAfter(chartStart) && extremeTime.isBefore(chartEnd);
  });

  // Create gradient background
  const createGradient = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0.05)');
    return gradient;
  };

  // Prepare chart data with professional styling
  const chartData = {
    labels: tideData.heights.map(height => 
      dayjs.unix(height.dt).format('MMM D, HH:mm')
    ),
    datasets: [
      {
        label: 'Tide Height',
        data: tideData.heights.map(height => height.height),
        borderColor: '#1e40af',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx } = chart;
          return createGradient(ctx);
        },
        fill: true,
        tension: 0.4,
        pointRadius: 1,
        pointHoverRadius: 8,
        pointBackgroundColor: '#1e40af',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointHoverBackgroundColor: '#dc2626',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
        borderWidth: 3,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `7-Day Tide Analysis • ${tideData.station.name}`,
        font: {
          size: 18,
          weight: '600' as const,
          family: 'Inter, system-ui, sans-serif'
        },
        color: '#1f2937',
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        cornerRadius: 12,
        displayColors: false,
        padding: 16,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: function(context: any) {
            return dayjs.unix(tideData.heights[context[0].dataIndex].dt).format('dddd, MMM D • h:mm A');
          },
          label: function(context: any) {
            const height = context.parsed.y;
            const heightFt = (height * 3.28084).toFixed(1);
            return `Height: ${height.toFixed(2)}m (${heightFt}ft)`;
          },
          afterLabel: function(context: any) {
            const currentHeight = context.parsed.y;
            if (currentHeight > avgHeight + (tideRange * 0.3)) {
              return '🌊 High tide conditions';
            } else if (currentHeight < avgHeight - (tideRange * 0.3)) {
              return '🏖️ Low tide conditions';
            }
            return '〰️ Mid-tide conditions';
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time (Local)',
          color: '#4b5563',
          font: {
            size: 14,
            weight: '600'
          },
          padding: { top: 15 }
        },
        ticks: {
          maxTicksLimit: 8,
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500'
          },
          padding: 8
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.15)',
          lineWidth: 1
        },
        border: {
          color: '#d1d5db',
          width: 2
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Height (meters above mean sea level)',
          color: '#4b5563',
          font: {
            size: 14,
            weight: '600'
          },
          padding: { bottom: 15 }
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500'
          },
          padding: 8,
          callback: function(value: any) {
            const heightFt = (value * 3.28084).toFixed(1);
            return `${value.toFixed(1)}m (${heightFt}ft)`;
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.15)',
          lineWidth: 1
        },
        border: {
          color: '#d1d5db',
          width: 2
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      {/* Header with key insights */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Professional Tide Analysis</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-1 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Max Height</span>
            </div>
            <div className="text-lg font-bold">{maxHeight.toFixed(2)}m</div>
            <div className="text-xs opacity-80">{(maxHeight * 3.28084).toFixed(1)}ft</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-1 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="font-medium">Min Height</span>
            </div>
            <div className="text-lg font-bold">{minHeight.toFixed(2)}m</div>
            <div className="text-xs opacity-80">{(minHeight * 3.28084).toFixed(1)}ft</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-4 h-4 bg-white/30 rounded-full"></div>
              <span className="font-medium">Average</span>
            </div>
            <div className="text-lg font-bold">{avgHeight.toFixed(2)}m</div>
            <div className="text-xs opacity-80">{(avgHeight * 3.28084).toFixed(1)}ft</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-4 h-4 bg-gradient-to-r from-white/30 to-white/60 rounded"></div>
              <span className="font-medium">Range</span>
            </div>
            <div className="text-lg font-bold">{tideRange.toFixed(2)}m</div>
            <div className="text-xs opacity-80">{(tideRange * 3.28084).toFixed(1)}ft</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-96 mb-6">
          <Line data={chartData} options={options} />
        </div>

        {/* Key Insights Panel */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">📊 Key Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-gray-800 mb-2">Tide Pattern Analysis</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Tidal range: {tideRange > 3 ? 'Large' : tideRange > 1.5 ? 'Moderate' : 'Small'} ({tideRange.toFixed(1)}m)</li>
                <li>• Pattern: {extremePoints.length > 10 ? 'Semi-diurnal' : 'Mixed'} tides</li>
                <li>• Variation: {((tideRange / avgHeight) * 100).toFixed(0)}% from mean level</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 mb-2">Optimal Activity Windows</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• High tide activities: {extremePoints.filter(e => e.type === 'High').length} opportunities</li>
                <li>• Low tide exploration: {extremePoints.filter(e => e.type === 'Low').length} windows</li>
                <li>• Best fishing: 2hrs before/after high tide</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Source and Methodology */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-xs text-gray-500 space-y-2 md:space-y-0">
            <div>
              <strong>Data Source:</strong> WorldTides API • <strong>Resolution:</strong> 30-minute intervals • <strong>Accuracy:</strong> ±5cm
            </div>
            <div>
              <strong>Location:</strong> {tideData.station.lat.toFixed(4)}°N, {Math.abs(tideData.station.lon).toFixed(4)}°{tideData.station.lon < 0 ? 'W' : 'E'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TideChart;