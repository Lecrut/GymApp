import type { DocumentReference } from "firebase/firestore"

export type TRole =
  'administrator' |
    'user'

export interface IUser {
    email: string,
    nick: string,
    name: string,
    surname: string,
    photo: string,
    role: TRole,
    dateOfBirth: Date,
    created: Date
}

export class UserModel implements IUser {
    email: string
    nick: string
    name: string
    surname: string
    photo: string
    role: TRole
    dateOfBirth: Date
    created: Date

    reference: DocumentReference | null

    constructor(data: IUser, reference: DocumentReference | null) {
        this.email = data.email || ''
        this.nick = data.nick || ''
        this.name = data.name || ''
        this.surname = data.surname || ''
        this.photo = data.photo || ''
        this.role = data.role || 'user'
        this.dateOfBirth = data.dateOfBirth || new Date()
        this.created = data.created || new Date()
        this.reference = reference
    }
}

export function toMapUser(data?: Partial<IUser>): IUser {
    return {
        email: data?.email || '',
        nick: data?.nick || '',
        name: data?.name || '',
        surname: data?.surname || '',
        photo: data?.photo || '',
        role: data?.role || 'user',
        dateOfBirth: data?.dateOfBirth || new Date(),
        created: data?.created || new Date()
    }
}
