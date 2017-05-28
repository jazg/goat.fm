import React, { Component } from 'react';
import Results from './Results';

class Search extends Component {
  constructor (props) {
    super(props);
    this.state = {
			query: '',
      artist: null,
      data: null
		};
  }

  render() {
		return(
			<div className="container">
        <div className="header">
          <input type="text" placeholder="Search for a music artist" onKeyPress={this.handleKeyPress.bind(this)} />
        </div>
				<Results data={this.state.data} />
			</div>
		);
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') this.submitQuery(e.target.value);
  }

  submitQuery(search) {
    const query = search.trim().toLowerCase();
    if (this.state.query === query) return // to prevent redundant requests
    window.location.hash = encodeURIComponent(query);
    this.setState({ query });
    if (query) this.findArtist(query);
  }

  findArtist(artist) {
    const url = 'https://api.spotify.com/v1/search?q=' + encodeURIComponent(artist) + '&type=artist&limit=1';
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const artist = json.artists.items;

        if (artist.length) {
          this.setState({ artist });
          this.findRelated(artist[0].id);
        }
      }).catch(error => console.log(error));
  }

  findRelated(id) {
    const url = 'https://api.spotify.com/v1/artists/' + encodeURIComponent(id) + '/related-artists';
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const data = this.state.artist.concat(json.artists);
        this.setState({ data });
      }).catch(error => console.log(error));
  }
}

export default Search;
