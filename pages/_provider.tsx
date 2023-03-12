import { ReactNode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '../features/auth/provider/AuthProvider'

const AllProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ChakraProvider>
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
  )
}

export default AllProviders
