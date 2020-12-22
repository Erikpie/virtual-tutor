import { useEffect, useState } from 'react';
import { auth, provider } from './firebase.js';

const AuthHandler = ({ onChange }) => {

    const [user, setUser] = useState();
    useEffect(() => onChange(user), [user, onChange]);

    // Update user after an authentication changes
    auth.onAuthStateChanged(user => setUser(user));

    return (
        <nav className="navbar navbar-light bg-light">
            <h4 className="navbar-brand mr-auto">Virtual Tutor</h4>
            {user ?
                <form className="form-inline my-2 my-lg-0">
                    <p>Logged in as {user.displayName} (uid: {user.uid})</p>
                    <img src={user.photoURL} alt="user" />
                    <button className="btn btn-outline-primary" onClick={() => auth.signOut()}>Log out</button>
                </form>
                :
                <form className="form-inline my-2 my-lg-0">
                    <p>Not logged in</p>
                    <button className="btn btn-success" onClick={() => auth.signInWithPopup(provider)}>Authenticate with Google</button>
                </form>
            }
        </nav>
    );
};

export default AuthHandler;

