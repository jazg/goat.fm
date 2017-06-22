import React, { Component } from 'react';

class Tags extends Component {
	constructor (props) {
    super(props);
    this.state = {
			visible: false
		};
  }

	componentDidUpdate() {
		const visible = this.props.artists.length ? true : false;
		if (visible !== this.state.visible) this.setState({ visible });
	}

  render() {
		return (
			<div className={this.state.visible ? 'tags visible' : 'tags'}>
				{this.props.artists &&
					this.props.artists.map(function(artist, index) {
						return (
							<span key={index} onClick={this.handleClick.bind(this)}>{artist}</span>
						);
					}.bind(this))
				}
			</div>
		);
  }

	handleClick(e) {
		this.props.onClick(e.target.innerText);
  }
}

export default Tags;
