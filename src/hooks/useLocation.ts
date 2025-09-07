import { useState, useEffect } from 'react';
import type { Location } from '../types';

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const STORAGE_KEY = 'tidescout_location';

  // Load saved location on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedLocation = JSON.parse(saved);
        // Check if location is less than 1 hour old
        const isRecent = Date.now() - parsedLocation.timestamp < 3600000;
        if (isRecent) {
          setLocation(parsedLocation);
        }
      } catch (err) {
        console.error('Failed to parse saved location:', err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const newLocation: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: Date.now()
      };

      setLocation(newLocation);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
    } catch (err) {
      const errorMessage = err instanceof GeolocationPositionError
        ? getGeolocationErrorMessage(err.code)
        : 'Failed to get your location';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearLocation = () => {
    setLocation(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    clearLocation
  };
};

const getGeolocationErrorMessage = (code: number): string => {
  switch (code) {
    case 1:
      return 'Location access denied. Please enable location services.';
    case 2:
      return 'Location unavailable. Please try again.';
    case 3:
      return 'Location request timed out. Please try again.';
    default:
      return 'Unable to retrieve your location.';
  }
};