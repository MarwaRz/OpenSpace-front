

import axios from 'axios';

export const BASE_URL = 'http://localhost:8081'; 

function getEndpointURL(endpoint) {
    return `${BASE_URL}/api/segments/${endpoint}`;
}

export const updateSegment= async (id, segmentData) => {
  try {
    const response = await axios.put(getEndpointURL(id), segmentData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du segment:', error);

    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Erreur lors de la mise à jour du segment.');
    }
  }
};

export const updateSegmentb= async(segmentId, code, plateauId) =>{
    try {
      const response = await axios.put(`${BASE_URL}/api/segments/${segmentId}`, { code, plateauId });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du segment:', error.response?.data?.error || error.message);
      throw error;
    }
  }
  


export async function getAllSegments() {
    try {
        const url = getEndpointURL('listseg');
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des segments');
        }
        const segments = await response.json();
        return segments;
    } catch (error) {
        console.error('Erreur:', error.message);
        throw error;
    }
}
export async function getPostesBySegmentId(segmentId) {
    try {
      const response = await fetch(`${BASE_URL}/api/postes/seg/${segmentId}/postes`);
      if (!response.ok) {
        throw new Error('Erreur');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur :', error);
      throw error;
    }
  }

export async function getSegmentById(id) {
    try {
        const url = getEndpointURL(id);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Segment non trouvé');
        }
        const segment = await response.json();
        return segment;
    } catch (error) {
        console.error('Erreur:', error.message);
        throw error;
    }
}

export async function  addSegment (segmentData) {
    try {
        const url = getEndpointURL('');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(segmentData)
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la création du segment');
        }
        const newSegment = await response.json();
        return newSegment;
    } catch (error) {
        console.error('Erreur:', error.message);
        throw error;
    }
}

export async function addPoste(segmentId, posteData) {
    try {
        const url = getEndpointURL(`add/${segmentId}`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(posteData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Erreur lors de l\'ajout du poste';
            throw new Error(errorMessage);
        }

        const newPoste = await response.json();
        return newPoste;
    } catch (error) {
        console.error('Erreur:', error.message);
        throw error;
    }
}





export async function deleteSegment(id) {
    try {
        const url = getEndpointURL(id);
        const response = await fetch(url, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du segment');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur:', error.message);
        throw error;
    }
}
