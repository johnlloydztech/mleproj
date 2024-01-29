import React, { useState, useEffect } from 'react';
import '../style/Analytics.css';
import { getDatabase, ref, onValue } from 'firebase/database';
import app from '../firebaseconfig';

const Analytics = () => {
    const [queueList, setQueueList] = useState([]);

    useEffect(() => {
        const db = getDatabase(app);
        const waitlistRef = ref(db); // Make sure 'waitlist' is the correct path
    
        onValue(waitlistRef, (snapshot) => {
            const data = snapshot.val();
            const listItems = Object.keys(data).map(key => ({
                id: key,
                number: data[key], // Directly accessing the number as there's no nested structure
                // status: 'Unknown' // You can add a default status or another logic to determine the status
            }));
            setQueueList(listItems);
        });
    }, []);
    

    return (
        <div className="App">
            <h1 className="heading">Waiting List</h1> {/* Added heading */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Number</th>
                        {/* <th>Status</th> // Remove this if there's no status in your database */}
                    </tr>
                </thead>
                <tbody>
                    {queueList.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.number}</td>
                            {/* <td>{item.Status}</td> // Remove this if there's no status */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Analytics;
