import firebase from 'firebase/app';
import { useEffect, useState } from 'react';
import { auth, provider } from './firebaseInit';
import { Navbar, Nav, Button } from 'react-bootstrap';

// TODO: FIX ANY IN ONCHANGE
const AuthHandler = ({ onChange }: { onChange: any }) => {

    const [user, setUser] = useState<firebase.User | null>(null);
    useEffect(() => onChange(user), [user, onChange]);

    // Update user after an authentication changes
    auth.onAuthStateChanged(user => setUser(user));

return (
    <Navbar bg="light" expand="lg">
        <Nav className="mr-auto">
        </Nav>
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
    </Navbar>
    );
};

export default AuthHandler;

