import axios from "axios";


const API_URL = "https://api.api-ninjas.com/v1/exercises";
const API_KEY = import.meta.env.VITE_NINJA_API_KEY; // Remplace par ta clé API

const apiService = {
  async getExercises(queryParams = {}) {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          "X-Api-Key": API_KEY, // Inclusion de la clé API
        },
        params: queryParams, // Exemple : { muscle: "quadriceps" }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des exercices :", error);
      throw error;
    }
  },
};

export default apiService;