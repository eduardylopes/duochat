import styles from '../styles/components/DefaultButton.module.scss'

export function DefaultButton({ backgroundColor, width, borderColor, ...props }) {
  return (
    <>
      <button className={styles.defaultButton}>
        {props.children}
      </button>
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
          border-color: ${borderColor};
          width: ${width};
        }
      `}</style>
    </>
  )
}