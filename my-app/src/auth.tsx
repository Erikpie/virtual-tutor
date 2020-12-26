import firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import { auth, provider } from './firebaseInit';
import { Navbar, Form, FormControl, Nav, Button } from 'react-bootstrap';
import Search from './components/Search';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// TODO: FIX ANY IN ONCHANGE
const AuthHandler = ({ onChange }: { onChange: any }) => {

    const [user, setUser] = useState<firebase.User | null>(null);
    useEffect(() => onChange(user), [user, onChange]);

    // Update user after an authentication changes
    auth.onAuthStateChanged(user => setUser(user));

return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Virtual Tutor</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Router>
                <Switch>
                    <div className="App">
                        <Route path="/" />
                        <Route path="/search" component={Search} />
                    </div>
                </Switch>
                </Router>    
                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Subject Search" className="mr-sm-2" />                </Form>
                <Form inline>
                {user ?
                    <form className="form-inline my-2 my-lg-0">
                        <p>Logged in as {user.displayName} (uid: {user.uid})</p>
                        {user.photoURL ? <img src={user.photoURL} alt="user" /> : ''}
                        <button className="btn btn-outline-primary" type="button" onClick={auth.signOut}>Log out</button>
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

