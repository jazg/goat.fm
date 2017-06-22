import React, { Component } from 'react';

class Suggestions extends Component {
  render() {
		return (
    	<ul className="dropdown">
				{this.props.data &&
					this.props.data.map(function(artist, index) {
						return (
							<li key={index} onMouseDown={this.handleClick.bind(this, index)}>
								<span className="title">{artist.name}</span>
								<span className="listeners">{artist.listeners}</span>
							</li>
						);
					}.bind(this))
				}
			</ul>
		);
  }

	handleClick(index, e) {
		this.props.onClick(index);
  }
}

export default Suggestions;
