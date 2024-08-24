import axios from 'axios';
import Cookies from 'js-cookie';

export const BASE_URL = 'http://localhost:8081'; 
function getEndpointURL(endpoint) {
    return `${BASE_URL}/api/users/${endpoint}`;
}



export async function validateEmail (email, encryptedEmail)  {
  try {
    const response = await axios.post(getEndpointURL(`tester`), { email }, {
      params: { email: encryptedEmail },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la validation de l\'email:', error);
    throw error;
  }
};

export async function loginUser (loginData) {
  try {
    const response = await axios.post(getEndpointURL(`login`), loginData);
    Cookies.set('token', response.data.token);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export async function logoutUser()  {
  try {
    await axios.post(getEndpointURL(`logout`));
    Cookies.remove('token');
  } catch (error) {
    throw error.response.data.message;
  }
};
