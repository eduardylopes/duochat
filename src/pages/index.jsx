import { useAuth } from '../hooks/useAuth'
import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'

import { Button, Stack, Image, Text, Heading, SimpleGrid } from '@chakra-ui/react'
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const { signInWithGithub, signInWithGoogle, onlineUsers} = useAuth();

  console.log(onlineUsers)

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
      <Toaster />
      <Stack
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='center'
        mx='auto'
        maxWidth='1024px'
        h='auto'
        sx={{
          '@media (max-width: 768px)': {
            flexDirection: 'column',
          },
        }}
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
          <Text
            color='white'
            fontSize='2xl'
            fontWeight='extrabold'
          >Entrar</Text>
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
