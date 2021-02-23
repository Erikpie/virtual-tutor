import './App.css';
import Navigation from './components/Navigation';
import Search from './components/Search';
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
        </Switch>
        <br/>
        <div className="container-fluid">
        </div>
        <hr />
        <div className="container-fluid">
          <div className="form-group">
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
