# Ollama: Simplified Local LLM Execution

Ollama is a free, open-source platform that simplifies running large language models (LLMs) locally on your computer.

## Download and Install
Download Ollama from the link below:
[Download Ollama](https://ollama.com/download)

## Supported Models
View the list of supported models on Ollama's GitHub page:
[Supported Models](https://github.com/ollama/ollama?tab=readme-ov-file#model-library)

## Running a Model
Once you choose a model based on your system configuration, run the following command in your terminal:

ollama run {model_name}
If the model is already installed, this will run it.
If the model is not installed, the command will download and run it.
Example:
ollama run llama3.2

## Downloading Models to a Specific Location
To specify a download location for models, set the following environment variables:

Windows: OLLAMA_MODELS=desired_location
Mac/Linux: export OLLAMA_MODELS=/path/to/your/models

## Starting Services
Start as HTTP Service: Run the command below in your terminal:
ollama serve

Start as Chat Agent: Run the model with the command:
ollama run {model_name}

Encouragement
If you've completed all the above steps, stop and pat yourself on the back. Then remind yourself: "We still have work to do... Continue!"

## Pre-requisites
Install Node.js (version 16 or above).
Navigate to the root folder and run:
npm install
This will install all dependencies listed in the package.json file.

## Running the Application
Start the Node.js server:
node server.js
Open the index.html file in any browser.
Note: This is a static HTML file containing JavaScript code to connect to the Node.js service.
The file makes the required API calls to the Ollama HTTP service.
