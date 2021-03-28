import React from 'react'
import {Checkbox} from '@material-ui/core'

class Join extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		name: "",
		subject: "",
		isTutor: false
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
		name: this.name,
		subject: this.subject,
		isTutor: this.isTutor
			
		};
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json' },
			body: JSON.stringify(this.state)	
		};
		alert("Alerting server");
	}

	handleSubmit(event) {
		if (this.state.name == "" || this.state.subject == "") {
			alert("Name and subject must contain data");
		}
		else {
			alert(this.state.name + " wants learn about " + this.state.subject + this.state.isTutor);
			this.requestNewRoom();
		}
		event.preventDefault();
	}

	goToRoom = (roomID) =>
	{
		
	}

	handleCheckChange(event) {
		let newState = this.state;
		newState.isTutor = !newState.isTutor;
		this.setState(newState);
	}

	render() {
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
