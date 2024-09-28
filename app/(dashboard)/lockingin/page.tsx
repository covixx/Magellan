"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSwitch } from "@/app/switch-context";
import { useSettingsData } from '@/features/settings/use-get-settings';

interface Wallpaper {
  id: number;
  url: string;
}

const wallpapers: Wallpaper[] = [
  { id: 2, url: 'https://external-preview.redd.it/Dx7kym02QCFgvV3zZSCWM-1kPXwcgoCdEzFVCDvan8k.jpg?auto=webp&s=195ee0e9316dbb93a9a262cc18a0443a9827a486' },
  {id: 3, url: 'https://c4.wallpaperflare.com/wallpaper/12/827/723/kentaro-miura-berserk-guts-wallpaper-preview.jpg'}
];

const Lockingin = () => {
  const { data: settingsData, isLoading } = useSettingsData();
  const [spotifyLink, setSpotifyLink] = useState('');

  const router = useRouter();
  const { isSwitchOn, toggleSwitch } = useSwitch();
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  let newspotifylink = ' ';
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  if (settingsData && 'data' in settingsData && settingsData.data) {
    newspotifylink = settingsData?.data?.spotifyLink ?? ' ';
  }
  const saveFocusTime = useCallback(async (minutes: number) => {
    if (minutes <= 0) return;
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
    const randomIndex = Math.floor(Math.random() * wallpapers.length);
    setCurrentWallpaper(wallpapers[randomIndex]);

    const fetchUserSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();
          if (settingsData && 'data' in settingsData && settingsData.data) {
            setSpotifyLink(settingsData?.data?.spotifyLink ?? ' ');
          }
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    fetchUserSettings();

    if (isSwitchOn) {
      startTimeRef.current = Date.now();
      timerIntervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (isSwitchOn && startTimeRef.current !== null) {
        const totalMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000);
        saveFocusTime(totalMinutes);
      }
    };
  }, [saveFocusTime, isSwitchOn]);

  const handleSwitchChange = () => {
    if (isSwitchOn) {
      if (startTimeRef.current !== null) {
        const totalMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000);
        saveFocusTime(totalMinutes);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      startTimeRef.current = null;
      setElapsedTime(0);
      router.push('/');
    } else {
      startTimeRef.current = Date.now();
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
    if(!link) {
      return '';
    }
    else {
      const playlistId = link.split('/playlist/')[1]?.split('?')[0];
    return `https://open.spotify.com/embed/playlist/${playlistId}`;
    }
  };
  
  console.log(newspotifylink);
  return (
    <div style={{ width: '100%', height: '101vh', overflow: 'hidden', position: 'relative' }}>
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

      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center z-0">
        <Switch id="lock-in" checked={isSwitchOn} onClick={handleSwitchChange} />
        <Label htmlFor="lock-in" className="ml-2 label-font text-xl font-semibold">
          Lock In
        </Label>
      </div>

      <div className="fixed bottom-4 right-4 z-10">
        {spotifyLink ? (
          <iframe
            style={{ borderRadius: '20px' }}
            src={getSpotifyEmbedUrl(spotifyLink || '')}
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

      <div className="fixed bottom-4 left-4 z-10">
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{Math.floor(elapsedTime / 60)} minutes</p>
      </div>
    </div>
  );
};

export default Lockingin;