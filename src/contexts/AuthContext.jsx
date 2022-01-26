import { signInWithPopup } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, githubProvider, googleProvider } from "../services/firebase";


export const AuthContext = createContext({});

export function AuthContextProvider(props) {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
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
  
  async function signInWithGithub() {
    if(user) {
      return
    }

    const result = await signInWithPopup(auth, githubProvider)
    
    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  async function signInWithGoogle() {

    if(user) {
      return
    }

    const result = await signInWithPopup(auth, googleProvider)

    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  return (
      <AuthContext.Provider value={{ user, signInWithGoogle, signInWithGithub }}>
        {props.children}
      </AuthContext.Provider>
  );
}