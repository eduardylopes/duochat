import styles from '../styles/components/Header.module.scss'

export function Header({isLogged = false, backgroundColor, color}) {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>duochat</span>
      { isLogged && 
        <div className={styles.profileContainer}>
          <span>Eduardy</span>
          <img src="https://github.com/eduardylopes.png"></img>
        </div>
      }
    </header>
  )
}