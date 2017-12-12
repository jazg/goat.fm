import React, { Component } from 'react';
import Suggestions from './Suggestions';
import Results from './Results';
import logo from '../styles/img/logo.png';
import * as globals from '../globals.js';

class Search extends Component {
  constructor (props) {
    super(props);
    this.state = {
			query: '',
      suggestions: [],
      suggestionHover: 0,
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
      this.findExact();
    });
  }

  render() {
		return(
      <div className={this.state.artists.length > 0 ? 'container' : 'container no-results'}>
        <div className="header">
          <img className="logo" src={logo} alt="goat.fm" />
          <input
            type="text"
            ref="search"
            className="search"
            placeholder="Search for a music artist"
            onKeyUp={this.handleKeyPress.bind(this)}
            onKeyDown={this.handleArrowKeys.bind(this)}
            onFocus={this.showDropdown.bind(this)}
            onBlur={this.hideDropdown.bind(this)}
          />
          {this.state.inputFocused &&
            <Suggestions data={this.state.suggestions} hovered={this.state.suggestionHover} onHover={this.handleHover.bind(this)} onClick={this.handleClick.bind(this)} />
          }
        </div>
				<Results data={this.state.artists} />
			</div>
		);
  }

  showDropdown() {
    this.setState({
      suggestionHover: 0,
      inputFocused: true
    });
  }

  hideDropdown() {
    this.setState({ inputFocused: false });
  }

  handleKeyPress(e) {
    var exclude = ['Alt', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'CapsLock', 'Control', 'End', 'Home', 'Insert', 'Meta', 'OS', 'PrintScreen', 'ScrollLock', 'Shift', 'Tab'];
    if (exclude.indexOf(e.key) > -1) return; // don't do anything for these keys
    if (e.key === 'Enter') {
      this.handleClick(this.state.suggestionHover); // select hovered artist
    } else {
      const query = e.target.value.trim();
      this.setState({ query }, function() {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(this.findExact.bind(this), 250);
      });
      this.showDropdown(); // ensure suggestions are visible
    }
  }

  handleArrowKeys(e) {
    var hovered = this.state.suggestionHover;
    var length = this.state.suggestions.length;
    switch (e.key) {
      case 'ArrowUp':
        hovered--;
        hovered = ((hovered % length) + length) % length;
        this.setState({ suggestionHover: hovered });
        break;
      case 'ArrowDown':
        hovered++;
        hovered = ((hovered % length) + length) % length;
        this.setState({ suggestionHover: hovered });
        break;
      default:
        break;
    }
  }

  // tries to suggest exact artist user is searching for
  findExact() {
    const query = this.state.query;
    if (!this.state.query) {
      this.setState({ suggestions: [] });
      return;
    }
    const url = `${globals.URL_FM}?method=artist.search&artist="${encodeURIComponent(query)}"&api_key=${globals.KEY_FM}&format=json&limit=1`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const suggestions = json.results.artistmatches.artist;
        this.setState({ suggestions }, function() {
          this.findSimilar();
        });
      }).catch(error => console.log(error));
  }

  // suggests artists similar to search query
  findSimilar() {
    const query = this.state.query;
    const existing = this.state.suggestions;
    const url = `${globals.URL_FM}?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${globals.KEY_FM}&format=json&limit=5`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const items = json.results.artistmatches.artist;
        var suggestions = items;
        if (existing.length) {
          var index = -1;
          for (var i = 0; i < suggestions.length; i++) { // check if json already contains exact artist
            if (suggestions[i].name === existing[0].name) {
              index = i;
              break;
            }
          }
          if (index > -1) suggestions.splice(index, 1);
          else suggestions.pop();
          suggestions.unshift(existing[0]); // add exact artist to beginning
        }
        this.setState({ suggestions }, function() {
          if (this.state.urlValue) this.handleClick(0); // choose first value if artist is set in url
        });
      }).catch(error => console.log(error));
  }

  handleHover(index) {
    this.setState({ suggestionHover: index });
  }

  handleClick(index) {
    if (this.state.suggestions.length === 0) return;
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
