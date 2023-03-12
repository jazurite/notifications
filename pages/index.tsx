import {
  Box,
  Divider,
  Heading,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next'
import { useRouter } from 'next/router'
import useSWR, { SWRConfig } from 'swr'
import Navbar from '../components/Navbar'
import NavbarProfile from '../components/NavbarProfile'
import { useAuth } from '../features/auth/provider/AuthProvider'

import { prisma } from '../server/lib/db'
import PostLibrary from '../components/PostLibrary'
import { PostsApiResponse } from './api/posts'

import { fetcher } from '@auth'
import { withAuth } from '@server/auth'

export const getServerSideProps = (context: GetServerSidePropsContext) => withAuth(context, async () => {

  const posts = await prisma.post.findMany()

  const postsJson = JSON.parse(JSON.stringify(posts))

  const postsApiResponse: PostsApiResponse = {
    success: true,
    data: {
      posts: postsJson,
    },
  }

  return {
    props: {
      fallback: {
        '/api/posts': postsApiResponse,
      },
    },
  }
})

const HomePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ fallback }) => {

  const {
    currentUser,
    logOut,
    isAuthenticated,
  } = useAuth()
  const router = useRouter()
  const toast = useToast()

  const {
    data: posts,
    error,
    mutate,
  } = useSWR<PostsApiResponse>('/api/posts', fetcher)

  return (
    <SWRConfig value={{ fallback }}>
      <Navbar
        homeURL="/"
        rightComponent={
          currentUser && [
            <NavbarProfile
              currentUser={currentUser}
              onLogOut={() => {
                logOut()
                router.push('/')
              }}
              key="avatar"
            />,
          ]
        }
      />
      <Box marginTop={'60px'} p={6}>
        <Heading>Your profile</Heading>
        <Divider mb={5} />
        {currentUser ? (
          <>
            <HStack>
              <Text fontWeight={'bold'}>User ID</Text>
              <Text>{currentUser.id}</Text>
            </HStack>
            <HStack>
              <Text fontWeight={'bold'}>Authenticated?</Text>
              <Text>{isAuthenticated ? 'Yes' : 'No'}</Text>
            </HStack>
            <HStack>
              <Text fontWeight={'bold'}>Username:</Text>
              <Text>
                {currentUser.name} {currentUser.surname}
              </Text>
            </HStack>
            <HStack>
              <Text fontWeight={'bold'}>Email:</Text>
              <Text>{currentUser.email}</Text>
            </HStack>
            <HStack>
              <Text fontWeight={'bold'}>Admin:</Text>
              <Text>{currentUser.role == 'ADMIN' ? 'Yes' : 'No'}</Text>
            </HStack>
          </>
        ) : (
          <Text fontSize="xl">You are not logged in</Text>
        )}

        <Heading mt={5}>Tesing - Post voting</Heading>
        <Divider mb={5} />
        <Text>
          Please, like or dislike the posts below. The data is persisted in the
          DB.
        </Text>

        <Box>
          <PostLibrary
            posts={posts}
            isLoading={!posts}
            error={error}
            mutate={mutate}
            onVoteError={error => {
              toast({
                title: 'Failed to vote',
                description: (error || '').toString(),
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            }}
          />
        </Box>
      </Box>
    </SWRConfig>
  )
}

export default HomePage
