import React, { Component } from 'react';

class Item extends Component {
	constructor (props) {
    super(props);
    this.state = {
			selected: false
		};
  }

	componentDidUpdate() {
		const selected = this.props.selected;
		if (selected !== this.state.selected) this.setState({ selected });
	}

  render() {
		var image = {
			backgroundImage: 'url(' + this.props.image + ')'
	  }

		return (
    	<div className={this.state.selected ? 'item active' : 'item'} onClick={this.handleClick.bind(this)} style={image}>
				<span>{this.props.name}</span>
			</div>
		);
  }

	handleClick() {
		this.props.onClick(this.props.name);
		this.setState({ selected: !this.state.selected });
  }
}

export default Item;
