import styles from '../styles/pages/Home.module.scss'
import { DefaultButton } from '../components/DefaultButton'
import { Header } from '../components/Header'

export default function Home() {
  return (
    <>
      <Header/>
      <main className={styles.mainContent}>
        <section>
          <img src="/earth.svg" alt="Imagem globo terrestre" />
          <div>

            <h1>O jeito grátis, divertido e eficaz de aprender um idioma!</h1>
            <p>Entrar</p>
            <div>

              <DefaultButton 
                buttonClass={styles.githubLoginButton}
                backgroundColor={'#235390'}
                borderColor={'#042c60'}
                width={'150px'}
              >
                <img src="/icon-github.svg"/>
                <span>Github</span>
              </DefaultButton>

              <DefaultButton 
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
    </>
  )
}
