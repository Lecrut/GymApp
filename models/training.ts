import type { DocumentReference } from 'firebase/firestore'

export interface ITraining {
  user: DocumentReference | null
  date: Date
  sets: ITrainingSet[]
}

export interface ITrainingSet {
  weight: number
  repetitions: number
  breakTime: number
}

export class TrainingModel implements ITraining {
  user: DocumentReference | null
  date: Date
  sets: ITrainingSet[]

  constructor(data: ITraining) {
    this.user = data.user || null
    this.date = data.date || new Date()
    this.sets = data.sets || []
  }
}

export function toMapTraining(data?: Partial<ITraining>): ITraining {
  return {
    user: data?.user || null,
    date: data?.date || new Date(),
    sets: data?.sets || [],
  }
}
