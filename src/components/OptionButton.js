import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
} from '@chakra-ui/react'

export function OptionButton(props) {

  return (
    <Menu autoSelect={false}>
      <MenuButton 
        as={Button}
        aria-label='Opções'
        bg='none'
        p='0'
        m='0'
        right='2rem'
        bottom='0rem'
        color='whiteAlpha.800'
        position='absolute'
        _hover={{
          background: 'none',
          border: 'none'
        }}
        _active={{
          background: 'none',
          border: 'none'
        }}
        _focus={{
          border: 'none'
        }}
      >
        <Text
          fontSize='2rem'
          lineHeight='0'
          aria-label='Botão opções'
        >
          ...
        </Text>
      </MenuButton>
      <MenuList
        bg='#042c60'
        minWidth='max-content'
        color='#fff'
        border='none'
        w='max-content'
        _hover={{ background: '#042c60' }}
      >
        { props.isAuthor ? (
          <>
            <MenuItem 
            onClick={() => props.onDelete()}
            _hover={{ background: '#255390' }}
            aria-label='Excluir'
            >
              Excluir
            </MenuItem>
            <MenuItem
              onClick={() => props.onCopy(props.textRef)}
              _hover={{ background: '#255390' }}
              aria-label='Copiar'
            >
              Copiar
            </MenuItem>
          </>
          ) : (
          <MenuItem 
            onClick={() => props.onCopy(props.textRef)}
            _hover={{ background: '#255390' }}>Copiar</MenuItem>
        ) }
      </MenuList>
    </Menu>
  );
}