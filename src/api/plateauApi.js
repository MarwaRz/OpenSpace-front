import axios from 'axios'; 

export const BASE_URL = 'http://localhost:8081'; 

function getEndpointURL(endpoint) {
    return `${BASE_URL}/api/plateaux/${endpoint}`;
}




export async function delete_email_plateau(plateauId, emailValueToDelete) {
  try {
    const response = await axios.delete(getEndpointURL(`${plateauId}/${emailValueToDelete}`));
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'email du plateau:', error);
    throw error;
  }
}




export async function getReservationsForPlateau(plateauId) {
  try {
    const response = await axios.get(getEndpointURL(`${plateauId}/reservations`));
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations du plateau:', error);
    throw error;
  }
}


export async function getSegmentsByPlateauId(plateauId) {
  try {
    const response = await axios.get(getEndpointURL(`${plateauId}/segments`));
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des segments du plateau:', error);
    throw error;
  }
}
export async function addEmailsToPlateau  (plateauId, emails)  {
  try {
    const response = await axios.post(getEndpointURL(`${plateauId}/emails`), { emails });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l ajout d emails :', error);
    throw error;
  }
};


export async function getPlateaux() {
    try {
      const response = await axios.get(getEndpointURL(''));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des plateaux:', error);
      throw error;
    }
  }

  
export async function getPlateau(plateauId) {
  try {
      const url = getEndpointURL(plateauId);
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
  
  
  
  export async function addSegmentToPlateau(plateauId, segmentData) {
    try {
      const url = getEndpointURL(`${plateauId}/segments`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(segmentData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Erreur lors de l\'ajout du segment';
        throw new Error(errorMessage);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du segment:', error.message);
      throw error;
    }
  }
  
 
  export async function updatePlateau(plateauId, updatedData) {
    try {
      const response = await axios.put(getEndpointURL(`${plateauId}`), updatedData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Le nom de ce plateau existe déjà';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
  
  export async function addPlateau(plateauData) {
    try {
      const response = await axios.post(getEndpointURL(''), plateauData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erreur lors de l\'ajout du plateau';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

export async function deletePlateau(plateauId) {
    try {
        const response = await axios.delete(getEndpointURL(`${plateauId}`));
      
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du plateau :', error);
        throw error;
    }
}