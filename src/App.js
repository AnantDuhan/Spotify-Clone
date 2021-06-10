import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './Login';
import { getTokenFromResponse } from './Spotify';
import SpotifyWebApi from "spotify-web-api-js";
import Player from './Player';
import { useDataLayerValue } from './DataLayer';

const spotify = new SpotifyWebApi();

function App() {

  const [{user, token}, dispatch] = useDataLayerValue();

  // run code based on a given condition
  useEffect(() => {
    const hash = getTokenFromResponse();
    window.location.hash = "";
    const _token = hash.access_token;

    if(_token) {
      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });

      spotify.setAccessToken(_token);

      spotify.getMe().then(user => {
        dispatch({
          type: 'SET_USER',
          user: user,
        });
      });

      spotify.getUserPlaylists().then((playlists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists: playlists,
        });
      });

      // 37i9dQZEVXcLhYGRIdytwC
      spotify.getPlaylist('37i9dQZEVXcLhYGRIdytwC').then((Response) => 
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: Response,
        })
      );
    }

  }, []);

  return (
    <div className="app">
      {
        token ? (
          <Player spotify={spotify} />
        ) : (
          <Login />
        )
      }
    </div>
  );
}

export default App;
