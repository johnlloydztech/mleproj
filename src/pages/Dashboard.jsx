import React, { useState, useEffect,useCallback} from 'react';
import '../style/dashboard.css';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { IoIosPeople } from "react-icons/io";
import app from '../firebaseconfig';

const Dashboard = () => {
    const [queueList, setQueueList] = useState([]);
    
    const db = getDatabase(app);
    const waitlistRef = ref(db);
    const [currentIndex, setCurrentIndex] = useState(parseInt(localStorage.getItem('currentIndex')) || 0);

    useEffect(() => {
        onValue(waitlistRef, (snapshot) => {
            const data = snapshot.val();
            const listItems = Object.keys(data).map(key => ({
                id: key,
                number: data[key], // Assuming the data structure has directly the number
                // status: data[key].status // Uncomment this if 'status' is a property within each 'waiting' node
            }));
            setQueueList(listItems.sort((a, b) => a.id.localeCompare(b.id))); // Sort by id if needed
        });
    }, [waitlistRef]);
    
    
    const updateIndex = useCallback(() => {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      localStorage.setItem('currentIndex', nextIndex.toString());
      const currentIndexRef = ref(db, 'currentIndex');
      update(currentIndexRef, nextIndex);
    }, [currentIndex]);
    useEffect(() => {
        if (queueList.length > 0 && queueList[currentIndex]?.status === 'Complete') {
          updateIndex();
        }
      }, [queueList, currentIndex,updateIndex]); // Make sure currentIndex is a dependency
      
    
    useEffect(() => {
      if (queueList.length > 0 && queueList[currentIndex].status === 'Complete') {
        updateIndex();
      }
    }, [queueList, currentIndex,updateIndex]);
    
    const getNextNumber = () => {
      // Check if there is a next item in the queue
      if (currentIndex < queueList.length - 1) {
        const nextItem = queueList[currentIndex + 1];
        return nextItem.number; // Return the number of the next item
      }
      return "waiting";
    };

    return (
        <div>
            <h1 className="centered-text welcome-title">WELCOME TO MAKERLAB ELECTRONICS!</h1>
            <div className="home-container">
                <div className="box">
                    <div className="box-icon">
                        <IoIosPeople />
                    </div>
                    <div className="box-data">
                        <span> NUMBER </span>
                        <h1>{queueList[currentIndex] ? queueList[currentIndex].number : 'loading...'}</h1>
                        <div className="next-number">
                            <h2>Next Number: {getNextNumber()}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
