import React from 'react';
import { Waves, Compass } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700 text-white shadow-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Waves className="w-10 h-10 text-blue-200" />
              <Compass className="w-5 h-5 text-teal-300 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">TideScout</h1>
              <p className="text-blue-200 text-sm">Smart Tide Tracking & Activity Planning</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
            <div className="text-blue-200">
              Powered by WorldTides API
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;