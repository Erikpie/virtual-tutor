import React from 'react'

const Navbar = ({ user }) => {
    return (
        <nav className="navbar navbar-light bg-light">
            <p className="navbar-brand">Virtual Tutor</p>
            <ul className="navbar-nav mr-auto">
                <li>Users</li>
            </ul>
            { user ?
                <form className="form-inline my-2 my-lg-0">
                    <img className="img-fluid" src={user.photoURL} alt="Profile" />
                    <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Log Out</button>
                </form> :
                <form>
                    <button className="btn btn-success" type="submit">Authenticate with Google</button>
                </form>
            }
        </nav>
    );
};

export default Navbar
