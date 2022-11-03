import React from "react";
import { TrackList } from '../TrackList/TrackList';
import './Playlist.css';

export class Playlist extends React.Component {
  render() {
    return (
      <div className="Playlist">
        <input defaultValue={"New Playlist"} onChange={this.handleNameChange} />
        <TrackList onRemove={this.props.onRemove} isRemoval={true} trackList={this.props.playlistTracks} />
        <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
      </div>
    );
  }

  handleNameChange = (e) => {
    this.props.onNameChange(e.target.value);
  }
}