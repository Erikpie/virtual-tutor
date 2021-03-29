import './App.css';
import { useState } from 'react';
import Navigation from './components/Navigation';
import Search from './components/Search';
import Whiteboard from './components/Whiteboard';
import Home from './components/Home';
import Login from './components/Login';
import Join from './components/Join';
import Room from './components/Room';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

//const WORKER_ROUTE = 'http://localhost:8787';
//const WORKER_ROUTE = 'https://tutoring_app_db.alucky0.workers.dev'

function App() {
  // Debugging code
  //useEffect(() => console.log(user), [user]);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Switch>
          <Route path="/search" component={Search} />
          <Route path="/Whiteboard" component={Whiteboard} />
          <Route path="/login" component={Login} />
          <Route path="/join" component={Join} />
          <Route path="/room" component={Room} />

          // home must come last
          <Route path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
