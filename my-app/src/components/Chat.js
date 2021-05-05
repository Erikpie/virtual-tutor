import React from 'react';
import {getUpdate, sendMessage} from '../database.tsx';
import './Chatroom.css';
import Message from './Message.js';

class Chat extends React.Component {
	//  Need to change some state stuff 
	constructor(props) {
		super(props);
		// subject, name, messages, id
		this.state = {messageVal: "", subject: this.props.subject, id: this.props.id, name: this.props.name, messages: ""};
		
		this.handleMessageClick = this.handleMessageClick.bind(this);
		this.handleMessageChange = this.handleMessageChange.bind(this);

		// initRoom(this); // start sending data

		setInterval(() => {
			getUpdate(this);
		}, 1000); // every second get update */
	}
	
	//  All good
	handleMessageChange(event) {
		this.setState({messageVal: event.target.value});
	}
	
	handleMessageClick(event) {
		this.setState({
			messageVal: ""
		});
		let message = this.state.messages + this.state.name + ":" + this.state.messageVal + "\n";
		sendMessage(this, message);
	}
	
	render()
	{
		const currentUser = this.state.name
		const messages = "LIVE WEB TUTOR:Chatting about " + this.state.subject + "!\n" + this.state.messages
		const nameAndChats = messages.split("\n").slice(0,-1)
		const namesToChats = nameAndChats.map(line => line.split(":"))

		return(
			<div className="chatroom">
                <ul className="chats" ref="chats">
                    {
                        namesToChats.map((namePlusChat) => 
                            <Message chat={namePlusChat} user={currentUser} />
                        )
                    }
                </ul>
                <input type="text" value={this.state.messageVal} onChange={this.handleMessageChange} />
				<input type="submit" value="Send" onClick={this.handleMessageClick} />
            </div>
		);
	}
}

export default Chat;
