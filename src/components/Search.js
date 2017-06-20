import React, { Component } from 'react';
import Results from './Results';
import * as globals from '../globals.js';

class Search extends Component {
  constructor (props) {
    super(props);
    this.state = {
			query: '',
      artist: [],
      data: []
		};
  }

  render() {
		return(
			<div className="container">
        <div className="header">
          <input type="text" id="search" className="search" placeholder="Search for a music artist" onKeyPress={this.handleKeyPress.bind(this)} autoFocus />
        </div>
				<Results data={this.state.data} />
			</div>
		);
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.submitQuery(e.target.value);
    }
  }

  submitQuery(search) {
    const query = search.trim().toLowerCase();
    if (this.state.query === query) return; // to prevent redundant requests
    this.setState({ query });
    if (query) this.findArtist(query);
  }

  findArtist(artist) {
    const url = `${globals.URL_FM}?method=artist.search&artist=${encodeURIComponent(artist)}&api_key=${globals.KEY_FM}&format=json&limit=1`
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const artist = json.results.artistmatches.artist;

        if (artist.length) {
          const name = artist[0].name;
          this.setState({ artist });
          document.getElementById('search').value = name;
          this.findRelated(name);
        }
      }).catch(error => console.log(error));
  }

  findRelated(artist) {
    const url = `${globals.URL_FM}?method=artist.getsimilar&artist=${encodeURIComponent(artist)}&api_key=${globals.KEY_FM}&format=json&limit=19`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const data = this.state.artist.concat(json.similarartists.artist);
        this.setState({ data });
      }).catch(error => console.log(error));
  }
}

export default Search;
