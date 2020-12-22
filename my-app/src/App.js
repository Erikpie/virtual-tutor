import './App.css';
import { useState } from 'react';
import Navigation from './components/Navigation';
import Search from './components/Search';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import AuthHandler from './auth';
import Profile from './profile';
import EditProfile from './edit';

//const WORKER_ROUTE = 'http://localhost:8787';
//const WORKER_ROUTE = 'https://tutoring_app_db.alucky0.workers.dev'

function App() {

  // Initialize state variables
  const [user, setUser] = useState();
  const [profile, setProfile] = useState("");

  // Debugging code
  //useEffect(() => console.log(user), [user]);

  return (
    <Router>
      <div className="App">
        <AuthHandler onChange={setUser} />
        <Navigation />
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

export default App;
