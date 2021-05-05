import React from 'react';

import ScreenShareDemo from "../components/ScreenShareDemo"
import Chat from "./Chat.js"
import Whiteboard from "./Whiteboard.js"
import {Row, Container} from 'react-bootstrap'

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
				<br/>
				</div>
				<Container>
				<Row>
				<ScreenShareDemo chatRoomID={this.state.id} />
				</Row>
				<Row>
				<Whiteboard />
				</Row>
				</Container>
                <Chat subject={this.state.subject} name={this.state.name} id={this.state.id} messages={""}/>
			</div>
		);
	}
}
export default Room;
