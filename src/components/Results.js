import React, { Component } from 'react';
import Item from './Item';
import Player from './Player';
import * as globals from '../globals.js';

class Results extends Component {
  constructor (props) {
    super(props);
    this.state = {
			artists: [],
      played: [],
      unplayed: [],
      current: null
		};
  }

  render() {
		return (
      <div className={this.state.artists.length > 0 ? 'content selected' : 'content'}>
      	<div className="results">
          {this.props.data &&
            this.props.data.map(function(artist, index) {
              const name = artist.name;
              const image = artist.image[4];
              const imageUrl = image ? image['#text'] : '';
              var selected = false;
              if (this.state.artists.length) {
                selected = this.state.artists.indexOf(name) > -1;
              }
              return <Item
                key={index}
                id={artist.id}
                name={name}
                url={artist.url}
                image={imageUrl}
                listeners={artist.listeners}
                selected={selected}
                onClick={this.handleClick.bind(this)}
              />
            }.bind(this))
          }
        </div>
				<Player track={this.state.current} onEvent={this.handleEvent.bind(this)} />
      </div>
		);
  }

  handleClick(name) {
    var artists = this.state.artists.slice();
    if (artists.indexOf(name) > -1) { // if artist has been deselected
      const index = artists.indexOf(name);
      artists.splice(index, 1);
      this.removeTracks(name);
    } else {
      artists.push(name);
      this.addTracks(name);
    }
    this.setState({ artists });
  }

  addTracks(artist) {
    const url = `${globals.URL_FM}?method=artist.gettoptracks&artist=${encodeURIComponent(artist)}&api_key=${globals.KEY_FM}&format=json`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        var unplayed = this.state.unplayed.concat(json.toptracks.track);
        unplayed = this.shuffleTracks(unplayed);
        if (this.state.current == null) {
          this.setState({ current: unplayed[0] });
          unplayed.shift();
        }
        this.setState({ unplayed });
      }).catch(error => console.log(error));
  }

  removeTracks(artist) {
		var unplayed = this.state.unplayed.slice();
    for (var i = unplayed.length - 1; i >= 0; i--) {
      if (artist === unplayed[i].artist.name) unplayed.splice(i, 1);
    }
		this.setState({ unplayed });
	}

  shuffleTracks(tracks) {
		for (var i = tracks.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = tracks[i];
			tracks[i] = tracks[j];
			tracks[j] = temp;
		}
		return tracks;
	}

  handleEvent(action) {
    var played = (this.state.played.length ? this.state.played.slice() : []);
    var unplayed = this.state.unplayed.slice();
    var current = this.state.current;
    switch(action) {
      case 'prev':
        if (played.length) {
          unplayed.unshift(current);
          current = played[played.length - 1];
          played.pop();
        }
        break;
      case 'next':
        played.push(current);
        current = unplayed[0];
        unplayed.shift();
        break;
      default:
        break;
    }
    this.setState({ played, unplayed, current });
    console.log(played, 'Played');
    console.log(current, 'Current');
    console.log(unplayed, 'Unplayed');
  }
}

export default Results;
