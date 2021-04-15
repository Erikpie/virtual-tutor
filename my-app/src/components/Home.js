import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import { Divider } from '@material-ui/core';
import './Home.css'
function Home() {
    return(
    	<Container className="quadBox">
    		<Row>
			<Col className="quadrant">
				<img className="apple" alt="Apple" src={"/img/apple.jpg"}/>
			</Col>
			<Col className="save">
				<p className="saveDesc">
					Live web tutoring to save your class grades.<br/>
					<Button style={{'background-color': 'black', 'border-color': 'white'}} href="/join">Start learning</Button>

				</p>
			</Col>
			</Row>
			<Row>
			<Col>
				<Row>
					<h1>Available Tutors</h1>
				</Row>
				<Divider/>
				<Row>
					
				</Row>
			</Col>
			<Col>Live Classes</Col>
			</Row>
        </Container>
    );
}
export default Home;
