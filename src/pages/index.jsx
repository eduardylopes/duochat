import { useAuth } from '../hooks/useAuth'
import { Toaster } from 'react-hot-toast'

import { DefaultButton } from '../components/DefaultButton'
import { Header } from '../components/Header'

import styles from '../styles/pages/Home.module.scss'

export default function Home() {
  const { signInWithGithub, signInWithGoogle} = useAuth();

  return (
    <div className={styles.body}>
      <Toaster />
      <Header/>
      <main className={styles.mainContent}>
        <section>
          <img src="/earth.svg" alt="Imagem globo terrestre" />
          <div>

            <h1>O jeito grátis, divertido e eficaz de aprender um idioma!</h1>
            <p>Entrar</p>
            <div>

              <DefaultButton
                onClick={() => signInWithGithub()}
                buttonClass={styles.githubLoginButton}
                backgroundColor={'#235390'}
                borderColor={'#042c60'}
                width={'150px'}
              >
                <img src="/icon-github.svg"/>
                <span>Github</span>
              </DefaultButton>

              <DefaultButton
                onClick={() => signInWithGoogle()}
                buttonClass={styles.githubLoginButton}
                backgroundColor={'#235390'}
                borderColor={'#042c60'}
                width={'150px'}
              >
                <img src="/icon-google.svg"/>
                <span>Google</span>
                </DefaultButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
