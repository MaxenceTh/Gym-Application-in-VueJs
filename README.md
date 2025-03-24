# 🏋️ Gym Application - Vue.js Tutorial
## 📌 Goal
Create a small project to learn Vue.js by integrating an exercise API.

## 🚀 Project Setup
### 1️⃣ Create the Project with Vite
Run the following command to generate a Vue.js project using Vite:  
```sh
npm create vite@latest application-name --template vue
```
Then, install the dependencies:
```sh
cd  application-name
npm install
```
### 2️⃣ Using the Ninja API (Exercises)
We'll use the Ninja Exercises API to retrieve data on exercises:
https://www.api-ninjas.com/api/exercises
Add your API key in a .env file
```ini
VITE_NINJA_API_KEY=your_api_key
```

---------------------------------------------------------

## 🔌 API - Exercise Calls
Create an API service to centralize the HTTP requests (src/services/apiService.js):
```javascript
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
        params: queryParams, 
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des exercices :", error);
      throw error;
    }
  },
};

export default apiService;

```
Then, use this service in a Vue component:
```vue
<script setup>
import { ref, onMounted } from "vue";
import apiService from "../services/apiService";

const exercises = ref([]);
const error = ref(null);

onMounted(async () => {
  try {
    exercises.value = await apiService.getExercises({ type: "cardio" });
  } catch (err) {
    error.value = err.message;
  }
});
</script>

<template>
  <div>
    <h2>Exercices</h2>
    <p v-if="error">Erreur : {{ error }}</p>
    <ul v-else>
      <li v-for="exercise in exercises" :key="exercise.name">
        {{ exercise.name }} - {{ exercise.type }}
      </li>
    </ul>
  </div>
</template>


```