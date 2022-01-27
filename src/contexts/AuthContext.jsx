import { signInWithPopup, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, githubProvider, googleProvider } from "../services/firebase";
import { set, ref, get, child } from 'firebase/database'
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
    try{
      const signOutPromisse = await signOut(auth)
      router.push('/')

    } catch (e) {
      toast.error('Ocorreu um erro')
    }
  }

  async function signIn(provider) {
    if(auth.currentUser) {
      return
    }

    try {
      const result = await signInWithPopup(auth, provider)

      if (result.user) {
        const { displayName, photoURL, uid } = result.user
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }

      router.push('/chat')

    } catch(e) {
      toast.error('Não foi possivel efetuar o login, tente novamente mais tarde.')
    }
  }

  function signInWithGithub() {
    signIn(githubProvider)
  }

  function signInWithGoogle() {
    signIn(googleProvider)
  }

  return (
      <AuthContext.Provider value={{ user, signInWithGoogle, signInWithGithub, exitAccount, database, onlineUsers }}>
        {props.children}
      </AuthContext.Provider>
  );
}