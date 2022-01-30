import { set, push, ref, onValue, off } from 'firebase/database'
import { database, auth } from '../services/firebase'
import { RiRadioButtonLine } from 'react-icons/ri'
import { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'
import { useBeforeunload } from 'react-beforeunload';
import { 
  Button, 
  Tag, 
  TagLabel, 
  Avatar,
  UnorderedList, 
  Box, 
  Textarea, 
  HStack 
} from '@chakra-ui/react'
import { ChatIcon, DeleteIcon, ArrowLeftIcon } from '@chakra-ui/icons'

import { GifPopup } from '../components/GifPopup'
import { Message } from '../components/Message'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '@chakra-ui/react'

function Chat() {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])
  const { user, exitAccount, onlineUsers } = useAuth();
  const toast = useToast();

  useBeforeunload(() => exitAccount())

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
      handleSendMessage(event.target.value);
    }
  }

  async function handleSendMessage(newMessage) {
      if (newMessage.trim() == '') {
        return;
      }

      if(!auth.currentUser) {
        toast({
          title: 'Você deve estar logado para mandar mensagens',
          position: 'top',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
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
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      w='100vw'
      h='100vh'
      bg='#235390'
      backgroundImage="url('/star-pattern.svg')"
    >
      <Box
        w={['100vw', '100vw', '768px', '768px']}
        h={['100vh', '100vh', '90vh', '90vh']}
        bgGradient='linear(to-tr, #042c60, #235390)'
        p='0 1rem 1rem 1rem'
        borderRadius={['0', '0', '1rem', '1rem']}
        justifyContent='space-between'
      >
        <Box 
          as='header'
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          alignItems='center'
          py='1rem'
          h='60px'
        >
          <Box>
            <Tag
              size='lg' 
              key='lg' 
              variant='subtle'
              colorScheme='green'
            >
              <RiRadioButtonLine size='1rem'/>
              <TagLabel m='0.5rem'>{onlineUsers} online</TagLabel>
            </Tag>
          </Box>
            <Button
              onClick={() => exitAccount()}
              leftIcon={<ArrowLeftIcon />} 
              colorScheme='red' 
              variant='solid'
            >
              Sair
            </Button>
        </Box>

        <Box
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          h='calc(100% - 60px)'
        >
          <UnorderedList
            display='flex'
            flexDirection='column-reverse'
            p='0'
            m='0'
            overflowY='scroll'
            mb='1rem'
          >
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
          </UnorderedList>
          <HStack
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='flex-start'
            spacing='1rem'
            height='max-content'
          >
            <HStack
              display='flex'
              flexDirection='row'
              w='100%'
              spacing='1rem'
            >
              <Avatar name={user?.name} src={user?.avatar} size='lg'/>
              <Textarea
                onChange={(event) => setNewMessage(event.target.value)}
                onKeyDown={(event) => sendMessageWithEnter(event)}
                value={newMessage}
                placeholder='Dexar um novo comentário'
                resize='none'
                h='100%'
                bg='#042c60'
                color='#FFF'
                flex='1'
              />
              <GifPopup 
                onStickerClick={(gifPicure) => {
                  handleSendMessage(`:sticker:${gifPicure}`);
                }}
              />
            </HStack>
            <Box
              display={['none', 'none', 'flex', 'flex', 'flex']}
              py='1rem'
              w='auto'
              h='100%'
              pb='0'
            >
              <Button 
                onClick={() => handleSendMessage()}
                leftIcon={<ChatIcon />} 
                colorScheme='green' 
                variant='solid'
                mr='0.5rem'
              >
                Enviar
              </Button>
              <Button
                onClick={() => setNewMessage('')}
                leftIcon={<DeleteIcon />} 
                colorScheme='red' 
                variant='outline'
                w='auto'
                px='0.5rem'
              >
                Cancelar
              </Button>
            </Box>
          </HStack>
        </Box>
      </Box>
    </Box>
  )
}

export default Chat