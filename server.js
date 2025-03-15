const express = require('express');
const axios = require('axios');
const { Readable } = require('stream');
// Create an Express app
const app = express();
app.use(express.json());
//Defult location for ollama. but if it different on your machine please update the variables accordingly
const OLLAMA_API_URL_gen =  'http://127.0.0.1:11434/api/generate'; 
const OLLAMA_API_URL_chat = 'http://127.0.0.1:11434/api/chat';
//update the model name if you are using a different model
const model="llama3.2";
// To allow API calls from the file location
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
// Function to chat with Ollama
async function chatOllama(msg,res) {
    try {
        const response = await axios.post(OLLAMA_API_URL_chat, {
            "model": model,
            "messages": [{"role": "user", "content": msg}]
        }, { responseType: 'stream' }); // Set responseType to 'stream'

         // Set headers for streaming response
         res.setHeader('Content-Type', 'text/plain');

         // Create a readable stream
         const stream = new Readable({
             read() {} // No-op read function
         });
 
         // Pipe the readable stream to the response
         stream.pipe(res);
 
         // Process the incoming stream from Ollama
         response.data.on('data', (chunk) => {
             stream.push(chunk.toString()); // Push each chunk to the readable stream
         });
 
         response.data.on('end', () => {
             console.log('Stream ended');
             stream.push(null); // Signal the end of the stream
         });
 
         response.data.on('error', (err) => {
             console.error('Stream error:', err.message);
             stream.destroy(err); // Destroy the stream on error
         });
    } catch (error) {
        console.error('Error querying Ollama:', error.message);
        res.status(500).send('Error querying Ollama');
    }
}
// Function to send a prompt to Ollama
async function genOllama(prompt) {
    try {
        const response = await axios.post(OLLAMA_API_URL_gen, {
            "model": model, 
            "prompt": prompt
        });
        return response.data
    } catch (error) {
        console.error('Error querying Ollama:', error.message);
    }
}

// Define a route
app.post('/ollama/chat', async (req, res) => {
    console.log("/ollama/chat");
    const msg = req?.body?.msg || 'Tell me a joke';
    chatOllama(msg,res); // Wait for the full stream response
});
app.post('/ollama/gen', (req, res) => {
    genOllama('Tell me a joke');
    res.send('Hello, World!');
});

// Define the port
const PORT = 3000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
