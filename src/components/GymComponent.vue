<script setup>
import { ref, onMounted, watch } from "vue";
import apiService from "../services/apiService";
import SelectComponent from "./SelectComponent.vue";



const selectedExerciseType = ref('biceps');  
const exercises = ref([]);
const error = ref(null);
const myExercicesTab = ref([]);
const myExercise = ref();
const expandedExerciseId = ref();

const difficultyOrder = { "beginner": 1, "intermediate": 2, "expert": 3 };
const sortAscending = ref(true);


// Get API exercises
const fetchExercises = async () => {
  try {
    exercises.value = await apiService.getExercises({ muscle: selectedExerciseType.value });
  } catch (err) {
    error.value = err.message;
  }
}

// Call API when it's mounted
onMounted(() => {
  fetchExercises();
});


// Call API everytime 'selectedExerciseType' change
watch(selectedExerciseType, fetchExercises);


const addMyExercises = (exercise) => {
  
  myExercicesTab.value.push(exercise);
}
const removeMyExercise = (exercise) => {
  myExercicesTab.value = myExercicesTab.value.filter(e => e.name !== exercise.name );
}

const sortedDifficulty = () => {
  myExercicesTab.value.sort((a, b) => {
    return sortAscending.value
      ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
  });

  // Inverser l'ordre pour le prochain clic
  sortAscending.value = !sortAscending.value;
}

</script>

<template>
  <div>
    <!-- v-model: liaison bi -->
    <SelectComponent v-model:selected="selectedExerciseType" />
    

    <h2>Exercices for {{ selectedExerciseType }}</h2>
    <p v-if="error">Erreur : {{ error }}</p>
    <ul v-else>
      <li v-for="exercise in exercises" :key="exercise.name">
        <form @submit.prevent="addMyExercises(exercise)">
          {{ exercise.name }} - {{ exercise.type }}
          <button type="submit">Add</button>
        </form>   
      </li> 
    </ul>
    

    <div  v-if="myExercicesTab.length !== 0">
    <h2>My training</h2>
    <!-- <ul>
      <li v-for="exercise in myExercicesTab" :key="exercise.id">
        <strong>{{ exercise.name }}</strong> - {{ exercise.equipment }} - {{ exercise.type }} - {{ exercise.difficulty }}
        <button @click="removeMyExercise(exercise)">Remove</button>
      </li>
    </ul> -->

    <table>
    <thead>
      <tr>
        <th>Nom</th>
        <th>Équipement</th>
        <th>Type</th>
        <th>Difficulté <button @click="sortedDifficulty">></button></th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="exercise in myExercicesTab" :key="exercise.id">
        <td><strong>{{ exercise.name }}</strong></td>
        <td>{{ exercise.equipment }}</td>
        <td>{{ exercise.type }}</td>
        <td>{{ exercise.difficulty }}</td>
        <td><button @click="removeMyExercise(exercise)">Remove</button></td>
      </tr>
    </tbody>
  </table>
</div>

  </div>
</template>
