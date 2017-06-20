import React, { Component } from 'react';

class Controls extends Component {
  render() {
		return (
      <div className={'controls' + (!this.props.play ? ' paused' : '')}>
				<span id="prev" className="item" onClick={this.handleClick.bind(this)}></span>
				<span id="play" className="item" onClick={this.handleClick.bind(this)}></span>
				<span id="next" className="item" onClick={this.handleClick.bind(this)}></span>
			</div>
		);
  }

  handleClick(e) {
		this.props.onEvent(e.currentTarget.id);
  }
}

export default Controls;
