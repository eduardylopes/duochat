import styles from '../styles/pages/Home.module.scss'
import { DefaultButton } from '../components/DefaultButton'
import { Header } from '../components/Header'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter();
  const { user, signInWithGithub, signInWithGoogle} = useAuth();

  async function handleLogin(signInFunction) {

    await signInFunction();

    router.push('/chat-room');
  }

  return (
    <div className={styles.body}>
      <Header/>
      <main className={styles.mainContent}>
        <section>
          <img src="/earth.svg" alt="Imagem globo terrestre" />
          <div>

            <h1>O jeito grátis, divertido e eficaz de aprender um idioma!</h1>
            <p>Entrar</p>
            <div>

              <DefaultButton
                buttonFunction={() => handleLogin(signInWithGithub)}
                buttonClass={styles.githubLoginButton}
                backgroundColor={'#235390'}
                borderColor={'#042c60'}
                width={'150px'}
              >
                <img src="/icon-github.svg"/>
                <span>Github</span>
              </DefaultButton>

              <DefaultButton
                buttonFunction={() => handleLogin(signInWithGoogle)}
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
