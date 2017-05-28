import React, { Component } from 'react';
import Item from './Item';

class Results extends Component {
  render() {
		return (
    	<div className="results">
        {this.props.data &&
          this.props.data.map(function(artist) {
            const image = artist.images[0];
            const imageUrl = image ? image.url : '';
            return <Item
              key={artist.id}
              name={artist.name}
              url={artist.external_urls.spotify}
              image={imageUrl}
              followers={artist.followers.total}
            />
          })
        }
      </div>
		);
  }
}

export default Results;
