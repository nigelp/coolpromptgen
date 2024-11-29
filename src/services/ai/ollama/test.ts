import { OllamaAPI } from './api';

async function testGenerate() {
  const api = new OllamaAPI('127.0.0.1:11434');
  try {
    const response = await fetch(`${api.getBaseUrl()}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'phi3:3.8b-mini-128k-instruct-q5_K_S',
        prompt: 'What is water made of?'
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Test generate response:', data);
    return true;
  } catch (error) {
    console.error('Test generate failed:', error);
    return false;
  }
}

async function testOllamaConnection() {
  const api = new OllamaAPI('127.0.0.1:11434');
  
  try {
    console.log('Testing Ollama connection...');
    const [models, generateTest] = await Promise.all([
      api.listModels(),
      testGenerate()
    ]);
    
    if (!generateTest) {
      throw new Error('Generate test failed');
    }
    
    console.log('Connection successful! Available models:', models);
    return true;
  } catch (error) {
    console.error('Ollama connection test failed:', error);
    return false;
  }
}

export { testOllamaConnection };