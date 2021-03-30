import React from 'react'
import {Checkbox} from '@material-ui/core'
import { Redirect } from 'react-router-dom';

class Join extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		name: "",
		subject: "",
		isTutor: false,
		roomReady: -1
		}

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleSubjectChange = this.handleSubjectChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCheckChange = this.handleCheckChange.bind(this);
	}

	handleNameChange(event) {
		let newState = this.state;
		newState.name = event.target.value;
		this.setState(newState);
	}

	handleSubjectChange(event) {
		let newState = this.state;
		newState.subject = event.target.value;
		this.setState(newState);
	}

	requestNewRoom = () => {
		const reqBody = {
		type: "make",
		name: this.state.name,
		subject: this.state.subject,
		isTutor: this.state.isTutor
		};
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(reqBody)	
		};
		//fetch('localhost:8080/make', requestOptions)
		//.then(response => response.json())
		//.then(data => GoToRoom(data.id));
		// changing room
		let newState = this.state
		newState.roomReady = 32;
		// TODO get roomReady ID from server
		this.setState(newState);
		alert("Alerted server of " + requestOptions.body);
	}

	handleSubmit(event) {
		if (this.state.name == "" || this.state.subject == "") {
			alert("Name and subject must contain data");
		}
		else {
			//alert(this.state.name + " wants learn about " + this.state.subject + this.state.isTutor);
			this.requestNewRoom();
		}
		event.preventDefault();
	}

	handleCheckChange(event) {
		let newState = this.state;
		newState.isTutor = !newState.isTutor;
		this.setState(newState);
	}

	render() {
		if (this.state.roomReady >= 0)
		{
			return <Redirect to={{pathname: '/room', state: { id: this.state.roomReady }}}/>
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
			<input type="submit" value="Submit"/>
			</form>	
			As a tutor?<Checkbox checked={this.state.isTutor} onChange={this.handleCheckChange} inputProps={{ 'aria-label': 'primary checkbox' }}/>
			</div>
		);
	}
}

export default Join;
