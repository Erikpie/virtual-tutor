import React from "react"
import { useState } from "react"
import AuthHandler from "../auth"
import Profile from "../profile"
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
function Login() {
  // If you arent' using the "user" variable, then you can just have it
  // blank when using the useState() hook
  const [, setUser] = useState()
  const [profile, setProfile] = useState("")

  return (
    <div>
      <AuthHandler onChange={setUser} />
      <div className="container-fluid">
        <div className="form-group">
          <label htmlFor="user_id">User ID</label>
          <input
            type="text"
            className="form-control"
            name="user_id"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          />
        </div>
        {profile ? <Profile user_id={profile} /> : ""}
      </div>
    </div>
  )
}
export default Login
