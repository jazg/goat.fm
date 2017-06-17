import React, { Component } from 'react';
import Video from './Video';

class Player extends Component {
  render() {
		return (
    	<div className="player">
				{this.props.track != null &&
					<div>
						{this.props.track.name}
						<Video track={this.props.track} />
					</div>
				}
			</div>
		);
  }
}

export default Player;
