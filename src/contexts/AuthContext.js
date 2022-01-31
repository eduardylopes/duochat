import { signInWithPopup, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, githubProvider, googleProvider } from "../services/firebase";
import { set, ref, get, child, onValue, off, push } from 'firebase/database'
import { useToast } from '@chakra-ui/react'
import { database } from '../services/firebase'
import { useRouter } from 'next/router'

export const AuthContext = createContext({});

export function AuthContextProvider(props) {
  const toast = useToast()
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [userKey, setUserKey] = useState('');
  const [user, setUser] = useState();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (auth.currentUser) {
        const { displayName, photoURL, uid } = user;
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => { unsubscribe() }
  }, []);
  
  function addStatusOnlineDatabase() {
    const onlineUsersRef = ref(database, '/online-users');

    const onlineUserKey = push(onlineUsersRef, user).key
    setUserKey(onlineUserKey)
  }

  function removeStatusOnlineDatabase() {
    const onlineUsersRef = ref(database, `/online-users/${userKey}`)
    set(onlineUsersRef, null)
  }

  async function exitAccount() {
    try {

      if (auth.currentUser) {
        const signOutPromisse = await signOut(auth);
        removeStatusOnlineDatabase()
        router.push('/');
      } else {
        router.push('/');
      }

    } catch (e) {
      toast({
        title: 'Ocorreu um erro inesperado',
        position: 'top',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })

    }
  }

  async function signIn(provider) {

    if(auth.currentUser) {
      router.push('/chat');
      return
    }

    try {
      const result = await signInWithPopup(auth, provider);

      const { displayName, photoURL, uid } = result.user;

      if ( displayName == undefined || photoURL == undefined || uid == undefined) {
        return
      }

      if (result.user) {
        const { displayName, photoURL, uid } = result.user;
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        });
      }

      addStatusOnlineDatabase()

      router.push('/chat');

      toast({
        title: 'Usuário conectado',
        position: 'top',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

    }
    catch (e) {
      toast({
        title: 'Falha ao logar',
        description: 'Tente novamente mais tarde',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  function signInWithGithub() {
    signIn(githubProvider);
  }

  function signInWithGoogle() {
    signIn(googleProvider);
  }

  return (
      <AuthContext.Provider 
        value={{ 
          user, 
          signInWithGoogle, 
          signInWithGithub, 
          exitAccount, 
          database, 
          onlineUsers,
        }}
      >
        {props.children}
      </AuthContext.Provider>
  );
}