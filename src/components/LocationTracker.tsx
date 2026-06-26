'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Battery, BatteryLow, BatteryMedium, BatteryFull, History } from 'lucide-react';

interface LocationData {
  _id: string;
  device_id: string;
  name: string;
  model: string;
  device_class: string;
  battery_level: number;
  battery_status: string | null;
  location: {
    type: string;
    coordinates: [number, number];
  };
  location_data: {
    latitude: number;
    longitude: number;
    accuracy: number;
    position_type: string;
    is_old: boolean;
    location_timestamp: number;
  };
  timestamp: string;
  address?: string;
}

export function LocationTracker() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchLocation = async () => {
    try {
      const response = await fetch('/api/location');
      const result = await response.json();

      if (result.success && result.data) {
        const address = await fetchAddress(
          result.data.location_data.latitude,
          result.data.location_data.longitude
        );
        setLocationData({ ...result.data, address });
        setError(null);
      } else {
        setError('No location data available');
      }
    } catch (err) {
      console.error('Error fetching location:', err);
      setError('Failed to fetch location');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddress = async (lat: number, lon: number): Promise<string> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'LocationTracker/1.0' } }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.display_name || 'Address not available';
    } catch (err) {
      console.error('Error fetching address:', err);
      return 'Address not available';
    }
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch('/api/location/history');
      const result = await response.json();

      if (result.success && result.data) {
        const validItems = result.data.filter((item: LocationData) =>
          item.location_data?.latitude && item.location_data?.longitude
        );

        const historyWithAddresses: LocationData[] = [];
        for (const item of validItems) {
          const address = await fetchAddress(
            item.location_data.latitude,
            item.location_data.longitude
          );
          historyWithAddresses.push({ ...item, address });
        }
        setLocationHistory(historyWithAddresses);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    if (locationHistory.length === 0) fetchHistory();
  };

  const getBatteryIcon = (level: number) => {
    if (level < 0.2) return <BatteryLow className="h-3 w-3 text-destructive" />;
    if (level < 0.5) return <BatteryMedium className="h-3 w-3 text-terminal-amber" />;
    if (level < 0.9) return <BatteryFull className="h-3 w-3 text-terminal-green" />;
    return <Battery className="h-3 w-3 text-terminal-green" />;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const then = new Date(timestamp).getTime();
    const diffInMinutes = Math.floor((now - then) / 60000);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes === 1) return '1m ago';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1h ago';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1d ago';
    return `${diffInDays}d ago`;
  };

  const openMapLink = () => {
    if (!locationData) return;
    const { latitude, longitude } = locationData.location_data;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      '_blank'
    );
  };

  if (isLoading) {
    return (
      <div className="border border-terminal-border p-3">
        <span className="text-xs text-muted-foreground">fetching location<span className="cursor-blink">_</span></span>
      </div>
    );
  }

  if (error || !locationData) {
    return (
      <div className="border border-terminal-border p-3">
        <span className="text-xs text-muted-foreground">{error || 'No location data'}</span>
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className="space-y-2">
        <div className="border border-terminal-border p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-terminal-amber flex items-center gap-1.5">
              <History className="h-3 w-3" />
              location/history
            </span>
            <button
              onClick={() => setShowHistory(false)}
              className="text-[10px] text-muted-foreground hover:text-terminal-green transition-colors"
            >
              [back]
            </button>
          </div>

          {isLoadingHistory ? (
            <span className="text-xs text-muted-foreground">loading<span className="cursor-blink">_</span></span>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {locationHistory.map((location) => (
                <button
                  key={location._id}
                  className="w-full text-left border border-terminal-border p-2 hover:border-terminal-green-dim transition-colors"
                  onClick={() => {
                    const { latitude, longitude } = location.location_data;
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
                      '_blank'
                    );
                  }}
                >
                  <div className="flex items-start gap-1.5">
                    <MapPin className="h-3 w-3 text-terminal-green-dim mt-0.5 shrink-0" />
                    <p className="text-[10px] text-muted-foreground break-words">
                      {location.address || 'Loading...'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {getTimeAgo(location.timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      {getBatteryIcon(location.battery_level)}
                      {Math.round(location.battery_level * 100)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Location display */}
      <button
        onClick={openMapLink}
        className="w-full text-left border border-terminal-border p-3 hover:border-terminal-green-dim transition-colors"
      >
        {/* Map Preview */}
        <div className="aspect-video mb-3 overflow-hidden bg-[#0a0a0a] relative">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${locationData.location_data.longitude - 0.005},${locationData.location_data.latitude - 0.004},${locationData.location_data.longitude + 0.005},${locationData.location_data.latitude + 0.004}&layer=mapnik&marker=${locationData.location_data.latitude},${locationData.location_data.longitude}`}
            style={{ border: 0, width: '100%', height: '100%', pointerEvents: 'none', filter: 'hue-rotate(90deg) saturate(0.3) brightness(0.7)' }}
            title="Location Map"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-terminal-green-dim">
            <MapPin className="h-3 w-3" />
            <span>{locationData.name}</span>
          </div>

          {locationData.address && (
            <p className="text-[10px] text-muted-foreground pl-[18px] break-words">
              {locationData.address}
            </p>
          )}

          <div className="flex items-center gap-3 pl-[18px] text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {getTimeAgo(locationData.timestamp)}
            </span>
            <span className="flex items-center gap-1">
              {getBatteryIcon(locationData.battery_level)}
              {Math.round(locationData.battery_level * 100)}%
            </span>
          </div>
        </div>
      </button>

      {/* History button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          handleShowHistory();
        }}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] border border-terminal-border text-muted-foreground hover:text-terminal-green hover:border-terminal-green-dim transition-colors"
      >
        <History className="h-3 w-3" />
        ./history
      </button>
    </div>
  );
}
