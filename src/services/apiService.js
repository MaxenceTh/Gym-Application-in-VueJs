import axios from "axios";


const API_URL = "https://api.api-ninjas.com/v1/exercises";
const API_KEY = import.meta.env.VITE_NINJA_API_KEY; 

const apiService = {
  async getExercises(queryParams = {}) {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          "X-Api-Key": API_KEY, 
        },
        params: queryParams, // Example : { muscle: "quadriceps" }
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des exercices :", error);
      throw error;
    }
  },
};

export default apiService;