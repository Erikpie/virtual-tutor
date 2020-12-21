import { useEffect, useState } from 'react';
import { auth, provider } from './firebase.js';



const AuthHandler = ({ onChange }) => {

    const [user, setUser] = useState();
    useEffect(() => onChange(user), [user, onChange]);

    // Update user after an authentication changes
    auth.onAuthStateChanged(user => setUser(user));

    return (
        <div className="auth">
            {user ?
                <div>
                    <img src={user.photoURL} alt="user" />
                    <h1>Logged in as {user.displayName} (uid: {user.uid})</h1>
                    <button onClick={() => auth.currentUser.getIdToken(true).then(jwt => console.log(jwt))}>Log JWT</button>
                    <button onClick={() => auth.signOut()}>Log out</button>
                </div>
                :
                <div>
                    <h1>Not logged in</h1>
                    <p>Log in or sign up</p>
                    <button onClick={() => auth.signInWithPopup(provider)}>Authenticate with Google</button>)
                </div>
            }
        </div>
    );
};

export default AuthHandler;

