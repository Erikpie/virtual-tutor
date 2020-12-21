import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

import AuthHandler from './auth.js';

function App() {

  // Initialize state variables
  const [user, setUser] = useState();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <AuthHandler onChange={setUser} />
    </div>
  );
}

export default App;
