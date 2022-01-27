import { deleteUser, signInWithPopup } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, githubProvider, googleProvider } from "../services/firebase";
import { set, push, ref, get, child } from 'firebase/database'
import { database } from '../services/firebase'
import { useRouter } from 'next/router'
import toast from "react-hot-toast";


export const AuthContext = createContext({});

export function AuthContextProvider(props) {
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [user, setUser] = useState();
  const router = useRouter()


  useEffect(() => {
    const userIdRef = ref(database, `/users/${user?.id}`)
    const databaseRef = ref(database)

    if (auth.currentUser) {
      set(userIdRef, '')

    } else {
      set(userIdRef, null)
    }

    get(child(databaseRef, '/users'))
      .then((snapshot) => {
        const usersOnline = Object.keys(snapshot.val()).length
        setOnlineUsers(usersOnline)
    })


  }, [auth.currentUser])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (auth.currentUser) {

        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Account.');
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => { unsubscribe() }
  }, [])
  
  async function exitAccount() {
    deleteUser(auth.currentUser).then(() => router.push('/')).catch(error => toast.error('Ocorreu um erro inesperado!'))
  }

  async function signInWithGithub() {
    if(auth.currentUser) {
      return
    }

    const result = await signInWithPopup(auth, githubProvider)
    
    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  async function signInWithGoogle() {
    if(auth.currentUser) {
      return
    }

    const result = await signInWithPopup(auth, googleProvider)

    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  return (
      <AuthContext.Provider value={{ user, signInWithGoogle, signInWithGithub, exitAccount, database, onlineUsers }}>
        {props.children}
      </AuthContext.Provider>
  );
}