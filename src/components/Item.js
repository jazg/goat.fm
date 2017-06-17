import React, { Component } from 'react';

class Item extends Component {
	constructor (props) {
    super(props);
    this.state = {
			selected: false
		};
  }

  render() {
		var image = {
			backgroundImage: 'url(' + this.props.image + ')'
	  }

		return (
    	<div className={this.props.selected ? 'item active' : 'item'} onClick={this.handleClick.bind(this)} style={image}>
				<span>{this.props.name}</span>
			</div>
		);
  }

	handleClick() {
		this.props.onClick(this.props.name);
		this.setState({ selected: !this.props.selected });
  }
}

export default Item;
