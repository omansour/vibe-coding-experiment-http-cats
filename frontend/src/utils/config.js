import axios from 'axios';

// Load configuration from config.json
export const loadConfig = async () => {
  try {
    const response = await axios.get('/config.json');
    
    // Handle OpenTofu output format (nested objects with .value)
    const data = response.data;
    return {
      apiEndpoint: data.api_endpoint?.value || data.api_endpoint,
      apiKey: data.api_key?.value || data.api_key
    };
  } catch (error) {
    console.error('Error loading config:', error);
    // Fallback to development configuration
    return {
      apiEndpoint: 'http://localhost:3001',
      apiKey: 'dev-key'
    };
  }
};
