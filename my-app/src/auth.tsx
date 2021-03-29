import firebase from 'firebase/app';
import { writeUserData } from './database';
import { useEffect, useState } from 'react';
import { auth, provider } from './firebaseInit';
import { Navbar, Nav, Button } from 'react-bootstrap';


// TODO: FIX ANY IN ONCHANGE
const AuthHandler = ({ onChange }: { onChange: any }) => {

    const [user, setUser] = useState<firebase.User | null>(null);
    useEffect(() => onChange(user), [user, onChange]);

    // Update user after an authentication changes
    auth.onAuthStateChanged(user => setUser(user));

    //Making sure not to overwrite users in the db
    if (user){
        var new_user = firebase.database().ref('users/' + user.uid);
        new_user.once("value")
        .then(function(snapshot) {
            if (snapshot.exists()){
                console.log(user.email + " is already in the database");
            }
            else if (user.displayName !== null && user.email !== null) {
                writeUserData(user.uid, user.displayName, user.email, false, false);
                console.log("stored "+user.displayName+" in database");
            }
        });
    }

return (
    <Navbar bg="light" expand="lg">
        <Nav className="mr-auto">
        </Nav>
        {user ?
            <form className="form-inline my-2 my-lg-0">
                <p>Logged in as {user.displayName} (uid: {user.uid})</p>
                {user.photoURL ? <img src={user.photoURL} alt="user" /> : ''}
                <button className="btn btn-outline-primary" type="button" onClick={() => 
                    auth.signOut() }>Log out</button>
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

