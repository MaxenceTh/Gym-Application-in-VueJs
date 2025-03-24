<script setup>
import { ref, onMounted } from "vue";
import apiService from "../services/apiService";

const exercises = ref([]);
const error = ref(null);

onMounted(async () => {
  try {
    // Exemple : Récupérer les exercices pour les quadriceps
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
