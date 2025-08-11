<script setup lang="ts">
import type { Exercise } from '~/models/training'
import { ref, watch } from 'vue'
import { useTrainingStore } from '~/stores/training'

const trainingStore = useTrainingStore()

enum Phase {
  EXERCISE_INPUT = 'exercise_input',
  TIMER_RUNNING = 'timer_running',
  SET_DETAILS = 'set_details',
  NEXT_ACTION = 'next_action',
}

const isShow = defineModel<boolean>('isShow', {
  default: false,
})

const timer = ref(0)
const intervalId = ref<NodeJS.Timeout | null>(null)

const currentPhase = ref<Phase>(Phase.EXERCISE_INPUT)

const exerciseName = ref('')
const reps = ref<number | null>(null)
const weight = ref<number | null>(null)

const currentExercise = ref<Exercise | null>(null)
const exercises = ref<Exercise[]>([])

function startTimer() {
  timer.value = 0
  currentPhase.value = Phase.TIMER_RUNNING
  intervalId.value = setInterval(() => {
    timer.value += 0.1
  }, 100)
}

function stopTimer() {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value)
    intervalId.value = null
    currentPhase.value = Phase.SET_DETAILS
  }
}

function startExercise() {
  if (!exerciseName.value.trim())
    return

  currentExercise.value = {
    name: exerciseName.value,
    sets: [],
  }
  startTimer()
}

function saveSet() {
  if (!currentExercise.value || reps.value === null || weight.value === null)
    return

  currentExercise.value.sets.push({
    reps: reps.value,
    weight: weight.value,
    duration: Math.round(timer.value * 10) / 10,
    timestamp: new Date(),
  })

  reps.value = null
  weight.value = null

  currentPhase.value = Phase.NEXT_ACTION
}

function nextSet() {
  currentPhase.value = Phase.TIMER_RUNNING
  startTimer()
}

function nextExercise() {
  if (currentExercise.value) {
    // Add current exercise to store
    trainingStore.addExerciseToSession(currentExercise.value)
  }

  // Reset for new exercise
  exerciseName.value = ''
  currentExercise.value = null
  currentPhase.value = Phase.EXERCISE_INPUT
}

function finishTraining() {
  if (currentExercise.value) {
    // Add final exercise to store
    trainingStore.addExerciseToSession(currentExercise.value)
  }

  // Finish the training session
  trainingStore.finishSession()

  resetDialog()
  isShow.value = false
}

function resetDialog() {
  stopTimer()
  currentPhase.value = Phase.EXERCISE_INPUT
  exerciseName.value = ''
  reps.value = null
  weight.value = null
  currentExercise.value = null
  exercises.value = []
  timer.value = 0
}

watch(isShow, (newVal) => {
  if (newVal) {
    resetDialog()
    // Start new training session
    trainingStore.startNewSession()
  }
  else {
    stopTimer()
  }
})
</script>

<template>
  <v-dialog
    v-model="isShow"
    persistent
    max-width="500"
  >
    <v-card class="pa-4">
      <v-card-title class="text-center">
        {{ $t("training.form.title") }}
      </v-card-title>

      <v-card-text>
        <div
          v-if="currentPhase === Phase.EXERCISE_INPUT"
          class="d-flex flex-column align-center"
        >
          <v-text-field
            v-model="exerciseName"
            :label="$t('training.form.exerciseName')"
            variant="outlined"
            class="mb-4"
            @keyup.enter="startExercise"
          />

          <v-btn
            color="primary"
            :disabled="!exerciseName.trim()"
            size="large"
            @click="startExercise"
          >
            {{ $t("training.form.start") }}
          </v-btn>
        </div>

        <div
          v-else-if="currentPhase === Phase.TIMER_RUNNING"
          class="d-flex flex-column align-center"
        >
          <div class="text-h5 mb-4">
            {{ currentExercise?.name }}
          </div>

          <div class="text-subtitle-1 mb-4">
            {{ $t("training.form.set") }} {{ (currentExercise?.sets.length || 0) + 1 }}
          </div>

          <v-progress-circular
            color="primary"
            size="120"
            :width="12"
            indeterminate
            class="mb-4"
          />

          <div class="text-h6 mb-4">
            {{ $t("training.form.time") }}: {{ Math.round(timer * 10) / 10 }}
          </div>

          <v-btn
            color="success"
            size="large"
            @click="stopTimer"
          >
            {{ $t("training.form.stop") }}
          </v-btn>
        </div>

        <div
          v-else-if="currentPhase === Phase.SET_DETAILS"
          class="d-flex flex-column align-center"
        >
          <div class="text-h6 mb-4">
            {{ currentExercise?.name }}
          </div>

          <div class="text-subtitle-2 mb-4">
            {{ $t("training.form.time") }}: {{ Math.round(timer * 10) / 10 }}
          </div>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="reps"
                :label="$t('training.form.reps')"
                type="number"
                variant="outlined"
                min="1"
              />
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model.number="weight"
                :label="$t('training.form.weight')"
                type="number"
                variant="outlined"
                min="0"
                step="0.5"
                suffix="kg"
              />
            </v-col>
          </v-row>

          <v-btn
            color="primary"
            :disabled="reps === null || weight === null"
            size="large"
            @click="saveSet"
          >
            {{ $t("training.form.saveSet") }}
          </v-btn>
        </div>

        <div
          v-else-if="currentPhase === Phase.NEXT_ACTION"
          class="d-flex flex-column align-center"
        >
          <div class="text-h6 mb-4">
            {{ currentExercise?.name }}
          </div>

          <div class="text-subtitle-2 mb-4">
            {{ $t("training.form.setsCompleted") }}: {{ currentExercise?.sets.length }}
          </div>

          <div class="d-flex flex-column gap-3 w-100">
            <v-btn
              color="primary"
              size="large"
              block
              @click="nextSet"
            >
              {{ $t("training.form.nextSet") }}
            </v-btn>

            <v-btn
              color="secondary"
              size="large"
              block
              @click="nextExercise"
            >
              {{ $t("training.form.nextExercise") }}
            </v-btn>

            <v-btn
              color="success"
              size="large"
              block
              @click="finishTraining"
            >
              {{ $t("training.form.finishTraining") }}
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
