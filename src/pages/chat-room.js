import styles from '../styles/pages/ChatRoom.module.scss'
import { DefaultButton } from '../components/DefaultButton'
import { Message } from '../components/Message'
import { RiRadioButtonLine, RiLogoutBoxLine } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth'
import { set, push, ref, onValue, off } from 'firebase/database'
import { database } from '../services/firebase'

function ChatRoom() {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])
  const { user } = useAuth();

  useEffect(() => {
    const messageRef = ref(database, 'messages/')

    const unsubscribeMessageListerner = onValue(messageRef, message => {
      const databaseMessage = message.val() || {}

      const parsedMessages = Object.entries(databaseMessage).map(([key, value]) => {
        return {
          messageId: key,
          content: value.content,
          author: value.author,
        }
      })

      setMessages(parsedMessages.reverse())
    }, {
      onlyOnce: false
    });

    return () => off(messageRef)

  }, [user?.id])

  async function handleSendMessage(event) {
    if(event.key == 'Enter') {
      event.preventDefault();
      
      if (newMessage.trim() == '') {
        return;
      }

      if(!user) {
        toast.error("Você deve estar logado para mandar mensagens")
      }

      const message = {
        content: newMessage,
        author: {
          userId: user.id,
          name: user.name,
          avatar: user.avatar,
        }
      }

      const messageRef = ref(database, '/messages')
      const messageId = await push(messageRef)
      await set(messageId, message)
      
      setNewMessage('')
    }
  }

  return (
    <div className={styles.body}>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <header className={styles.header}>
        <div>
          <RiRadioButtonLine size={20}/>
          <span>12 Online</span>
        </div>
          <button>
            <span>Sair</span>
            <RiLogoutBoxLine size={28}/>
          </button>
      </header>
      <main className={styles.mainContent}>
        <section className={styles.section}>
          <div className={styles.messageList}>
            { messages.map(message => {
              return (
                <Message
                  key={message.messageId}
                  author={message.author}
                  content={message.content}
                />
              )
            })}
          </div>
          <div className={styles.userInput}>
            <img src="https://github.com/eduardylopes.png" alt="" />
            <div>
              <textarea 
                onChange={(event) => setNewMessage(event.target.value)}
                onKeyDown={(event) => handleSendMessage(event)}
                placeholder='Dexar um novo comentário'
                value={newMessage}
              />
              <div>
                <DefaultButton 
                  backgroundColor={'#1cb0f6'}
                  borderColor={'#1899d6'}
                  width={'110px'}
                >
                  <span>Enviar</span>
                </DefaultButton>
                <DefaultButton 
                  backgroundColor={'#FFFFFD'}
                  borderColor={'#DD4A48'}
                  width={'110px'}
                >
                  <span className={styles.canceButtonText}>Cancelar</span>
                </DefaultButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ChatRoom