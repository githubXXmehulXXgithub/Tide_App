import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from './components/Header';
import LocationStatus from './components/LocationStatus';
import TideInfo from './components/TideInfo';
import TideChart from './components/TideChart';
import TideInsights from './components/TideInsights';
import ActivityRecommendations from './components/ActivityRecommendations';
import LoadingSpinner from './components/LoadingSpinner';
import { useLocation } from './hooks/useLocation';
import { useTideData } from './hooks/useTideData';

function App() {
  const {
    location,
    loading: locationLoading,
    error: locationError,
    getCurrentLocation,
    clearLocation
  } = useLocation();

  const {
    tideData,
    loading: tideLoading,
    error: tideError,
    refetch: refetchTideData
  } = useTideData(location);

  // Auto-fetch location on first load if not available
  useEffect(() => {
    if (!location && !locationLoading && !locationError) {
      getCurrentLocation();
    }
  }, [location, locationLoading, locationError, getCurrentLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <LocationStatus
          location={location}
          loading={locationLoading}
          error={locationError}
          onGetLocation={getCurrentLocation}
          onClearLocation={clearLocation}
        />

        {tideError && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-red-600 w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Tide Data Error</h3>
                <p className="text-red-700 text-sm mt-1">{tideError}</p>
                <button
                  onClick={refetchTideData}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {tideLoading && (
          <div className="bg-white rounded-xl shadow-lg mb-6">
            <LoadingSpinner />
            <div className="text-center pb-8">
              <p className="text-gray-600">Fetching tide data for your location...</p>
            </div>
          </div>
        )}

        {tideData && !tideLoading && (
          <div className="space-y-6">
            <TideInfo
              tideData={tideData}
              loading={tideLoading}
              onRefresh={refetchTideData}
            />
            
            <TideChart tideData={tideData} />
            
            <TideInsights tideData={tideData} />
            
            <ActivityRecommendations tideData={tideData} />
          </div>
        )}

        {!location && !locationLoading && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🌊</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to TideScout</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get real-time tide information and smart activity recommendations for your location.
              Enable location access to get started.
            </p>
            <button
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {locationLoading ? 'Getting Location...' : 'Get My Tide Data'}
            </button>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm">
            <p>
              Built with ❤️ for ocean lovers • Powered by{' '}
              <a 
                href="https://www.worldtides.info/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                WorldTides API
              </a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;