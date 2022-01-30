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
        bottom='0.3rem'
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
          fontSize='3rem'
          lineHeight='0'
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
            >
              Excluir
            </MenuItem>
            <MenuItem 
            _hover={{ background: '#255390' }}
            >
              Editar
            </MenuItem>
            <MenuItem
              // onClick={() => props.onCopy()}
              _hover={{ background: '#255390' }}
            >
              Copiar
            </MenuItem>
          </>
          ) : (
          <MenuItem _hover={{ background: '#255390' }}>Copiar</MenuItem>
        ) }
      </MenuList>
    </Menu>
  );
}