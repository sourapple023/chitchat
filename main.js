// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDO9rmvm6loulEodOpUwiqGDkQ8Ylc9ZIc",
    authDomain: "chitchat-7a7ef.firebaseapp.com",
    databaseURL: "https://chitchat-7a7ef-default-rtdb.firebaseio.com",
    projectId: "chitchat-7a7ef",
    storageBucket: "chitchat-7a7ef.firebasestorage.app",
    messagingSenderId: "923823961908",
    appId: "1:923823961908:web:d24bf3969af575f3f65761"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log('Firebase initialized:', app);

// Element selection
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

console.log('Elements selected:', {
    chatMessages,
    chatInput,
    sendButton
});

const chatRef = ref(database, 'chat'); // Reference for chat messages

// Send chat message
sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        const timestamp = new Date().toISOString();
        console.log(`Sending message: ${message} at ${timestamp}`); // Debug log
        push(chatRef, { message, timestamp })
            .then(() => {
                console.log('Message sent successfully');
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
        chatInput.value = ''; // Clear the input field
    } else {
        console.log('No message to send'); // Debug log for empty message
    }
});

// Receive chat messages
onChildAdded(chatRef, (snapshot) => {
    const data = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.timestamp}: ${data.message}`;
    console.log(`Received message: ${data.message} at ${data.timestamp}`); // Debug log
    console.log(`Appending message to chatMessages div`); // Debug log
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
});
