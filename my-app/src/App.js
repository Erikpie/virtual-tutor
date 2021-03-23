import Navigation from "./components/Navigation"
import Search from "./components/Search"
import Whiteboard from "./components/Whiteboard"
import Home from "./components/Home"
import Login from "./components/Login"
import ScreenShareDemo from "./components/ScreenShareDemo"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

// FIXME: App.css is empty so it should have styles or else be removed
import "./App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/Whiteboard" component={Whiteboard} />
          <Route path="/login" component={Login} />
          <Route path="/screen" component={ScreenShareDemo} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
