import axios, { AxiosResponse } from 'axios';
import { Auth } from './Auth';

const API_BASE_URL = 'https://oauth.deriv.com/oauth2/';
const REDIRECT_URI = 'http://localhost:3000/callback'; // Replace with your actual redirect URI
const APP_ID = 52558;

const AuthService = {

  login: async () => {
    const params = new URLSearchParams();
    params.append('app_id', APP_ID); 
    params.append('redirect_uri', REDIRECT_URI);

    const authorizeUrl = `${API_BASE_URL}/authorize?${params}`;

    // Redirect the user to the authorization endpoint
    window.location.href = authorizeUrl;
  },

  // Handle the callback from Deriv's authorization server
  handleCallback: async () => {
    const { code } = new URLSearchParams(window.location.search);

    try {
      const response = await axios.post(`${API_BASE_URL}/token`, {
        code,
        client_id: 'your_app_id', // Replace with your app ID
        client_secret: 'your_app_secret', // Replace with your app secret
        redirect_uri: REDIRECT_URI,
      });

      const authService = new Auth();
      Auth.setToken(response.data);
      Auth.setUser(response.data);

      return response.data;
    } catch (error) {
      throw new Error(error?.message || "Error fetching access token");
    }
  },

};

export default AuthService;
