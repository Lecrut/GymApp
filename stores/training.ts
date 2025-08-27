import type { DocumentReference } from 'firebase/firestore'
import { addDoc, collection, getDocs, getFirestore, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Exercise, mapToTrainingModel, type TrainingSession } from '~/models/training'

export const useTrainingStore = defineStore('training', () => {
  const sessions = ref<TrainingSession[]>([])
  const currentSession = ref<TrainingSession | null>(null)
  const lastDoc = ref<DocumentReference | null>(null)

  const db = getFirestore()
  const trainingCollection = collection(db, 'trainings')

  async function getTrainingsInBath(user: DocumentReference) {
    const trainings: TrainingSession[] = []
    const batchSize = 10

    try {
      let q = query(
        trainingCollection,
        where('userRef', '==', user),
        orderBy('date', 'desc'),
        limit(batchSize),
      )

      if (lastDoc) {
        q = query(q, startAfter(lastDoc))
      }

      const snapshot = await getDocs(q)
      const batch = snapshot.docs.map(mapToTrainingModel)

      trainings.push(...batch)

      lastDoc.value = snapshot.docs[snapshot.docs.length - 1].ref
    }
    catch (error) {
      console.error('Error fetching trainings for batch:', error)
    }
  }

  function startNewSession(userRef: DocumentReference | null) {
    currentSession.value = {
      id: Date.now().toString(),
      date: new Date(),
      exercises: [],
      totalDuration: 0,
      userRef,
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
    getTrainingsInBath,
    resetStore,
  }
})
