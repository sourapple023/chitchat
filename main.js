// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVfdo90fDEm3dh9AieWWn68woetCgW0_0",
    authDomain: "multiplayergame-81674.firebaseapp.com",
    projectId: "multiplayergame-81674",
    storageBucket: "multiplayergame-81674.firebasestorage.app",
    messagingSenderId: "180154918413",
    appId: "1:180154918413:web:97e2b1d664a5fb95451744"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
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
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
});
