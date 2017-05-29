import React, { Component } from 'react';

class Playlist extends Component {
  render() {
		return (
    	<div className="playlist">{this.props.data}</div>
		);
  }
}

export default Playlist;
