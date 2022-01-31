import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  ListItem,
  UnorderedList,
  Image,
  Input, 
  InputGroup, 
  Button
} from '@chakra-ui/react'
import { BsFillEmojiSmileFill } from 'react-icons/bs'

import { SearchIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { getGif } from '../services/giphy'

export function GifPopup(props){

  const [isOpen, setIsOpen] = useState(false);
  const [gifs, setGifs] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(!isOpen);
  
  function handleGifList(endpoint, value='') {

    if (value.trim() == '') {
      endpoint = 'trending';
    }
    getGif(endpoint, value).then(response => setGifs(response));
  }

  return (
    <Popover
      placement='left'
      onClose={close}
      isOpen={isOpen}
    >
      <PopoverTrigger>
        <Button
          onClick={() => {
            open()
            handleGifList('trending')
          }}
          colorScheme='black' 
          variant='outline'
          borderRadius='1rem'
          px='0.5rem'
          color='white'
          right='0'
          bottom='0'
        >
          <BsFillEmojiSmileFill size='2rem'/>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        bg='#042c60' 
        color='white'
        right='0' 
        bottom='0'
        w='100%'
        mb='5rem'
      >
        <PopoverHeader>
        <InputGroup
          alignItems='center'
          position='relative'
        >
          <SearchIcon 
            position='absolute'
            left='10px'
          />
          <Input 
            placeholder='Pesquise por um GIF'
            pl='2rem'
            onKeyDown={event => {
              if(event.key == 'Enter') {
                handleGifList('search', inputValue)
              }
            }}
            onChange={event => setInputValue(event.target.value)}
            value={inputValue}
          />
        </InputGroup>
        </PopoverHeader>
        <UnorderedList
          display='grid'
          flexDirection='row'
          gridTemplateColumns={['repeat(2, 1fr)','repeat(3, 1fr)', 'repeat(3, 1fr)', 'repeat(3, 1fr)']}
          maxH='30vh'
          gap='0.3rem'
          p='0'
          m='0.5rem'
          overflowY='scroll'
        >
          { gifs.map(gif => {
            return (
              <ListItem
              key={gifs.indexOf(gif)}
              >
                <Image
                  onClick={() => {
                    if(props.onStickerClick) {
                      const gifPicture = gif.images.fixed_width.url
                      props.onStickerClick(gifPicture)
                    }
                    close()
                  }}
                  src={gif.images.fixed_width_small.url}
                  borderRadius='0.5rem'
                  cursor='pointer'
                  _hover={{
                    borderColor: 'black',
                    borderWidth: '1px'
                  }}
                >
                </Image>
              </ListItem>
            )
          })}
        </UnorderedList>
      </PopoverContent>
    </Popover>
  )
}
