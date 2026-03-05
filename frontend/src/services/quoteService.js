// src/services/quoteService.js
import axios from 'axios';

// Kandiro proxy bach n-tfadaw machakil dyal CORS f l-browser
const API_URL = 'https://api.allorigins.win/raw?url=https://zenquotes.io/api/random';

export const quoteService = {
  getRandomQuote: async () => {
    try {
      const response = await axios.get(API_URL);
      // ZenQuotes k-t-rj3 array fih object: [{ q: "text", a: "author" }]
      return {
        text: response.data[0].q,
        author: response.data[0].a,
        error: false
      };
    } catch (error) {
      console.error("API Error:", error);
      return {
        text: "Believe in yourself and all that you are.", // Quote dyal reserve
        author: "Success Bot",
        error: true
      };
    }
  }
};