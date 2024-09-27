import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

const firebaseConfig = {
    apiKey: "AIzaSyC-4tvmQmC11OsoWAfQlpJwAsa9nQKsn0w",
    authDomain: "udaan-68610.firebaseapp.com",
    projectId: "udaan-68610",
    storageBucket: "udaan-68610.appspot.com",
    messagingSenderId: "375083836802",
    appId: "1:375083836802:web:db46de9d3a3e2444461b9b"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

function registerUser(event) {
    event.preventDefault();  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    const userRole = document.getElementById('user-role').value;
    if (!email || !password || !username || !userRole) {
        alert('Please fill in all fields');
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return database.ref('users/' + user.uid).set({
                username: username,
                email: email,
                role: userRole
            });
        })
        .then(() => {
            alert("User registered successfully");
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error("Error during registration:", error.message);
            alert("Error: " + error.message);
        });
}

function resetPassword() {
    const email = document.getElementById('reset-email').value;

    if (!email) {
        alert('Please enter your email');
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert('Password reset email sent!');
        })
        .catch((error) => {
            console.error('Error sending password reset email:', error.message);
            alert(`Error: ${error.message}`);
        });
}

document.getElementById('register-form').addEventListener('submit', registerUser);

export { app, auth, database, registerUser, resetPassword };
