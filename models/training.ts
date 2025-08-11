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
}

export class TrainingModel implements TrainingSession {
  id: string
  date: Date
  exercises: Exercise[]
  totalDuration: number

  constructor(data: TrainingSession) {
    this.id = data.id
    this.date = data.date || new Date()
    this.exercises = data.exercises || []
    this.totalDuration = data.totalDuration || 0
  }
}

export function toMapTraining(data?: Partial<TrainingSession>): TrainingSession {
  return {
    id: data?.id || '',
    date: data?.date || new Date(),
    exercises: data?.exercises || [],
    totalDuration: data?.totalDuration || 0,
  }
}
