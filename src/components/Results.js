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
				<Player track={this.state.current} />
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
      if (this.state.current == null) this.updateCurrent();
      artists.push(name);
      this.addTracks(name);
    }
    this.setState({ artists });
  }

  addTracks(artist) {
    const url = `${globals.URL}?method=artist.gettoptracks&artist=${encodeURIComponent(artist)}&api_key=${globals.API_KEY}&format=json`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const unplayed = this.state.unplayed.concat(json.toptracks.track);
        this.setState({ unplayed: this.shuffleTracks(unplayed) });
      }).catch(error => console.log(error));
  }

  removeTracks(artist) {
		const unplayed = this.state.unplayed.slice();
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

  updateCurrent() {
    const unplayed = this.state.unplayed.slice();
    this.setState({
      unplayed: unplayed.splice(0, 1),
      current: unplayed[0]
    });
  }
}

export default Results;
