import React, { useState, useEffect} from 'react';
import '../style/dashboard.css';
import { getDatabase, ref, onValue } from 'firebase/database';
import { IoIosPeople } from "react-icons/io";
import app from '../firebaseconfig';


const ProductList = () => {
    const [queueList, setQueueList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(parseInt(localStorage.getItem('currentIndex')) || 0);
    const [voices, setVoices] = useState([]);
    const [voicesLoaded, setVoicesLoaded] = useState(false);
    
    

    useEffect(() => {
        const db = getDatabase(app);
        const waitlistRef = ref(db);
      
        const unsubscribe = onValue(waitlistRef, (snapshot) => {
            const data = snapshot.val();
            const listItems = Object.keys(data).map(key => ({
                id: key,
                number: data[key], // The value is directly accessed as shown in the image uploaded
            }));
            setQueueList(listItems.sort((a, b) => a.id.localeCompare(b.id))); // Sort by id if needed
    
            // Removed setCurrentIndex(0) to prevent resetting currentIndex on data update
        });
    
        // This will unsubscribe from the updates when the component unmounts
        return () => unsubscribe();
    }, []);
    
    

    const loadVoices = () => {
        let availableVoices = speechSynthesis.getVoices();
        console.log("Loaded Voices: ", availableVoices); // Add this line for debugging
        if (availableVoices.length > 0) {
            setVoices(availableVoices);
            setVoicesLoaded(true);
        }
    };
    
    const speakNumber = (number) => {
        if (number !== undefined) {
            const utterance = new SpeechSynthesisUtterance(`Number ${number}, please proceed to the counter`);
            utterance.voice = getFemaleVoice();
            console.log("Selected Voice: ", utterance.voice); // Add this line for debugging
            speechSynthesis.speak(utterance);
        }
    };
    

    const callCurrentNumber = () => {
        if (!voicesLoaded) {
            console.warn('The voices have not been loaded yet.');
            return;
        }
    
        const currentNumber = queueList[currentIndex]?.number;
        if (currentNumber) {
            speakNumber(currentNumber); // Simplified call
        } else {
            console.warn('Current number is not available.');
        }
    };
    
    

    const getFemaleVoice = () => {
        const femaleVoice = voices.find(voice => voice.gender === 'female') ||
                            voices.find(voice => voice.name.toLowerCase().includes('female'));
        if (femaleVoice) {
            return femaleVoice;
        } else {
            // Log a warning if no female voice is found and return the first voice as fallback
            console.warn('No female voice found. Falling back to the default voice.');
            return voices[0];
        }
    };
    
    

    const handleNext = () => {
        if (currentIndex + 1 < queueList.length) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            localStorage.setItem('currentIndex', nextIndex.toString()); // Sync with localStorage
            // Add a slight delay before speaking to ensure state updates
            setTimeout(() => {
                speakNumber(queueList[nextIndex].number);
            }, 500);
        } else {
            console.log('No more items in the queue');
        }
    };
    

    const handlePrevious = () => {
        if (currentIndex > 0) { // Prevent going back to a non-existent index
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            localStorage.setItem('currentIndex', prevIndex.toString()); // Sync with localStorage
        }
    };


    const getNextNumber = () => {
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
                    <div className="navigation-buttons">
                        <button onClick={handlePrevious} disabled={currentIndex <= 0}>Previous</button>
                        <button onClick={handleNext} disabled={currentIndex >= queueList.length - 1}>Next</button>
                    </div>
                    <div className="call-button-container">
                    <button onClick={callCurrentNumber} className="speak-button">Speak Number</button>
                </div>
                
                </div>
            </div>
        </div>
    );
};

export default ProductList;
