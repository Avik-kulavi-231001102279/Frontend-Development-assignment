import React from 'react';
import { Film } from 'lucide-react';

export default function Loading({ message = 'Loading cinema data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative mb-5">
        {/* Glowing pulse behind spinner */}
        <div className="absolute -inset-2 bg-cinema-red/30 rounded-full blur-xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-full border-4 border-cinema-800 border-t-cinema-red animate-spin flex items-center justify-center shadow-glow-red">
          <Film className="w-6 h-6 text-cinema-red animate-pulse" />
        </div>
      </div>
      <h3 className="font-display font-semibold text-lg text-slate-100">{message}</h3>
      <p className="text-xs text-slate-400 mt-1">Connecting to OMDb database...</p>
    </div>
  );
}

