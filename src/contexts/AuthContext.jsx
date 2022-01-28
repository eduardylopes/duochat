import { signInWithPopup, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, githubProvider, googleProvider } from "../services/firebase";
import { set, ref, get, child, update, onValue } from 'firebase/database'
import { database } from '../services/firebase'
import { useRouter } from 'next/router'
import toast from "react-hot-toast";

export const AuthContext = createContext({});

export function AuthContextProvider(props) {
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [user, setUser] = useState();
  const router = useRouter()

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

  useEffect(() => {
    onValue(ref(database, '/online-users'), onlineUserDatabase => {
      setOnlineUsers(onlineUserDatabase.val())
    }, {
        onlyOnce: false
    })
  }, [auth.currentUser])
  
  async function setUsersOnlineInDatabase(props) {
    const onlineUsersRef = ref(database, '/online-users')
    const databaseRef = ref(database)
    const onlineUsersInDatabase = (await get(child(databaseRef, '/online-users'))).val()

    set(onlineUsersRef, onlineUsers + props)
  }

  async function exitAccount() {
    try{
      const signOutPromisse = await signOut(auth)
      setUsersOnlineInDatabase(Number(-1))
      router.push('/')

    } catch (e) {
      toast.error('Ocorreu um erro')
    }
  }

  async function signIn(provider) {
    if(auth.currentUser) {
      router.push('/chat')
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

      setUsersOnlineInDatabase(Number(1))

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
      <AuthContext.Provider 
        value={{ 
          user, 
          signInWithGoogle, 
          signInWithGithub, 
          exitAccount, 
          database, 
          onlineUsers
        }}
      >
        {props.children}
      </AuthContext.Provider>
  );
}