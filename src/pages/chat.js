import { set, push, ref, onValue, off } from 'firebase/database'
import { database, auth } from '../services/firebase'
import { RiRadioButtonLine, RiLogoutBoxLine } from 'react-icons/ri'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'
import { useBeforeunload } from 'react-beforeunload';
import { Button, Badge, Tag, TagLeftIcon, TagLabel, Avatar, Stack } from '@chakra-ui/react'
import { ChatIcon, DeleteIcon, ArrowLeftIcon, ViewIcon, SlideFade } from '@chakra-ui/icons'

import { Message } from '../components/Message'
import { useAuth } from '../hooks/useAuth'

import styles from '../styles/pages/Chat.module.scss'

function Chat() {

  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])
  const { user, exitAccount, onlineUsers, setOnlineUsers } = useAuth();

  useBeforeunload(event => exitAccount())

  useEffect(() => {
    const messageRef = ref(database, 'messages/')
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
      <main className={styles.mainContent}>
        <section className={styles.section}>
          <header className={styles.header}>
            <div>
              <Tag 
                size='lg' 
                key='lg' 
                variant='subtle'
                colorScheme='green'
              >
                <RiRadioButtonLine size='1rem'/>
                <TagLabel m='0.5rem'>{onlineUsers} online</TagLabel>
              </Tag>
            </div>
              <Button
                onClick={() => exitAccount()}
                leftIcon={<ArrowLeftIcon />} 
                colorScheme='red' 
                variant='solid'
              >
                Sair
              </Button>
          </header>
          <ul className={styles.messageList}>
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
          </ul>
          <div className={styles.userInput}>
            <Avatar name={user?.name} src={user?.avatar} size='lg'/>
            <div>
              <Stack
                display='flex'
                flexDirection='row'
                alignItems='center'
                w='100%'
              >
                <textarea
                  onChange={(event) => setNewMessage(event.target.value)}
                  onKeyDown={(event) => sendMessageWithEnter(event)}
                  placeholder='Dexar um novo comentário'
                  value={newMessage}
                />
              </ Stack>
              <div>
                <Button 
                  onClick={handleSendMessage}
                  leftIcon={<ChatIcon />} 
                  colorScheme='green' 
                  variant='solid'
                >
                  Enviar
                </Button>
                <Button
                  onClick={() => setNewMessage('')}
                  leftIcon={<DeleteIcon />} 
                  colorScheme='red' 
                  variant='outline'
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Chat