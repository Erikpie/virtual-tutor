import { auth } from './firebase';
import { useState } from 'react';

const WORKER_ROUTE = 'https://tutoring_app_db.alucky0.workers.dev'

function EditProfile({ user }) {

    const [formData, setFormData] = useState({ subjects: [], zoomLink: '' });

    const handleSelect = e => {
        const options = Array.from(e.target.options);
        const selected = options.filter(s => s.selected);
        const subjects = selected.map(s => s.value);
        setFormData({ ...formData, subjects: subjects })
    }

    const saveProfile = async event => {
        event.preventDefault();

        const authToken = await auth.currentUser.getIdToken(true);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        };
        const response = await fetch(WORKER_ROUTE, requestOptions);
        const body = await response.text();
        console.log(body);
    }

    return (
        <form name="userInfo" action='/' onSubmit={saveProfile}>
            <div className="form-group">
            <label htmlFor="subjects">Select all subjects that you are willing to tutor</label>
            <select className="custom-select" name="subjects" multiple={true} value={formData.subjects} onChange={handleSelect}>
                <option value="math">Math</option>
                <option value="reading">Reading</option>
                <option value="writing">Writing</option>
                <option value="science">Science</option>
                <option value="history">History</option>
            </select>
            </div>
            <div className="form-group">
            <label htmlFor="zoomLink">Enter the Zoom link you'll be offering services at</label>
            <input type="text" className="form-control" name="zoomLink" value={formData.zoomLink} onChange={e => setFormData({ ...formData, zoomLink: e.target.value })} />
            </div>
            <button className="btn btn-success" type="submit">Save</button>
        </form>
    );
}

export default EditProfile