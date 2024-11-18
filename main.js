import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded, set, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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
const auth = getAuth(app);
const database = getDatabase(app);

// Handle user state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log(`User signed in: ${user.email}`);
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'block';
    } else {
        // No user is signed in
        document.getElementById('authContainer').style.display = 'block';
        document.getElementById('chatContainer').style.display = 'none';
    }
});

// Sign up
document.getElementById('signupButton').addEventListener('click', () => {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(`User signed up: ${user.email}`);
            set(ref(database, 'users/' + user.uid), {
                email: user.email,
                nickname: userNickname
            });
        })
        .catch((error) => {
            console.error('Error signing up:', error);
        });
});

// Log in
document.getElementById('loginButton').addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(`User logged in: ${user.email}`);
        })
        .catch((error) => {
            console.error('Error logging in:', error);
        });
});

// Chat functionality
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

// Function to send chat message
function sendMessage() {
    const message = chatInput.value.trim();
    if (message && userNickname) {
        const timestamp = new Date().toISOString();
        const user = auth.currentUser;
        console.log(`Sending message: ${message} at ${timestamp}`); // Debug log
        const newMessageRef = push(chatRef, {
            nickname: userNickname,
            message,
            timestamp,
            userId: user.uid
        });
        newMessageRef.then(() => {
            console.log('Message sent successfully');
        }).catch((error) => {
            console.error('Error sending message:', error);
        });
        chatInput.value = ''; // Clear the input field
    } else {
        console.log('No message to send or nickname not set'); // Debug log
    }
}

// Send chat message on button click
sendButton.addEventListener('click', sendMessage);

// Send chat message on pressing "Enter"
chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
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
