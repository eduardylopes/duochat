import { RiDeleteBin2Line } from 'react-icons/ri'
import { ref, set } from 'firebase/database'
import { database } from '../services/firebase';
import { Tooltip, CloseButton } from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'

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
    <li className={`${styles.container} ${props.owner && styles.ownerContainer}`}>

      { isAuthor &&
        <Tooltip hasArrow label="Excluir" aria-label='Excluir'>
            <CloseButton 
              size='md'
              onClick={() => handleDeleteMessage()}
            />
        </Tooltip>
      }
      <Avatar name={props.author.name} src={props.author.avatar} size='lg'/>
      <div>
        <div>
          <span>{props.author.name}</span> 
          <span className={styles.messageDate}>{props.date}</span>
        </div>
        <p>{props.content}</p>
      </div>
    </li>
  )
}