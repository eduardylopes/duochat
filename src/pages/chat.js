import { set, push, ref, onValue } from 'firebase/database'
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
  HStack,
  VStack,
  AvatarGroup,
  AvatarBadge
} from '@chakra-ui/react'
import { ArrowRightIcon, ArrowLeftIcon } from '@chakra-ui/icons'

import { GifPopup } from '../components/GifPopup'
import { Message } from '../components/Message'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '@chakra-ui/react'

function Chat() {
  const notificationSound = useRef();
  const textArea = useRef();
  const chatList = useRef();
  const [messages, setMessages] = useState([])
  const { user, exitAccount, usersData } = useAuth();
  const toast = useToast();

  useBeforeunload(() => exitAccount())

  useEffect(() => {
    const messageRef = ref(database, 'messages/')
    onValue(messageRef, message => {

      const databaseMessage = message.val() || {};
      
      const parsedMessages = Object.entries(databaseMessage).map(([key, value]) => {
        return {
          messageId: key,
          content: value.content,
          author: value.author,
          date: value.date,
        }
      });

      setMessages(parsedMessages.reverse());

      if(notificationSound.current 
        && chatList.current 
        && !(user?.id == chatList.current.firstChild.dataset.userId)) {
        notificationSound.current.play();
      }
    });

  }, []);

  useEffect(() => {
    if (chatList && chatList.current && chatList.current.firstChild) {
      chatList.current.scrollTo({
        behavior: "smooth",
        top: chatList.current.firstChild.offsetTop
      });
    }
  }, [messages, chatList]);

  function sendMessageWithEnter(event) {
    if(event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage(event.target.value);
      event.target.value = '';
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
        return;
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

      const messageRef = ref(database, '/messages');
      const messageId = await push(messageRef);
      await set(messageId, message);

      textArea.current.value = ''
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
      <audio
        ref={notificationSound}
        src='/notification.mp3'
        >
      </audio>
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
          <HStack>
            <Box>
              <Tag
                size='lg' 
                key='lg' 
                variant='subtle'
                colorScheme='green'
                display={['none', 'flex', 'flex', 'flex']}
              >
                <RiRadioButtonLine size='1rem'/>
                <TagLabel
                  m='0.5rem'
                >
                  {usersData.length} online
                </TagLabel>
              </Tag>
            </Box>
            <AvatarGroup size='md' max={8}>
              { usersData.map(userOnline => (
                <Avatar
                  key={userOnline.id}
                  src={userOnline.avatar}
                  size='sm'
                  name={userOnline.name}
                  ml={['none', 'none', '1rem', '1rem']}
                  bg='none'
                >
                  <AvatarBadge boxSize='1.25em' bg='green.500' />
                </Avatar>
              ))}
            </AvatarGroup>
          </HStack>
          <Button
            onClick={() => exitAccount()}
            leftIcon={<ArrowLeftIcon />} 
            colorScheme='red' 
            variant='solid'
            aria-label='Sair'
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
            ref={chatList}
          >
            { messages.map(message => 
              (
                <Message
                  key={message.messageId}
                  messageId={message.messageId}
                  author={message.author}
                  content={message.content}
                  date={message.date}
                  data={message.author.userId}
                />
              ))
            }
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
              alignItems='center'
              justifyContent='center'
              w='100%'
              spacing='1rem'
            >
              <Avatar name={user?.name} src={user?.avatar} size='lg'/>
              <Textarea
                onKeyDown={event => sendMessageWithEnter(event)}
                aria-label='Escrever mensagem'
                placeholder='Dexar um novo comentário'
                resize='none'
                h='100%'
                bg='#042c60'
                color='#FFF'
                flex='1'
                ref={textArea}
              />
              <VStack
                flexDirection='column'
                alignItems='center'
                justifyContent={['center', 'center', 'space-between', 'space-between']}
                py='1rem'
                w='auto'
                h='100%'
              >
                <Button
                  display={['none', 'none', 'flex', 'flex', 'flex']}
                  onClick={() => handleSendMessage(textArea.current.value)}
                  colorScheme='green'
                  alignItems='center'
                  justifyContent='center'
                  variant='solid'
                  w='100%'
                  p='0'
                >
                  <ArrowRightIcon />
                </Button>
                <GifPopup
                  aria-label='Enviar imagens GIF'
                  onStickerClick={(gifPicure) => {
                    handleSendMessage(`:sticker:${gifPicure}`);
                  }}
                />
              </VStack>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </Box>
  )
}

export default Chat