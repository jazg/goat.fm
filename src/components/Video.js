import React, { Component } from 'react';
import YouTube from 'react-youtube';

class Video extends Component {
	constructor (props) {
    super(props);
    this.state = {
			player: null,
			id: ''
		};
  }

	componentDidUpdate() {
		const player = this.state.player;
		const id = this.props.id;
		if (!player) return; // if player has not been created
		if (id !== this.state.id) this.setState({ id });
		if (!this.props.play) player.pauseVideo();
		else player.playVideo();
	}

  render() {
		const opts = {
			height: '195',
			width: '320',
			playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
		};
		return (
			<div className="video">
				{this.props.id &&
					<YouTube
						videoId={this.state.id}
						opts={opts}
						onReady={this.onReady.bind(this)}
						// onPlay={this.handleState.bind(this)}
						// onPause={this.handleState.bind(this)}
						onEnd={this.handleState.bind(this)}
						onError={this.handleState.bind(this)}
					/>
				}
			</div>
		);
  }

	onReady(e) {
    this.setState({ player: e.target });
  }

	handleState(e) {
		this.props.onEvent(e.data);
	}
}

export default Video;
