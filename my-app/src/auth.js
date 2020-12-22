import { useEffect, useState } from 'react';
import { auth, provider } from './firebase.js';
import { Navbar, Form, NavDropdown, FormControl, Nav, Button } from 'react-bootstrap';

const AuthHandler = ({ onChange }) => {

    const [user, setUser] = useState();
    useEffect(() => onChange(user), [user, onChange]);

    // Update user after an authentication changes
    auth.onAuthStateChanged(user => setUser(user));

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Virtual Tutor</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">Link</Nav.Link>
                    <NavDropdown title="Temp" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Subject Search" className="mr-sm-2" />                </Form>
                <Form inline>
                {user ?
                    <form className="form-inline my-2 my-lg-0">
                        <p>Logged in as {user.displayName} (uid: {user.uid})</p>
                        <img src={user.photoURL} alt="user" />
                        <button className="btn btn-outline-primary" type="button" onClick={() => auth.signOut()}>Log out</button>
                    </form>
                    :
                    <form className="form-inline my-2 my-lg-0">
                        <Button variant="outline-success" type="Button" onClick={() => auth.signInWithPopup(provider)}>Sign in with Google</Button>
                    </form>
                }
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AuthHandler;

