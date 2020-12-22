import './App.css';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

import AuthHandler from './auth';
import { auth } from './firebase';
import Profile from './profile';

//const WORKER_ROUTE = 'http://localhost:8787';
const WORKER_ROUTE = 'https://tutoring_app_db.alucky0.workers.dev'

function App() {

  // Initialize state variables
  const [user, setUser] = useState();
  const [profile, setProfile] = useState("");
  const [formData, setFormData] = useState({subjects: [], zoomLink: ''});

  useEffect(() => console.log(user), [user]);

  const saveProfile = async event => {
    event.preventDefault();
    console.log(formData);

    const authToken = await auth.currentUser.getIdToken(true);
    console.log(authToken);
    console.log(typeof(authToken));
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${authToken}`
      },
      body: JSON.stringify(formData)
    };
    console.log(requestOptions);
    const response = await fetch(WORKER_ROUTE, requestOptions);
    console.log(response);
    const body = await response.text();
    console.log(body);
  }

  const handleSelect = e => {
    const options = Array.from(e.target.options);
    const selected = options.filter(s => s.selected);
    const subjects = selected.map(s => s.value);
    setFormData({...formData, subjects: subjects})
  }

  return (
    <div className="App">
      <Navbar />
      <AuthHandler onChange={setUser} />
      <div>
        <form name="userInfo" action='/' onSubmit={saveProfile}>
          <label htmlFor="subjects">Select all subjects that you are willing to tutor</label>
          <select name="subjects" multiple={true} value={formData.subjects} onChange={handleSelect}>
            <option value="math">Math</option>
            <option value="reading">Reading</option>
            <option value="writing">Writing</option>
            <option value="science">Science</option>
            <option value="history">History</option>
          </select>
          <label htmlFor="zoomLink">Enter the Zoom link you'll be offering services at</label>
          <input type="text" name="zoomLink" value={formData.zoomLink} onChange={e => setFormData({...formData, zoomLink: e.target.value})}/>
          <input type="submit" value="Save" />
        </form>
      </div>
      <div>
        <label htmlFor="user_id">User ID</label>
        <input type="text" name="user_id" value={profile} onChange={e => setProfile(e.target.value)} />
        {profile ? <Profile user_id={profile} /> : ""}
      </div>
    </div>
  );
}

export default App;
