import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    Spotify: {
      Player: new (options: Spotify.PlayerOptions) => Spotify.Player;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

namespace Spotify {
  export interface PlayerOptions {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume?: number;
  }

  export interface Player {
    connect: () => Promise<boolean>;
    addListener: (event: string, callback: (data: any) => void) => void;
    togglePlay: () => void;
  }
}

const TransparentSpotifyPlayer: React.FC = () => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<any>(null);

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = localStorage.getItem('spotify_token');

      if (!token) {
        console.error('No token found. Please authenticate first.');
        return;
      }

      const spotifyPlayer = new window.Spotify.Player({
        name: 'Transparent Player',
        getOAuthToken: (cb: any) => { cb(token); },
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        console.log('Ready with Device ID', device_id);
      });

      spotifyPlayer.addListener('player_state_changed', (state) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
      });

      spotifyPlayer.connect();
    };
  }, []);

  return (
    <div style={{
      width: '300px',
      height: '80px',
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px',
      borderRadius: '8px',
      color: '#fff',
    }}>
      {currentTrack ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={currentTrack.album.images[0].url} alt="Album Art" style={{ width: '50px', height: '50px', borderRadius: '4px' }} />
          <div>
            <p style={{ fontSize: '14px', margin: '0' }}>{currentTrack.name}</p>
            <p style={{ fontSize: '12px', margin: '0' }}>{currentTrack.artists[0].name}</p>
          </div>
          <button onClick={() => player?.togglePlay()} style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            border: 'none',
            padding: '10px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            {isPaused ? 'Play' : 'Pause'}
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TransparentSpotifyPlayer;
