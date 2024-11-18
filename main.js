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
const nicknameInput = document.getElementById('nicknameInput');
const typingIndicator = document.getElementById('typingIndicator');

let userNickname = '';

nicknameInput.addEventListener('change', (event) => {
    userNickname = event.target.value;
    console.log(`Nickname set to: ${userNickname}`); // Debug log
});

const chatRef = ref(database, 'chat'); // Reference for chat messages

// Show typing indicator when user is typing
chatInput.addEventListener('input', () => {
    typingIndicator.classList.remove('hidden');
    clearTimeout(typingIndicator.timeout);
    typingIndicator.timeout = setTimeout(() => {
        typingIndicator.classList.add('hidden');
    }, 1000); // Adjust timing as needed
});

// Send chat message
sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message && userNickname) {
        const timestamp = new Date().toISOString();
        console.log(`Sending message: ${message} at ${timestamp}`); // Debug log
        const newMessageRef = push(chatRef, { nickname: userNickname, message, timestamp });
        newMessageRef.then(() => {
            console.log('Message sent successfully');
            // Add status indicator to the sent message
            const messageElement = document.createElement('div');
            messageElement.textContent = `${userNickname}: ${message} (${timestamp})`;
            const statusElement = document.createElement('div');
            statusElement.className = 'message-status';
            statusElement.textContent = 'Sent';
            messageElement.appendChild(statusElement);
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
        }).catch((error) => {
            console.error('Error sending message:', error);
        });
        chatInput.value = ''; // Clear the input field
    } else {
        console.log('No message to send or nickname not set'); // Debug log
    }
});

// Receive chat messages
onChildAdded(chatRef, (snapshot) => {
    const data = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.nickname || 'Anonymous'}: ${data.message} (${data.timestamp})`;
    console.log(`Received message: ${data.message} at ${data.timestamp}`); // Debug log
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
});
