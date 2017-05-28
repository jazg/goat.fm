import React, { Component } from 'react';
import Item from './Item';

class Results extends Component {
  render() {
		return (
    	<div className="results">
        {this.props.data &&
          this.props.data.map(function(artist) {
            return <Item
              key={artist.id}
              name={artist.name}
              url={artist.external_urls.spotify}
              image={artist.images[0].url}
              followers={artist.followers.total}
            />
          })
        }
      </div>
		);
  }
}

export default Results;
