// This script handles the chat functionality
// It sends a message to the server and receives a stream response
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
let currentStreamReader = null;
// Function to add or update a message in the chat
function addOrUpdateMessage(content, sender, isUpdate = false) {
    let messageDiv;
    if(!isUpdate) {
        // Create a new message if it doesn't exist
        messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user');
        messageDiv.textContent = content;
        chatContainer.appendChild(messageDiv);
        messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot');
        chatContainer.appendChild(messageDiv);
    }
    if (isUpdate) {
        // Find the last message from the bot and update its content
        const messages = chatContainer.getElementsByClassName(sender);
        if (messages.length > 0) {
            messageDiv = messages[messages.length - 1];
            messageDiv.textContent = content;
        }
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Handle send button click
sendButton.addEventListener('click', async () => {
    stopStream(); // Stop the existing stream if any
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Add user message to chat
    addOrUpdateMessage(userMessage, 'user');
    messageInput.value = '';

    // Send message to server
    try {
        const response = await fetch('http://localhost:3000/ollama/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ msg: userMessage })
        });

        // Check if the response body is a readable stream
        const reader = response.body.getReader();
        currentStreamReader = reader; // Track the current stream reader
        const decoder = new TextDecoder('utf-8');
        let result = '';

        // Read the stream
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Decode the chunk and append it to the result
            const chunk = decoder.decode(value, { stream: true });
            result += JSON.parse(chunk).message?.content?.replace(/\*/g, '<br>') || '';

            // Update the bot's message dynamically
            addOrUpdateMessage(result, 'bot', true);
        }
    } catch (error) {
        console.error('Error:', error);
        addOrUpdateMessage('Error: Unable to connect to server.', 'bot');
    }
});

// Handle Enter key press
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});
// Function to stop the existing stream
function stopStream() {
    if (currentStreamReader) {
        currentStreamReader.cancel(); // Cancel the current stream
        currentStreamReader = null; // Reset the stream reader
        console.log('Stream stopped.');
    }
}