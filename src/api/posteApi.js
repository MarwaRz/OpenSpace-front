import axios from 'axios'; 

export const BASE_URL = 'http://localhost:8081'; 
function getEndpointURL(endpoint) {
    return `${BASE_URL}/api/postes/${endpoint}`;
}


export async function cancelReservationSalle(reservationId, email) {
    try {
      const response = await axios.delete(getEndpointURL(`annuler_reservation/${reservationId}`), {
        params: {
          email: email
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  export async function getReservedSalle(email) {
    try {
        const response = await axios.get(getEndpointURL('salle'), {
            params: { email }
        });
        return response.data; 
    } catch (error) {
        throw error; 
    }
}





export async function getReservedPosts(email) {
    try {
        const response = await axios.get(getEndpointURL('poste'), {
            params: { email }
        });
        return response.data; 
    } catch (error) {
        throw error; 
    }
}

export async function cancelReservation(idPoste, encryptedEmail) {
    try {
        const response = await axios.delete(getEndpointURL(`cancel-other/${idPoste}`), {
            params: { email: encryptedEmail }
        });
        return response.data; 
    } catch (error) {
        throw error; 
    }
}



export async function reserveSalle  (postId, encryptedEmail, startTime, endTime , date) {
    try {
        const url = getEndpointURL(`reserve_salle/${postId}`);
        const response = await axios.post(url, { startTime, endTime,date }, {
            params: { email: encryptedEmail },
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data || error.message;
        throw new Error(errorMessage);
    }
};



export async function getReservationsForPost  (postId)  {
    try {
        const url = getEndpointURL(`${postId}/reservations`);
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export async function reservePoste  (postId, encryptedEmail)  {
    try {
        const url = getEndpointURL(`reserve/${postId}`);
        const response = await axios.post(url, null, {
            params: { email: encryptedEmail },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export async function getAllPostes() {
    try {
        const url = getEndpointURL('list');
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des postes');
        }
        const postes = await response.json();
        return postes;
    } catch (error) {
        throw error;
    }
}

export async function getPosteById(id) {
    try {
        const url = getEndpointURL(id);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Poste non trouvé');
        }
        const poste = await response.json();
        return poste;
    } catch (error) {
        console.error('Erreur:', error.message);
        throw error;
    }
}



export async function updatePoste(id, posteData) {
    try {
        const url = getEndpointURL(id);
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(posteData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message ;
            throw new Error(errorMessage);
        }
        const updatedPoste = await response.json();
        return updatedPoste;
    } catch (error) {
        console.error('Erreur:', error.message);
        throw error;
    }
}



export async function deletePosteById  (posteId)  {
    try {
      console.log('Deleting poste with id:', posteId);
      const response = await axios.delete(`/api/postes/${posteId}`);
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting poste:', error);
      throw error;
    }
  };
export async function deletePoste(id) {
    try {
        const url = getEndpointURL(id);
        const response = await fetch(url, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du poste');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error.message);
        throw error;
    }
}
