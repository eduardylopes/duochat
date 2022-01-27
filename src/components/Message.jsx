import styles from '../styles/components/Message.module.scss'

export function Message({author, content, date}) {
  return (
    <div className={styles.container}>
      <img src={author.avatar} alt="" />
      <div>
        <div>
          <span>{author.name}</span> 
          <span className={styles.messageDate}>{date}</span>
        </div>
        <p>{content}</p>
      </div>
    </div>
  )
}