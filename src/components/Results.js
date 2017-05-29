import React, { Component } from 'react';
import Item from './Item';
import Playlist from './Playlist';

class Results extends Component {
  constructor (props) {
    super(props);
    this.state = {
			selected: []
		};
  }

  render() {
		return (
      <div className={this.state.selected.length > 0 ? 'content play' : 'content'}>
      	<div className="results">
          {this.props.data &&
            this.props.data.map(function(artist, index) {
              const id = artist.id;
              const image = artist.images[0];
              const imageUrl = image ? image.url : '';
              var selected = false;
              if (this.state.selected.length) {
                selected = this.state.selected.indexOf(id) > -1;
              }
              return <Item
                key={index}
                id={id}
                name={artist.name}
                url={artist.external_urls.spotify}
                image={imageUrl}
                followers={artist.followers.total}
                selected={selected}
                onClick={this.handleClick.bind(this)}
              />
            }.bind(this))
          }
        </div>
        <Playlist data={this.state.selected} />
      </div>
		);
  }

  handleClick(id) {
    var selected = this.state.selected;
    if (selected.indexOf(id) > -1) {
      const index = selected.indexOf(id);
      selected.splice(index, 1);
    } else {
      selected.push(id);
    }
    this.setState({ selected });
  }
}

export default Results;
