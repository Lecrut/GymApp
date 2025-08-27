import type { DocumentData, DocumentReference } from 'firebase/firestore'

export interface TrainingSet {
  reps: number
  weight: number
  duration: number
  timestamp: Date
}

export interface Exercise {
  name: string
  sets: TrainingSet[]
}

export interface TrainingSession {
  id: string
  date: Date
  exercises: Exercise[]
  totalDuration: number

  userRef: DocumentReference | null
}

export class TrainingModel implements TrainingSession {
  id: string
  date: Date
  exercises: Exercise[]
  totalDuration: number

  userRef: DocumentReference | null
  reference: DocumentReference | null

  constructor(data: TrainingSession, ref: DocumentReference | null) {
    this.id = data.id
    this.date = data.date || new Date()
    this.exercises = data.exercises || []
    this.totalDuration = data.totalDuration || 0

    this.userRef = data.userRef || null
    this.reference = ref
  }
}

export function toMapTraining(data?: Partial<TrainingSession>): TrainingSession {
  return {
    id: data?.id || '',
    date: data?.date || new Date(),
    exercises: data?.exercises || [],
    totalDuration: data?.totalDuration || 0,
    userRef: data?.userRef || null,
  }
}

export function mapToTrainingModel(data: DocumentData): TrainingModel {
  return new TrainingModel(toMapTraining(data.docs()), data.reference)
}
