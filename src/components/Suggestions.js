import React, { Component } from 'react';

class Suggestions extends Component {
  render() {
		return (
    	<ul className="dropdown">
				{this.props.data &&
					this.props.data.map(function(artist, index) {
						return (
							<li className={index === this.props.hovered ? 'hover' : ''} key={index} onMouseOver={this.handleHover.bind(this, index)} onMouseDown={this.handleClick.bind(this, index)}>
								<span className="title">{artist.name}</span>
								<span className="listeners">{artist.listeners}</span>
							</li>
						);
					}.bind(this))
				}
			</ul>
		);
  }

  handleHover(index, e) {
    this.props.onHover(index);
  }

	handleClick(index, e) {
		this.props.onClick(index);
  }
}

export default Suggestions;
