import React from 'react';

import ScreenShareDemo from "../components/ScreenShareDemo"
import Chat from "./Chat.js"

class Room extends React.Component {
	constructor(props) {
		super(props);
		// id, subject, isTutor, name, messages
		this.state = this.props.location.state;
	}
	
	render()
	{
		return(
			<div style={{display: "flex"}}>
				<div>
				<h3>Subject: {this.state.subject}</h3>
				<br/>
				</div>
				<ScreenShareDemo chatRoomID={this.state.id} />
                <Chat subject={this.state.subject} name={this.state.name} id={this.state.id} messages={""}/>
			</div>
		);
	}
}
export default Room;
