import React, { Component } from 'react';

class Item extends Component {
  render() {
		var image = {
			backgroundImage: 'url(' + this.props.image + ')'
	  }

		return (
    	<div className="item" style={image}></div>
		);
  }
}

export default Item;
