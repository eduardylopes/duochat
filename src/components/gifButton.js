import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  ButtonGroup,
  InputLeftElement,
  InputGroup,
  Input,
  Stack,
  Box
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { AiOutlineFileGif } from 'react-icons/ai'

import { useRef } from 'react'

export function GifPopup() {
  const initialFocusRef = useRef()
  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement='top'
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Button
          p='0' 
          bg="transparent"
        >
          <AiOutlineFileGif size="large"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent color='white' bg='blue.800' borderColor='blue.800' bg="#042c60" pt='1rem'>
        <PopoverArrow />
        <InputGroup alignItems='center' px='0.5rem' pt='0'>
          <InputLeftElement
            mx='0.5rem'
            pointerEvents='none'
            children={<SearchIcon color='gray.300' />}
          />
          <Input placeholder='Procure por um GIF' />
          <PopoverCloseButton />
        </InputGroup>
        <PopoverBody overflowY="scroll" minHeight='100px'>
        </PopoverBody>
        <PopoverFooter
          border='0'
          d='flex'
          alignItems='center'
          justifyContent='space-between'
          pb={4}
        >
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}