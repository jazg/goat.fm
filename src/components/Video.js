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
		const autoplay = this.props.play ? 1 : 0;
		const opts = {
			height: '195',
			width: '320',
			playerVars: { autoplay }
		};
		return (
			<div className="video">
				{this.props.id &&
					<YouTube
						videoId={this.state.id}
						opts={opts}
						onReady={this.onReady.bind(this)}
						onStateChange={this.handleState.bind(this)}
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
