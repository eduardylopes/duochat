import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'

import { BsThreeDotsVertical } from 'react-icons/bs'
import { DeleteIcon, EditIcon, CopyIcon } from '@chakra-ui/icons'

export function MenuDotButton() {
  return (
    <Menu>
      <MenuButton
        as={BsThreeDotsVertical}
        aria-label='Options'
        icon={<BsThreeDotsVertical />}
        variant='outline'
      />
      <MenuList>
        <MenuItem icon={<DeleteIcon />}>
          Excluir
        </MenuItem>
        <MenuItem icon={<EditIcon />}>
          Editar
        </MenuItem>
        <MenuItem icon={<CopyIcon />}>
          Copiar
        </MenuItem>
      </MenuList>
    </Menu>
  )
}