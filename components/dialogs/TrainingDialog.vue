<script setup lang="ts">
import type { Exercise } from '~/models/training'
import { computed, ref, watch } from 'vue'
import { useTrainingStore } from '~/stores/training'

const trainingStore = useTrainingStore()

const authStore = useAuthStore()
const { userData } = storeToRefs(authStore)

enum Phase {
  EXERCISE_INPUT = 'exercise_input',
  TIMER_RUNNING = 'timer_running',
  SET_DETAILS = 'set_details',
  NEXT_ACTION = 'next_action',
  TRAINING_SUMMARY = 'training_summary',
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

const sessionStartTime = ref<Date | null>(null)

const isFirstExercise = computed(() => {
  const sessionExercises = trainingStore.currentSession?.exercises || []

  return sessionExercises.length === 0 && !currentExercise.value
})

const trainingSummary = computed(() => {
  const session = trainingStore.currentSession
  if (!session)
    return null

  const exercisesTemp = [...session.exercises]
  if (currentExercise.value) {
    exercisesTemp.push(currentExercise.value)
  }

  const totalExercises = exercisesTemp.length
  const totalSets = exercisesTemp.reduce((sum, ex) => sum + ex.sets.length, 0)
  const totalReps = exercisesTemp.reduce((sum, ex) => sum + ex.sets.reduce((setSum, set) => setSum + set.reps, 0), 0)
  const totalWeight = exercisesTemp.reduce((sum, ex) => sum + ex.sets.reduce((setSum, set) => setSum + (set.weight * set.reps), 0), 0)
  const exerciseTime = exercisesTemp.reduce((sum, ex) => sum + ex.sets.reduce((setSum, set) => setSum + set.duration, 0), 0)

  const totalTime = sessionStartTime.value
    ? (Date.now() - sessionStartTime.value.getTime()) / 1000
    : 0
  const restTime = totalTime - exerciseTime

  return {
    totalExercises,
    totalSets,
    totalReps,
    totalWeight: Math.round(totalWeight * 10) / 10,
    exerciseTime: Math.round(exerciseTime * 10) / 10,
    restTime: Math.round(restTime * 10) / 10,
    totalTime: Math.round(totalTime * 10) / 10,
  }
})

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
    trainingStore.addExerciseToSession(currentExercise.value)
  }

  exerciseName.value = ''
  currentExercise.value = null
  currentPhase.value = Phase.EXERCISE_INPUT
}

function finishTraining() {
  if (currentExercise.value) {
    trainingStore.addExerciseToSession(currentExercise.value)
  }

  currentPhase.value = Phase.TRAINING_SUMMARY
}

async function completeFinalTraining() {
  await trainingStore.finishSession()

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
  sessionStartTime.value = null
}

function cancelTraining() {
  resetDialog()
  isShow.value = false
}

watch(isShow, (newVal) => {
  if (newVal) {
    resetDialog()
    sessionStartTime.value = new Date()
    trainingStore.startNewSession(userData.value?.reference || null)
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
    max-width="800"
  >
    <v-card class="pa-4">
      <v-card-title class="text-center">
        {{ $t("training.form.title") }}
      </v-card-title>

      <v-card-text>
        <div
          v-if="currentPhase === Phase.EXERCISE_INPUT"
        >
          <v-text-field
            v-model="exerciseName"
            :label="$t('training.form.exerciseName')"
            variant="outlined"
            class="mb-4"
            @keyup.enter="startExercise"
          />

          <v-row
            align="center"
            justify="center"
          >
            <v-btn
              color="primary"
              :disabled="!exerciseName.trim()"
              size="large"
              class="mx-2"
              @click="startExercise"
            >
              {{ $t("training.form.start") }}
            </v-btn>

            <v-btn
              v-if="isFirstExercise"
              color="error"
              size="large"
              class="mx-2"
              @click="cancelTraining"
            >
              {{ $t("training.form.cancelTraining") }}
            </v-btn>
          </v-row>
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

        <div
          v-else-if="currentPhase === Phase.TRAINING_SUMMARY"
          class="d-flex flex-column align-center"
        >
          <div class="text-h5 mb-4 text-center">
            {{ $t("training.form.trainingSummary") }}
          </div>

          <v-card
            variant="outlined"
            class="w-100 mb-4"
          >
            <v-card-text>
              <v-row dense>
                <v-col cols="6">
                  <div class="text-caption text-grey">
                    {{ $t("training.form.totalTime") }}
                  </div>

                  <div class="text-h6">
                    {{ Math.floor((trainingSummary?.totalTime || 0) / 60) }}:{{ String(Math.floor((trainingSummary?.totalTime || 0) % 60)).padStart(2, '0') }} {{ $t("training.form.minutes") }}
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="text-caption text-grey">
                    {{ $t("training.form.exerciseTime") }}
                  </div>

                  <div class="text-h6">
                    {{ Math.floor((trainingSummary?.exerciseTime || 0) / 60) }}:{{ String(Math.floor((trainingSummary?.exerciseTime || 0) % 60)).padStart(2, '0') }} {{ $t("training.form.minutes") }}
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="text-caption text-grey">
                    {{ $t("training.form.restTime") }}
                  </div>

                  <div class="text-h6">
                    {{ Math.floor((trainingSummary?.restTime || 0) / 60) }}:{{ String(Math.floor((trainingSummary?.restTime || 0) % 60)).padStart(2, '0') }} {{ $t("training.form.minutes") }}
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="text-caption text-grey">
                    {{ $t("training.form.totalExercises") }}
                  </div>

                  <div class="text-h6">
                    {{ trainingSummary?.totalExercises || 0 }}
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="text-caption text-grey">
                    {{ $t("training.form.totalSets") }}
                  </div>

                  <div class="text-h6">
                    {{ trainingSummary?.totalSets || 0 }}
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="text-caption text-grey">
                    {{ $t("training.form.totalReps") }}
                  </div>

                  <div class="text-h6">
                    {{ trainingSummary?.totalReps || 0 }}
                  </div>
                </v-col>

                <v-col cols="12">
                  <div class="text-caption text-grey">
                    {{ $t("training.form.totalWeight") }}
                  </div>

                  <div class="text-h6">
                    {{ trainingSummary?.totalWeight || 0 }} {{ $t("training.form.kg") }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-btn
            color="success"
            size="large"
            block
            @click="completeFinalTraining"
          >
            {{ $t("training.form.completeTraining") }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
