import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
} from '@chakra-ui/react'

import {
  ListItem,
  UnorderedList,
  Image,
} from '@chakra-ui/react'

import { Input, InputLeftElement, InputGroup, Button } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { BiSticker } from 'react-icons/bi'
import { getGif } from '../services/giphy'
import { useState } from 'react'

export function GifPopup(props){

  const [isOpen, setIsOpen] = useState(false)
  const [gifs, setGifs] = useState([]);
  const [inputValue, setInputValue] = useState('')
  const close = () => setIsOpen(false)
  const open = () => setIsOpen(!isOpen)
  
  function handleGifList(endpoint, value='') {

    if (value.trim() == '') {
      endpoint = 'trending'
    }
    getGif(endpoint, value).then(response => setGifs(response))
  }

  return (
    <Popover
      placement='left'
      position='relative'
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
        >
          <BiSticker size='2rem'/>
        </Button>
      </PopoverTrigger>
      <PopoverContent bg='#042c60' color='white'position='absolute' right='0' bottom='0'>
        <PopoverHeader>
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon color='gray.300' />}
          />
          <Input 
            placeholder='Pesquise por um GIF'
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
          gridTemplateColumns='repeat(3, 1fr)'
          gap='0.3rem'
          flexDirection='row'
          w='auto'
          maxH='30vh'
          overflowY='scroll'
          p='0'
          m='0.5rem'
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
