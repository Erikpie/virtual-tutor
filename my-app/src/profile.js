import { useEffect, useState } from "react"

const WORKER_ROUTE = 'https://tutoring_app_db.alucky0.workers.dev'

function Profile({ user_id }) {

    const [data, setData] = useState({subjects: [], zoomLink: ''});

    useEffect(() => {
        const cb = async () => {
        const response = await fetch(`${WORKER_ROUTE}/users/${user_id}`);
        const body = await response.json();
        setData(body);
        }
        cb();
    }, [user_id]);

    return (
        <div>
            <p>Subjects</p>
            <ul>
                {data.subjects.map(subject => <li key={subject}>{subject}</li>)}
            </ul>
            <a href={data.zoomLink}>Zoom Link</a>
        </div>
    );
}

export default Profile;