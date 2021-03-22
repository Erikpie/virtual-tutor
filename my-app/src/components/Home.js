import React from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import './Home.css'
function Home() {
    return(
    	<Container className="quadBox">
    		<Row>
			<Col className="quadrant">
				<img className="apple" src={"/img/apple.jpg"}/>
			</Col>
			<Col className="save">
				<p className="saveDesc">
					Live web tutoring to save your class grades.<br/>
					<Button style={{'background-color': 'black', 'border-color': 'white'}}>Start learning</Button>

				</p>
			</Col>
			</Row>
			<Row>
			<Col>Available Tutors</Col>
			<Col>Live Classes</Col>
			</Row>
        </Container>
    );
}
export default Home;
