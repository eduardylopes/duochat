import { ref, set } from 'firebase/database'
import { database } from '../services/firebase';
import { Tooltip, Text } from '@chakra-ui/react'
import { Avatar, Image, Box, VStack, ListItem } from '@chakra-ui/react'
import { useAuth } from '../hooks/useAuth';
import { OptionButton } from './OptionButton'

export function Message(props) {

  const { user } = useAuth();
  const isAuthor = props.author.userId === user?.id

  function handleDeleteMessage() {
    if(isAuthor) {
      const messageRef = ref(database, `/messages/${props.messageId}`)
      set(messageRef, null)
    }
  }

  // function handleCopyToClipboard() {
  //   navigator.clipboard.writeText(this.state.textToCopy)}
  // }

  return (
    <ListItem
      display='flex'
      flexDirection='row'
      width='max-content'
      maxWidth='80%'
      p='0.5rem 1.5rem 0 1rem'
      borderRadius='1rem'
      position='relative'
      ml={isAuthor ? 'auto' : '0'}
    >

      <Tooltip hasArrow label="Opções" aria-label='Opções'>
        <OptionButton 
          isAuthor={isAuthor}
          onDelete={handleDeleteMessage}
          // onCopy={handleCopyToClipboard}
          // onEdit={handleEditMessage}
        />
      </Tooltip>

      <Avatar 
        display={['none', 'flex', 'flex', 'flex' ]}
        size='lg'
        mr='1rem' 
        name={props.author.name} 
        src={props.author.avatar} 
      />
      <VStack
        display='flex'
        spacing='1rem'
        bg='#235390'
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
            {props.author.name}
          </Text> 
          <Text 
            color='#FFF' 
            fontStyle='italic'
            ml='3rem' 
            display={['none', 'none', 'flex', 'flex']}
            fontSize='0.8rem'
          >
            {props.date}
            </Text>
        </Box>
        { props.content.startsWith(':sticker:') ? 
          (
            <Image
              w='100%'
              borderRadius='0.5rem'
              src={props.content.replace(':sticker:', '')}
            />
          ) : (
            <Text 
              w='100%'
              color='#fff'
              wordBreak='break-all'
            >
              {props.content}
            </Text>
          )
        }
      </VStack>
    </ListItem>
  )
}