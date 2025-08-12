import type { Exercise, TrainingSession } from '~/models/training'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const db = getFirestore()
const trainingCollection = collection(db, 'trainings')

export const useTrainingStore = defineStore('training', () => {
  const sessions = ref<TrainingSession[]>([])
  const currentSession = ref<TrainingSession | null>(null)

  function startNewSession() {
    currentSession.value = {
      id: Date.now().toString(),
      date: new Date(),
      exercises: [],
      totalDuration: 0,
    }
  }

  function addExerciseToSession(exercise: Exercise) {
    if (!currentSession.value)
      return

    currentSession.value.exercises.push(exercise)

    const exerciseDuration = exercise.sets.reduce((total, set) => total + set.duration, 0)
    currentSession.value.totalDuration += exerciseDuration
  }

  async function finishSession() {
    if (!currentSession.value)
      return

    const sessionToSave = { ...currentSession.value }
    sessions.value.push(sessionToSave)
    currentSession.value = null

    try {
      await addDoc(trainingCollection, sessionToSave)
    }
    catch (error) {
      console.error('Error saving training session to Firestore:', error)
    }
  }

  function deleteSession(sessionId: string) {
    sessions.value = sessions.value.filter(session => session.id !== sessionId)
  }

  function getSessionsByDate(date: Date) {
    return sessions.value.filter(session => session.date.toDateString() === date.toDateString(),
    )
  }

  function getTotalWorkouts() {
    return sessions.value.length
  }

  function getTotalExercises() {
    return sessions.value.reduce((total, session) => total + session.exercises.length, 0)
  }

  function resetStore() {
    sessions.value = []
    currentSession.value = null
    localStorage.removeItem('gym-training-sessions')
  }

  return {
    sessions,
    currentSession,
    startNewSession,
    addExerciseToSession,
    finishSession,
    deleteSession,
    getSessionsByDate,
    getTotalWorkouts,
    getTotalExercises,
    resetStore,
  }
})
