import { db } from './firebase'; 
import { collection, getDocs } from 'firebase/firestore';

const displayAlerts = async () => {
    const alertsRef = collection(db, "alerts"); 
    const alertsSnapshot = await getDocs(alertsRef);
    const alertsList = alertsSnapshot.docs.map(doc => doc.data());

    const alertsContainer = document.getElementById('alerts-container'); 

    alertsList.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.innerHTML = `<strong>Title:</strong> ${alert.title} <br> <strong>Message:</strong> ${alert.message}`;
        alertsContainer.appendChild(alertElement);
    });
};

displayAlerts();