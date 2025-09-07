import React from 'react';
import { MapPin, RotateCcw, Trash2, AlertCircle } from 'lucide-react';
import type { Location } from '../types';

interface LocationStatusProps {
  location: Location | null;
  loading: boolean;
  error: string | null;
  onGetLocation: () => void;
  onClearLocation: () => void;
}

const LocationStatus: React.FC<LocationStatusProps> = ({
  location,
  loading,
  error,
  onGetLocation,
  onClearLocation
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="text-blue-600 w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-900">Your Location</h2>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onGetLocation}
            disabled={loading}
            className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Getting Location...' : 'Update Location'}</span>
          </button>
          
          {location && (
            <button
              onClick={onClearLocation}
              className="flex items-center space-x-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="text-red-600 w-5 h-5" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {location ? (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Latitude:</span>
              <span className="ml-2 text-gray-900">{location.latitude.toFixed(6)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Longitude:</span>
              <span className="ml-2 text-gray-900">{location.longitude.toFixed(6)}</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Last updated: {new Date(location.timestamp).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {loading ? 'Getting your location...' : 'Click "Update Location" to find tide data for your area'}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationStatus;