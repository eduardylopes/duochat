import { useAuth } from '../hooks/useAuth'
import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'
import { RiRadioButtonLine } from 'react-icons/ri'

import { Button, Box, Image, Text, Heading, SimpleGrid, Stack } from '@chakra-ui/react'

export default function Home() {
  const { signInWithGithub, signInWithGoogle, usersData } = useAuth();

  return (
    <Stack
      w='100vw'
      h='100vh'
      display='flex'
      justifyContent='center'
      alignItems='center'
      background='blue.600'
      backgroundImage="url('/star-pattern.svg')"
      fontFamily='M PLUS Rounded 1c'
    >
      <Stack
        display='flex'
        flexDirection={['column', 'column', 'row', 'row']}
        alignItems='center'
        justifyContent='center'
        mx='auto'
        maxWidth='1024px'
        h='auto'
      >
        <Image
          boxSize='300px'
          objectFit='cover'
          src='earth.svg'
          alt='Dan Abramov'
        />
        <Stack
          display='flex'
          alignItems='center'
          justifyContent='center'
          spacing='2rem'
        >
          <Heading 
            as="h1"
            textAlign='center'
            color='white'
          >
            O jeito grátis, divertido e eficaz de aprender um idioma!
          </Heading>
          <Box
            display='flex'
            flexDirection='row'
            justifyContent='center'
            alignItems='center'
            color='green'
          >
            <RiRadioButtonLine size={20}/>
            <Text
              textAlign='center'
              fontSize='1rem'
              fontWeight='800'
              ml='0.3rem'
            >
              {usersData.length} Online
            </Text>
          </Box>
          <SimpleGrid
            display='flex'
            flexDirection='row'
            spacing={10}
            minChildWidth={150}
            sx={{
              '@media (max-width: 768px)': {
                flexDirection: 'column',
              },
            }}
          >
            <Button
              onClick={() => signInWithGoogle()}
              colorScheme='gray'
              leftIcon={<FcGoogle />}
              fontSize={24}
            >
              Google
            </Button>
            <Button
              onClick={() => signInWithGithub()}
              colorScheme='gray' 
              leftIcon={<BsGithub />}
              fontSize={24}
            >
              Github
            </Button>
          </SimpleGrid>
        </Stack>
      </Stack>
    </Stack>
  )
}
