
<script setup>

const exercise = {
    abdominals: 'abdominals',
    abductors: 'abductors',
    biceps: 'biceps',
    calves: 'calves',
    chest: 'chest',
    forearms: 'forearms',
    glutes: 'glutes',
    hamstrings: 'hamstrings', 
    lats: 'lats',
    lower_back: 'lower_back',
    middle_back: 'middle_back',
    neck: 'neck',
    quadriceps: 'quadriceps', 
    traps: 'traps',
    triceps: 'triceps',
}

defineProps(['selected']);  // Recevoir la valeur sélectionnée du parent
const emit = defineEmits(['update:selected']);  // Déclarer l'événement à émettre

const handleChange = (event) => {
  const newValue = event.target.value;
  emit('update:selected', newValue);  // Émettre la nouvelle valeur au parent
};
</script>


<template>
    <label>Choose an muscles:</label>
    <select id="exercise"  @change="handleChange" :value="selected">
        <option v-for="(label, key) in exercise" :key="key" :value="label">
            {{ label }}
        </option>
    </select>
</template>