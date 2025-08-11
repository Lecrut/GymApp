import type { Exercise, TrainingSession } from '~/models/training'
import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  function finishSession() {
    if (!currentSession.value)
      return

    sessions.value.push({ ...currentSession.value })
    currentSession.value = null

    saveToStorage()
  }

  function saveToStorage() {
    localStorage.setItem('gym-training-sessions', JSON.stringify(sessions.value))
  }

  function loadFromStorage() {
    const stored = localStorage.getItem('gym-training-sessions')
    if (stored) {
      const parsed = JSON.parse(stored)
      sessions.value = parsed.map((session: any) => ({
        ...session,
        date: new Date(session.date),
        exercises: session.exercises.map((exercise: any) => ({
          ...exercise,
          sets: exercise.sets.map((set: any) => ({
            ...set,
            timestamp: new Date(set.timestamp),
          })),
        })),
      }))
    }
  }

  function deleteSession(sessionId: string) {
    sessions.value = sessions.value.filter(session => session.id !== sessionId)
    saveToStorage()
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

  loadFromStorage()

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
    saveToStorage,
    loadFromStorage,
  }
})
