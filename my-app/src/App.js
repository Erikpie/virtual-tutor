import "./App.css"
import Navigation from "./components/Navigation"
import Search from "./components/Search"
import Whiteboard from "./components/Whiteboard"
import ScreenShareDemo from "./components/ScreenShareDemo"
import Home from "./components/Home"
import Join from "./components/Join"
import Room from "./components/Room"
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
          <Route path="/screen" component={ScreenShareDemo} />
          <Route path="/join" component={Join} />
          <Route path="/room" component={Room} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
