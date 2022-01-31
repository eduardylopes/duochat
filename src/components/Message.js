import { ref, set } from 'firebase/database'
import { database } from '../services/firebase';
import { Text } from '@chakra-ui/react'
import { Avatar, Image, Box, VStack, ListItem } from '@chakra-ui/react'
import { useAuth } from '../hooks/useAuth';
import { OptionButton } from './OptionButton'
import { useRef } from 'react'
import { useToast } from '@chakra-ui/react'

export function Message(props) {
  const toast = useToast();
  const messageRef = useRef();
  const { user } = useAuth();
  const isAuthor = props.author?.userId == user?.id;

  function handleDeleteMessage() {
    if(isAuthor) {
      const messageDatabaseRef = ref(database, `/messages/${props.messageId}`);
      set(messageDatabaseRef, null);
    }
  }

  async function handleCopyToClipboard(messageRef) {
    const content = messageRef.current?.innerText ;

    if (content == undefined) {
      toast({
        title: 'Não é possivel copiar imagens, o dev é preguiçoso',
        position: 'top',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: 'Mensagem copiada!',
        position: 'top',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } 
    catch (e) {
      toast({
        title: 'Falha ao copiar',
        position: 'top',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  return (
    <ListItem
      data-user-id={props.author.userId}
      display='flex'
      flexDirection='row'
      width='max-content'
      maxWidth='80%'
      p='0.5rem 1.5rem 0 1rem'
      borderRadius='1rem'
      position='relative'
      ml={isAuthor ? 'auto' : '0'}
      aria-label={`Mensagem de ${props.author?.name}`}
    >
      <OptionButton
        isAuthor={isAuthor}
        onDelete={handleDeleteMessage}
        onCopy={handleCopyToClipboard}
        textRef={messageRef}
        aria-label='Botão de opções'
      />

      <Avatar 
        display={['none', 'flex', 'flex', 'flex' ]}
        size='lg'
        mr='1rem' 
        name={props.author?.name} 
        src={props.author?.avatar} 
      />
      <VStack
        display='flex'
        spacing='1rem'
        bg={isAuthor ? 'green.700' : '#235390'}
        borderRadius='1rem'
        padding='1rem'
      >
        <Box
          display='flex'
          justifyContent='space-between'
          flexDirection='row'
          overflowWrap='break-word'
          width='100%'
        >
          <Text 
            color='#1cb0f6' 
            fontWeight='bold'
          >
            {props.author?.name}
          </Text> 
          <Text 
            color='#FFF' 
            fontStyle='italic'
            ml='3rem' 
            display={['none', 'none', 'flex', 'flex']}
            fontSize='0.8rem'
            aria-label='Data de envio da mensagem'
          >
            {props.date}
            </Text>
        </Box>
        { props.content?.startsWith(':sticker:') ? 
          (
            <Image
              w='100%'
              borderRadius='0.5rem'
              src={props.content?.replace(':sticker:', '')}
              alt='Gif animado'
            />
          ) : (
            <Text 
              w='100%'
              color='#fff'
              wordBreak='break-all'
              ref={messageRef}
              aria-label='Conteúdo da mensagem'
            >
              {props.content}
            </Text>
          )
        }
      </VStack>
    </ListItem>
  )
}