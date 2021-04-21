import React from 'react';
import {getUpdate, initRoom, sendMessage} from '../database.tsx';

class Room extends React.Component {
	constructor(props) {
		super(props);
		// id, subject, isTutor, name, messages
		this.state = this.props.location.state;
		this.setState({messageVal: ""});
		
		this.handleMessageClick = this.handleMessageClick.bind(this);
		this.handleMessageChange = this.handleMessageChange.bind(this);

		initRoom(this); // start sending data

		var updateInterval = setInterval(() => {
			getUpdate(this);
		}, 1000); // every second get update */
	}
	
	handleMessageChange(event) {
		this.setState({messageVal: event.target.value});
	}
	

	handleMessageClick(event) {
		this.setState({
			messageVal: ""
		});
		let message = this.state.messages + this.state.name + ": " + this.state.messageVal + "\n";
		sendMessage(this, message);
	}
	
	render()
	{
		return(
			<div>
			Room ID: {this.state.id}
			<br/>
			Subject: {this.state.subject}
			<br/>
			<input type="text" value={this.state.messageVal} onChange={this.handleMessageChange} />
			<input type="submit" value="Send!" onClick={this.handleMessageClick} />
			<br/>
			Messages:
			<br/>
			{this.state.messages}
			</div>
		);
	}
}

export default Room;
