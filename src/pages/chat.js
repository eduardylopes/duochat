import { set, push, ref, onValue, off } from 'firebase/database'
import { database } from '../services/firebase'
import { auth } from "../services/firebase";
import { RiRadioButtonLine, RiLogoutBoxLine } from 'react-icons/ri'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'
import { useBeforeunload } from 'react-beforeunload';

import { DefaultButton } from '../components/DefaultButton'
import { Message } from '../components/Message'
import { useAuth } from '../hooks/useAuth'

import styles from '../styles/pages/Chat.module.scss'

function Chat() {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])
  const { user, exitAccount, onlineUsers, setOnlineUsers } = useAuth();
  const messageRef = ref(database, 'messages/')

  useBeforeunload(event => exitAccount())

  useEffect(() => {
    onValue(messageRef, message => {
      const databaseMessage = message.val() || {}
      
      const parsedMessages = Object.entries(databaseMessage).map(([key, value]) => {
        return {
          messageId: key,
          content: value.content,
          author: value.author,
          date: value.date
        }
      })

      setMessages(parsedMessages.reverse())
    }, {
      onlyOnce: false
    });

    return () => off(messageRef)

  }, [user?.id])

  function sendMessageWithEnter(event) {
    if(event.key == 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  }

  async function handleSendMessage() {
      if (newMessage.trim() == '') {
        return;
      }

      if(!auth.currentUser) {
        toast.error("Você deve estar logado para mandar mensagens")
        return
      }

      const message = {
        content: newMessage,
        date: format(new Date, "dd 'de' MMM, 'às' HH:mm", {locale: pt}),
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

  return (
    <div
      className={styles.body}
    >
      <Toaster />
      <main className={styles.mainContent}>
        <section className={styles.section}>
          <header className={styles.header}>
            <div>
              <RiRadioButtonLine size={20}/>
              <span>{onlineUsers} Online</span>
            </div>
              <button onClick={() => exitAccount()}>
                <span>Sair</span>
                <RiLogoutBoxLine size={28}/>
              </button>
          </header>
            <div className={styles.messageList}>
            { messages.map(message => {
              return (
                <Message
                  key={message.messageId}
                  messageId={message.messageId}
                  author={message.author}
                  content={message.content}
                  date={message.date}
                />
              )
            })}
          </div>
          <div className={styles.userInput}>
            <img className={styles.bottonProfile} src={user?.avatar} alt="" />
            <div>
              <textarea
                onChange={(event) => setNewMessage(event.target.value)}
                onKeyDown={(event) => sendMessageWithEnter(event)}
                placeholder='Dexar um novo comentário'
                value={newMessage}
              />
              <div>
                <DefaultButton
                  onClick={handleSendMessage}
                  backgroundColor={'#06FF00'}
                  borderColor={'#125C13'}
                  width={'110px'}
                >
                  <span className={styles.sendButtonText}>Enviar</span>
                </DefaultButton>
                <DefaultButton
                  onClick={() => setNewMessage('')}
                  backgroundColor={'transparent'}
                  borderColor={'red'}
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

export default Chat