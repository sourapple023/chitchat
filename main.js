const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatRef = firebase.database().ref('chat'); // Reference for chat messages

// Send chat message
sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        const timestamp = new Date().toISOString();
        chatRef.push({ message, timestamp });
        chatInput.value = ''; // Clear the input field
    }
});

// Receive chat messages
chatRef.on('child_added', (snapshot) => {
    const data = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.timestamp}: ${data.message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
});
