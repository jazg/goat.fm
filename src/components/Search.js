import React, { Component } from 'react';
import Suggestions from './Suggestions';
import Results from './Results';
import * as globals from '../globals.js';

class Search extends Component {
  constructor (props) {
    super(props);
    this.state = {
			query: '',
      suggestions: [],
      selected: null,
      artists: [],
      urlValue: false,
      inputFocused: true
		};
  }

  componentDidMount() {
    const query = window.location.href.split('/').pop();
    if (!query) return;
    this.setState({ query, urlValue: true, inputFocused: false }, function() {
      this.updateSuggestions();
    });
  }

  render() {
		return(
			<div className="container">
        <div className="header">
          <input
            type="text"
            ref="search"
            className="search"
            placeholder="Search for a music artist"
            onKeyPress={this.handleKeyPress.bind(this)}
            onFocus={this.showDropdown.bind(this)}
            onBlur={this.hideDropdown.bind(this)}
          />
          {this.state.inputFocused &&
            <Suggestions data={this.state.suggestions} onClick={this.handleClick.bind(this)} />
          }
        </div>
				<Results data={this.state.artists} />
			</div>
		);
  }

  showDropdown() {
    this.setState({ inputFocused: true });
  }

  hideDropdown() {
    this.setState({ inputFocused: false });
  }

  handleKeyPress(e) {
    const query = e.target.value.trim();
    this.setState({ query }, function() {
      this.updateSuggestions();
    });
  }

  updateSuggestions() {
    const query = this.state.query;
    if (!query) return;
    const url = `${globals.URL_FM}?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${globals.KEY_FM}&format=json&limit=5`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const suggestions = json.results.artistmatches.artist;
        this.setState({ suggestions });
        if (this.state.urlValue) this.handleClick(0);
      }).catch(error => console.log(error));
  }

  handleClick(index) {
    const selected = this.state.suggestions[index];
    this.setState({ selected, inputFocused: false }, function() {
      this.updateArtist();
    });
    if (this.state.urlValue) this.setState({ urlValue: false }); // don't update results based on url anymore
  }

  updateArtist() {
    const selected = this.state.selected;
    if (!selected) return;
    this.refs.search.value = selected.name; // set input text
    window.history.pushState({}, '', '/' + encodeURIComponent(selected.name)); // set url location
    this.findRelated();
  }

  findRelated() {
    const selected = this.state.selected;
    if (!selected) return;
    const url = `${globals.URL_FM}?method=artist.getsimilar&artist=${encodeURIComponent(selected.name)}&api_key=${globals.KEY_FM}&format=json&limit=19`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const artists = json.similarartists.artist;
        artists.unshift(this.state.selected);
        this.setState({ artists });
      }).catch(error => console.log(error));
  }
}

export default Search;
