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

## Gym Component

This component allows users to select exercises based on a specific muscle group, customize their training plan with sets and reps, and then download their customized workout as a text file. It includes functionalities to add exercises, remove exercises, view exercise instructions, and sort exercises by difficulty.

### Features

- **Exercise Selection**: Users can select an exercise type (e.g., biceps, legs) from a dropdown. The component fetches a list of exercises from an external API based on the selected muscle group.

- **Exercise Customization**: Users can add exercises to their personalized training plan, specifying sets and reps for each exercise. They can remove exercises from their plan as well.

- **Exercise Sorting**: The user can sort exercises in their training plan by difficulty (beginner, intermediate, expert).

- **Exercise Instructions**: Clicking on a button opens a popup displaying instructions for each exercise.

- **Training Plan Download**: The user can download their training plan as a `.txt` file, which includes the exercise name, type, equipment, difficulty, instructions, and sets/reps.

### Structure

The component is divided into several sections:

#### Data Fetching

- The list of exercises is fetched from an external API based on the selected muscle group.
- The `selectedExerciseType` state controls which muscle group is selected.

#### Exercise Management

- Exercises can be added or removed from the user's personal training plan (`myExercicesTab`).
- Each exercise in the plan has an associated set/reps input field.

#### Sorting

- The `sortedDifficulty` method sorts the exercises in the training plan by difficulty.
- A toggle button is used to switch between ascending and descending sorting.

#### Instructions Popup

- Clicking the "See" button for an exercise shows a modal with the exercise's instructions.

#### File Download

- The `downloadTrainning` method creates a text file containing the details of the user's training plan (exercise name, type, equipment, difficulty, sets/reps, and instructions).
- The file is automatically downloaded when the "Download" button is clicked.
