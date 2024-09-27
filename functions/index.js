const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const { getFirestore, collection, query, where, getDocs, addDoc } = require('firebase/firestore');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://console.firebase.google.com/u/0/project/udaan-68610/database/udaan-68610-default-rtdb/data/~2F" // Ensure this URL is correct
});

const db = getFirestore(); 

const app = express();
const port = 3000;

const sendNotification = (token, title, message) => {
    const payload = {
        notification: {
            title: title,
            body: message
        }
    };

    admin.messaging().sendToDevice(token, payload)
        .then(response => console.log('Notification sent successfully:', response))
        .catch(error => console.error('Error sending notification:', error));
};

const checkLowAttendance = async () => {
    const studentsRef = collection(db, "students");
    const lowAttendanceQuery = query(studentsRef, where("attendance", "<", 70));

    try {
        const querySnapshot = await getDocs(lowAttendanceQuery);
        querySnapshot.forEach(async (doc) => {
            const student = doc.data();
            const alertMessage = `Alert! Your attendance is ${student.attendance.toFixed(2)}%, which is below the required 70%.`;

            if (student.fcmToken) {
                sendNotification(student.fcmToken, 'Attendance Alert', alertMessage);
            }

            await addDoc(collection(db, "alerts"), {
                studentName: student.name,
                title: 'Attendance Alert',
                message: alertMessage
            });
        });
    } catch (error) {
        console.error("Error fetching students or adding alerts:", error);
    }
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/check-attendance', (req, res) => {
    checkLowAttendance().then(() => {
        res.send("Attendance checked and alerts sent!");
    }).catch(error => {
        res.status(500).send("Error checking attendance: " + error);
    });
});

app.get('/alerts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'alerts.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
