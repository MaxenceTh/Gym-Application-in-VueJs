<script setup>
import { ref, onMounted, watch } from "vue";
import apiService from "../services/apiService";
import SelectComponent from "./SelectComponent.vue";

// Reactive references for exercise type, list of exercises, and user selected exercises
const selectedExerciseType = ref('biceps');
const exercises = ref([]);
const error = ref(null);
const myExercicesTab = ref([]);
const myExercise = ref();
const expandedExerciseId = ref();

// Difficulty levels mapped to values for sorting
const difficultyOrder = { "beginner": 1, "intermediate": 2, "expert": 3 };
const sortAscending = ref(true);

// Reference for the selected exercise when showing instructions
const selectedExercise = ref();

// Object to store set & rep values for each exercise
const setsReps = ref({});

// Fetch exercises based on selected muscle type from the API
const fetchExercises = async () => {
  try {
    exercises.value = await apiService.getExercises({ muscle: selectedExerciseType.value });
  } catch (err) {
    error.value = err.message;
  }
}

// Call the fetch function when the component is mounted
onMounted(() => {
  fetchExercises();
});

// Re-fetch exercises whenever 'selectedExerciseType' changes
watch(selectedExerciseType, fetchExercises);

// Add the selected exercise to 'myExercicesTab' and remove it from available exercises
const addMyExercises = (exercise) => {
  myExercicesTab.value.push(exercise);
  exercises.value = exercises.value.filter(e => e.name !== exercise.name);
}

// Remove the exercise from 'myExercicesTab' and add it back to available exercises
const removeMyExercise = (exercise) => {
  if (!exercises.value.some(e => e.name === exercise.name)) {
    exercises.value.push(exercise);
  }
  myExercicesTab.value = myExercicesTab.value.filter(e => e.name !== exercise.name);
}

// Sort 'myExercicesTab' by exercise difficulty in ascending or descending order
const sortedDifficulty = () => {
  myExercicesTab.value.sort((a, b) => {
    return sortAscending.value
      ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
  });

  // Reverse the sort order for the next click
  sortAscending.value = !sortAscending.value;
}

// Show exercise instructions in a popup
const showInstructions = (exercise) => {
  selectedExercise.value = exercise;
};

// Close the instructions popup
const closePopup = () => {
  selectedExercise.value = null;
};

// Download the training plan as a text file
const downloadTrainning = () => {
  let content = "📋 My Training Plan\n\n";

  // Loop through the selected exercises and prepare the content
  myExercicesTab.value.forEach((exercise, index) => {
    const setRep = setsReps.value[exercise.name] || "N/A";
    content += `${index + 1}. ${exercise.name} - ${exercise.type}\n`;
    content += `   🔹 Set & Rep: ${setRep}\n`;
    content += `   🔹 Equipment: ${exercise.equipment}\n`;
    content += `   🔹 Difficulty: ${exercise.difficulty}\n`;
    content += `   🔹 Instructions: ${exercise.instructions}\n\n`;
  });

  // Create a blob for the file download
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "training_plan.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

</script>

<template>
  <div>
    <!-- Exercise type selection dropdown component -->
    <SelectComponent v-model:selected="selectedExerciseType" />

    <h2>Exercices for {{ selectedExerciseType }}</h2>
    <p v-if="error">Error: {{ error }}</p>
    <ul v-else>
      <li v-for="exercise in exercises" :key="exercise.name">
        <form @submit.prevent="addMyExercises(exercise)">
          {{ exercise.name }} - {{ exercise.type }}
          <button type="submit">Add</button>
        </form>
      </li>
    </ul>

    <div>
      <h2>My Training</h2>
      <table>
        <thead>
          <tr>
            <th>Set & Rep</th>
            <th>Name</th>
            <th>Equipment</th>
            <th>Type</th>
            <th>Difficulty</th>
            <th>Instructions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exercise in myExercicesTab" :key="exercise.id">
            <td><input type="text" v-model="setsReps[exercise.name]" placeholder="ex: 4x10"></td>
            <td><strong>{{ exercise.name }}</strong></td>
            <td>{{ exercise.equipment }}</td>
            <td>{{ exercise.type }}</td>
            <td>{{ exercise.difficulty }}</td>
            <td><button @click="showInstructions(exercise)">See</button></td>
            <td><button @click="removeMyExercise(exercise)">Remove</button></td>
          </tr>
        </tbody>
      </table>
      <button @click="sortedDifficulty">Sort by difficulty</button>
      <button @click="downloadTrainning">Download</button>
    </div>

    <!-- Modal to show instructions for an exercise -->
    <div v-if="selectedExercise" class="modal">
      <div class="modal-content">
        <h3>{{ selectedExercise.name }}</h3>
        <p>{{ selectedExercise.instructions }}</p>
        <button @click="closePopup">Close</button>
      </div>
    </div>

  </div>
</template>

<style>

</style>
