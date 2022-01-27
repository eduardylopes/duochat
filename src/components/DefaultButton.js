import styles from '../styles/components/DefaultButton.module.scss'

export function DefaultButton(props) {
  return (
    <>
      <button
        onClick={props.onClick}
        className={styles.defaultButton}
      >
        {props.children}
      </button>
      <style jsx>{`
        button {
          background-color: ${props.backgroundColor};
          border-color: ${props.borderColor};
          width: ${props.width};
        }
      `}</style>
    </>
  )
}