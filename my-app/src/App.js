import './App.css';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

import AuthHandler from './auth.js';

function App() {

  // Initialize state variables
  const [user, setUser] = useState();

  useEffect(() => console.log(user), [user]);

  return (
    <div className="App">
      <Navbar />
      <AuthHandler onChange={setUser} />
    </div>
  );
}

export default App;
