"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSwitch } from "@/app/switch-context";

interface Wallpaper {
  id: number;
  url: string;
}

const wallpapers: Wallpaper[] = [
  //low res{ id: 1, url: 'https://c4.wallpaperflare.com/wallpaper/131/480/871/moonlight-guts-anime-moon-wallpaper-preview.jpg' },
  { id: 2, url: 'https://external-preview.redd.it/Dx7kym02QCFgvV3zZSCWM-1kPXwcgoCdEzFVCDvan8k.jpg?auto=webp&s=195ee0e9316dbb93a9a262cc18a0443a9827a486' },
//somewhat low res
  {id: 3, url: 'https://c4.wallpaperflare.com/wallpaper/12/827/723/kentaro-miura-berserk-guts-wallpaper-preview.jpg'}
];

const Lockingin = () => {
  const [spotifyLink, setSpotifyLink] = useState('');
  const router = useRouter();
  const { isSwitchOn, toggleSwitch } = useSwitch();
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  

  const saveFocusTime = useCallback(async (minutes: number) => {
    if (minutes <= 0) return; // Don't save if time is 0 or negative
    try {
      const response = await fetch('/api/lockingin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ focustime: minutes }),
      });

      if (!response.ok) {
        throw new Error('Failed to save focus time');
      }

      const data = await response.json();
      console.log('Focus time saved:', data);
    } catch (error) {
      console.error('Error saving focus time:', error);
    }
  }, []);

  useEffect(() => {
    // Set a random wallpaper
    const randomIndex = Math.floor(Math.random() * wallpapers.length);
    setCurrentWallpaper(wallpapers[randomIndex]);

    // Load Spotify link from localStorage
    const savedLink = localStorage.getItem('spotifyLink');
    if (savedLink) {
      setSpotifyLink(savedLink);
    }

    if (isSwitchOn) {
      // Only start the timer if the switch is on
      startTimeRef.current = Date.now();

      // Update elapsed time every second
      timerIntervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    }
    const fetchUserSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();
          setSpotifyLink(settings.spotifyLink || '');
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    fetchUserSettings();
    return () => {
      // Cleanup the interval on component unmount
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      // Save focus time when component unmounts, only if switch was on
      if (isSwitchOn && startTimeRef.current !== null) {
        const totalMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000);
        saveFocusTime(totalMinutes);
      }
    };
  }, [saveFocusTime, isSwitchOn]);

  const handleSwitchChange = () => {
    if (isSwitchOn) {
      // Switch is being turned off
      if (startTimeRef.current !== null) {
        const totalMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000);
        saveFocusTime(totalMinutes);
      }
      // Clear the timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      startTimeRef.current = null;
      setElapsedTime(0);
      router.push('/');
    } else {
      // Switch is being turned on
      startTimeRef.current = Date.now();
      // Start the timer
      timerIntervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    }
    toggleSwitch();
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSwitchOn && startTimeRef.current !== null) {
        const totalMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000);
        saveFocusTime(totalMinutes);
      }
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveFocusTime, isSwitchOn]);

  const getSpotifyEmbedUrl = (link: string) => {
    const playlistId = link.split('/').pop();
    return playlistId ? `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0` : '';
  };
  return (
    <div style={{ width: '100%', height: '101vh', overflow: 'hidden', position: 'relative' }}>
      {/* Wallpaper Background */}
      {currentWallpaper && (
        <img
          src={currentWallpaper.url}
          alt="Wallpaper"
          style={{
            borderRadius: '-12px',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        />
      )}

      {/* Switch */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center z-0">
        <Switch id="lock-in" checked={isSwitchOn} onClick={handleSwitchChange} />
        <Label htmlFor="lock-in" className="ml-2 label-font text-xl font-semibold">
          Lock In
        </Label>
      </div>

      {/* Spotify Player */}
      <div className="fixed bottom-4 right-4 z-10">
        {spotifyLink ? (
          <iframe
            style={{ borderRadius: '20px' }}
            src={getSpotifyEmbedUrl(spotifyLink)}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        ) : (
          <p>No Spotify playlist set. Please update in Settings.</p>
        )}
      </div>

      {/* Timer */}
      <div className="fixed bottom-4 left-4 z-10">
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{Math.floor(elapsedTime / 60)} minutes</p>
      </div>
    </div>
  );
};

export default Lockingin;