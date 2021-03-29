import React from 'react';
import { useState } from 'react';
import Navigation from './components/Navigation';
import Search from './components/Search';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import firebase from 'firebase/app';
import AuthHandler from './auth';
import Profile from './profile';
import EditProfile from './edit';
/*
function Login() {
    return(
      <div className="container-fluid">
      {user ? <EditProfile user={user} /> : ""}
      </div>
      <hr />
      <div className="container-fluid">
        <div className="form-group">
        <label htmlFor="user_id">User ID</label>
        <input type="text" className="form-control" name="user_id" value={profile} onChange={e => setProfile(e.target.value)} />
        </div>
        {profile ? <Profile user_id={profile} /> : ""}
      </div>
    );
}
*/
// temp function until we figure out the above
function Login()
{	
  const [user, setUser] = useState<firebase.User>();
  const [profile, setProfile] = useState("");
  
  return (
    <Router>
      <div className="App">
        <Navigation />
        <AuthHandler onChange={setUser} />
        <Switch>
          <Route path="/search" component={Search} />
        </Switch>
        <br/>
        <div className="container-fluid">
        {user ? <EditProfile user={user} /> : ""}
        </div>
        <hr />
        <div className="container-fluid">
          <div className="form-group">
          <label htmlFor="user_id">User ID</label>
          <input type="text" className="form-control" name="user_id" value={profile} onChange={e => setProfile(e.target.value)} />
          </div>
          {profile ? <Profile user_id={profile} /> : ""}
        </div>
      </div>
    </Router>
  );
}
export default Login;
