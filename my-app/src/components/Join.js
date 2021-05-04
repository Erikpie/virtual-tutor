import React from 'react';
import {Checkbox} from '@material-ui/core';
import { Redirect } from 'react-router-dom';

import { createRoom } from '../database.tsx';


class Join extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		name: "",
		subject: "",
		isTutor: false,
		roomReady: -1,
		IDinput: ""
		}

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleSubjectChange = this.handleSubjectChange.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
		this.handleCheckChange = this.handleCheckChange.bind(this);
		this.handleIDChange = this.handleIDChange.bind(this);
		this.handleJoin = this.handleJoin.bind(this);
	}

	handleIDChange(event)
	{
		this.setState({IDinput: event.target.value});
	}

	handleNameChange(event) {
		this.setState({name: event.target.value});
	}

	handleSubjectChange(event) {
		this.setState({subject: event.target.value});
	}

	handleCreate(event) {
		if (this.state.name === "" || this.state.subject === "") {
			alert("Name and subject must contain data");
		}
		else {
			//alert(this.state.name + " wants learn about " + this.state.subject + this.state.isTutor);
			createRoom(this);
		}
		event.preventDefault();
	}

	handleCheckChange(event) {
		let newState = this.state;
		newState.isTutor = !newState.isTutor;
		this.setState(newState);
	}

	handleJoin(event) {
		// skips check if room actually exists
		this.setState({roomReady: parseInt(this.state.IDinput)});
	}

	render() {
		if (this.state.roomReady >= 0)
		{
			return <Redirect to={{pathname: '/room', state: { id: this.state.roomReady,
			subject: this.state.subject,
			isTutor: this.state.isTutor,
			name: this.state.name,
			messages: "" }}}/>
		}
		return (
		<div>
			Create a room:
			<form onSubmit={this.handleSubmit}>
			<label>
			Your Name:
			<input type="text" value={this.state.name} onChange={this.handleNameChange} />
			</label>
			<br/>
			<label>
			Subject Name:
			<input type="text" value={this.state.subject} onChange={this.handleSubjectChange} />
			</label>
			<br/>
			<input type="submit" value="Create" onClick={this.handleCreate} />
			</form>	
			As a tutor?<Checkbox checked={this.state.isTutor} onChange={this.handleCheckChange} inputProps={{ 'aria-label': 'primary checkbox' }}/>
			<br/>
			Join a room. Enter ID: 
			<input type="text" value={this.state.IDinput} onChange={this.handleIDChange} />
			<br/>
			<input type="submit" value="Join" onClick={this.handleJoin}/>
		</div>
		);
	}
}

export default Join;
