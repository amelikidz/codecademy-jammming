import React from "react";
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import './App.css';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName} 
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }

  addTrack = (track) => {
    let playlistTracks = this.state.playlistTracks;
    
    const notInPlaylist = playlistTracks.every(item => {
      return item.id != track.id;
    });

    if (notInPlaylist) {
      playlistTracks.push(track);
      this.setState({playlistTracks: playlistTracks});
    }
  }

  removeTrack = (track) => {
    let playlistTracks = this.state.playlistTracks;

    playlistTracks = playlistTracks.filter(item => {
      return item.id != track.id;
    });

    this.setState({playlistTracks: playlistTracks});
  }

  updatePlaylistName = (name) => {
    this.setState({playlistName: name});
  }

  savePlaylist =() => {
    const trackURIs = this.state.playlistTracks.map((track) => {
      return track.uri;
    });

    Spotify.savePlaylist(this.state.playlistName, trackURIs);
  }

  search = (term) => {
    if (!term || !Spotify.getAccessToken()) return;

    Spotify.search(term).then(tracks => {this.setState({searchResults: tracks}); });
  }
}

export default App;