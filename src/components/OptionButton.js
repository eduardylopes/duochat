import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
} from '@chakra-ui/react'

import { BsThreeDots } from 'react-icons'

export function OptionButton() {
  return (
    <Menu>
      <MenuButton><BsThreeDots /></MenuButton>
      <Portal>
        <MenuList>
          <MenuItem>Menu 1</MenuItem>
          <MenuItem>New Window</MenuItem>
          <MenuItem>Open Closed Tab</MenuItem>
          <MenuItem>Open File</MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  )
}