import React from 'react';
class Room extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.location.state.id
		}
	}

	render()
	{
		return(
			<div>
			{this.state.id}
			</div>
		);
	}
}

export default Room;
