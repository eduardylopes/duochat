import { RiDeleteBin2Line } from 'react-icons/ri'
import { ref, set } from 'firebase/database'
import { database } from '../services/firebase';

import { useAuth } from '../hooks/useAuth';

import styles from '../styles/components/Message.module.scss'

export function Message(props) {
  const { user } = useAuth();
  const isAuthor = props.author.name === user?.name

  function handleDeleteMessage() {

    if(isAuthor) {
      const messageRef = ref(database, `/messages/${props.messageId}`)
      set(messageRef, null)
    }
  }

  return (
    <div className={styles.container}>

      { isAuthor && 
        <button onClick={() => handleDeleteMessage()}>
          <RiDeleteBin2Line size={24}/>
        </button>
      }

      <img src={props.author.avatar} alt="" />
      <div>
        <div>
          <span>{props.author.name}</span> 
          <span className={styles.messageDate}>{props.date}</span>
        </div>
        <p>{props.content}</p>
      </div>
    </div>
  )
}