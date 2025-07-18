import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { type IUser, UserModel } from '~/models/user'
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const auth = getAuth()
  const db = getFirestore()

  const user = ref()
  const userData = ref<UserModel | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUserData = async (uid: string) => {
    loading.value = true
    error.value = null

    try {
      const userDocRef = doc(db, 'users', uid)
      const userDoc = await getDoc(userDocRef)
      if (userDoc.exists()) {
        const data = userDoc.data() as IUser
        userData.value = new UserModel(data, userDocRef)
      }
      else {
        error.value = 'User data not found'
      }
    }
    catch (err: any) {
      error.value = err.message
      console.log(err)
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email || '',
          nick: user.displayName || '',
          name: user.displayName?.split(' ')[0] || 'N/A',
          surname: user.displayName?.split(' ')[1] || 'N/A',
          photo: user.photoURL || '',
          role: 'user',
          dateOfBirth: new Date(),
          created: new Date(),
        })
      }
      await fetchUserData(userRef.id)
      console.log('Zalogowano jako:', user.displayName)
    }
    catch (error) {
      console.error('Błąd logowania:', error)
    }
  }

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      // const signInMethods = await fetchSignInMethodsForEmail(auth, email)
      // if (signInMethods.length === 0) {
      //   error.value = 'No account associated with this email.'
      //   loading.value = false
      //   return true
      // }

      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const usersQuery = query(collection(db, 'users'), where('email', '==', email))
      const querySnapshot = await getDocs(usersQuery)
      
      if (!querySnapshot.empty) {
        error.value = 'Email is already in use.'
        loading.value = false
        return false
      }
      error.value = 'No account associated with this email.'
      loading.value = false
      return true

    } catch (err: any) {
      error.value = err.message
      console.log(err)
      return false
    } finally {
      loading.value = false
    }
  }

  const registerByPassword = async (userDataInput: IUser, password: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userDataInput.email, password)
      const user = userCredential.user

      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, {
        ...userDataInput,
        created: new Date(),
      })

      await fetchUserData(user.uid)
      return true
    } catch (err: any) {
      error.value = err.message
      console.log(err)
      return false
    } finally {
      loading.value = false
    }
  }

  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      await fetchUserData(userCredential.user.uid)
      return true
    } catch (err: any) {
      error.value = err.message
      console.log(err)
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null
    try {
      await signOut(auth)
      user.value = null
      userData.value = null
    }
    catch (err: any) {
      error.value = err.message
      console.log(error.value)
    }
    finally {
      loading.value = false
    }
  }

  return {
    userData,
    error,
    loading,
    user,
    loginWithGoogle,
    fetchUserData,
    registerByPassword,
    checkEmailAvailability,
    loginWithEmail,
    logout,
  }
})
