import React from 'react';

class Chatbox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: "fasdf"
		}
	}

	addText(newText) {
		this.setState({text: this.state.text + newText + '\n'});
	}

	render()
	{
		return(
		<label>
		{this.state.text}
		</label>	
		);
	}
}

class Chatinput extends React.Component {
	
}

class Chat extends React.Component {
	
}

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
			Room ID: {this.state.id}
			{this.state.id}
			</div>
		);
	}
}

export default Room;
