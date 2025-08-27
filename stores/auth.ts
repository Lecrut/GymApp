import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, Timestamp, where } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { type IUser, UserModel } from '~/models/user'
import { useSharedStore } from './shared'
import { useTrainingStore } from './training'

export const useAuthStore = defineStore('auth', () => {
  const auth = getAuth()
  const db = getFirestore()

  const sharedStore = useSharedStore()

  const user = ref()
  const userData = ref<UserModel | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  const fetchUserData = async (uid: string) => {
    sharedStore.init()

    try {
      const userDocRef = doc(db, 'users', uid)
      const userDoc = await getDoc(userDocRef)
      if (userDoc.exists()) {
        const data = userDoc.data() as any
        userData.value = new UserModel(
          {
            ...data,
            dateOfBirth: data.dateOfBirth
              ? data.dateOfBirth.toDate()
              : new Date(),
            created: data.created
              ? data.created.toDate()
              : new Date(),
          },
          userDocRef,
        )
      }
      else {
        sharedStore.failure({ code: 'User data not found' })
      }
    }
    catch (err: any) {
      sharedStore.failureSnackbar(err)
    }
  }

  const loginWithGoogle = async () => {
    sharedStore.init()

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const userTemp = result.user

      const userRef = doc(db, 'users', userTemp.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: userTemp.email || '',
          nick: userTemp.displayName || '',
          name: userTemp.displayName?.split(' ')[0] || 'N/A',
          surname: userTemp.displayName?.split(' ')[1] || 'N/A',
          photo: userTemp.photoURL || '',
          role: 'user',
          dateOfBirth: new Date(),
          created: new Date(),
        })
      }
      await fetchUserData(userRef.id)

      sharedStore.successSnackbar()
    }
    catch (e: any) {
      sharedStore.failureSnackbar(e)
    }
  }

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    sharedStore.init()

    try {
      const usersQuery = query(collection(db, 'users'), where('email', '==', email))
      const querySnapshot = await getDocs(usersQuery)

      if (!querySnapshot.empty) {
        sharedStore.failure({ code: 'Email is already in use.' })

        return false
      }
      sharedStore.failure({ code: 'No account associated with this email.' })

      return true
    }
    catch (err: any) {
      sharedStore.failureSnackbar(err)

      return false
    }
    finally {
      sharedStore.success()
    }
  }

  const registerByPassword = async (userDataInput: IUser, password: string): Promise<boolean> => {
    sharedStore.init()

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userDataInput.email, password)
      const userTemp = userCredential.user

      const userRef = doc(db, 'users', userTemp.uid)
      await setDoc(userRef, {
        ...userDataInput,
        created: new Date(),
      })

      await fetchUserData(userTemp.uid)

      return true
    }
    catch (err: any) {
      sharedStore.failureSnackbar(err)
      console.error(err)

      return false
    }
    finally {
      sharedStore.success()
    }
  }

  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    sharedStore.init()

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      await fetchUserData(userCredential.user.uid)

      return true
    }
    catch (err: any) {
      sharedStore.failureSnackbar(err)
      console.error(err)

      return false
    }
    finally {
      sharedStore.success()
    }
  }

  const logout = async () => {
    sharedStore.init()

    try {
      await signOut(auth)
      user.value = null
      userData.value = null

      const trainingStore = useTrainingStore()
      trainingStore.resetStore()
    }
    catch (err: any) {
      sharedStore.failure(err)
      console.error(err.message)
    }
    finally {
      sharedStore.success()
    }
  }

  const updateUserData = async (updatedUser: UserModel) => {
    if (!userData.value?.reference) {
      return
    }

    sharedStore.init()

    try {
      await setDoc(userData.value.reference, {
        ...updatedUser,
        dateOfBirth: new Timestamp(updatedUser.dateOfBirth.getTime() / 1000, 0),
      }, { merge: true })
      userData.value = new UserModel(updatedUser, userData.value.reference)
    }
    catch (err: any) {
      sharedStore.failure(err)
      console.error(err)

      return
    }
    finally {
      sharedStore.success()
    }
  }

  return {
    userData,
    user,
    isAuthenticated,
    loginWithGoogle,
    fetchUserData,
    registerByPassword,
    checkEmailAvailability,
    loginWithEmail,
    logout,
    updateUserData,
  }
}, {
  persist: true,
})
