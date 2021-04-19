import React from 'react';
import {ChatBox} from 'react-chatbox-component';
import {getUpdate, initRoom} from '../database.tsx';

class Room extends React.Component {
	constructor(props) {
		super(props);
		// id, subject, isTutor, name messages
		this.state = this.props.location.state;
		this.update = this.update.bind(this);

		initRoom(this);
	}

	update()
	{
		getUpdate(this); // from database.tsx
	}

	render()
	{
		return(
			<div>
			Room ID: {this.state.id}
			<br/>
			Subject: {this.state.subject}
			</div>
		);
	}
}

export default Room;
