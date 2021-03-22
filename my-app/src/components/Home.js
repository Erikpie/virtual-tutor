import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import './Home.css'
function Home() {
    return(
    	<Container className="quadBox">
    		<Row>
			<Col className="quadrant">
				<img className="logo" src={"/img/apple.jpg"}/>
			</Col>
			<Col>
				Save your education
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
