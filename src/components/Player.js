import React, { Component } from 'react';
import Controls from './Controls';
import Video from './Video';
import * as globals from '../globals.js';

class Player extends Component {
  constructor (props) {
    super(props);
    this.state = {
			visible: false,
      playing: true,
      current: null,
      videoId: ''
		};
  }

  componentDidUpdate() {
    if (!this.props.track) {
      if (this.state.playing) this.setState({ playing: false });
      return;
    }
    if (!this.state.visible) this.setState({ visible: true });
    const current = this.props.track;
    if (current !== this.state.current) {
      this.setState({ current });
      this.fetchVideo();
    }
  }

  render() {
		return (
    	<div className="player">
				{this.state.visible &&
					<div>
            <Controls
              play={this.state.playing}
              onEvent={this.handleEvent.bind(this)}
            />
						<Video
              id={this.state.videoId}
              play={this.state.playing}
              onEvent={this.handleEvent.bind(this)}
            />
					</div>
				}
			</div>
		);
  }

  // handles events from the controls as well as the youtube videos
  handleEvent(e) {
    const playing = this.state.playing;
    switch(e) {
      case 1: // youtube response codes
      case 'play':
        if (!playing)
          this.setState({ playing: true });
        break;
      case 2:
      case 'pause':
        if (playing)
          this.setState({ playing: false });
        break;
      case 0:
      case 'prev':
      case 'next':
        this.props.onEvent(e);
        break;
      default:
        break;
    }
  }

  fetchVideo() {
    const track = this.props.track;
		const query = track.artist.name + ' - ' + track.name;
		const url = `${globals.URL_YT}?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${globals.KEY_YT}`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
				const videoId = json.items[0].id.videoId;
				console.log('Query: ' + query);
				console.log(json, 'Video found');
				this.setState({ videoId });
      }).catch(error => console.log(error));
	}
}

export default Player;
