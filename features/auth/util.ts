import { verifyToken } from '../../server/lib/jwt'

export const verifyAccessToken = (token: string) => {
  // If environment variable is not set, throw an error
  if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not set')
  }

  return verifyToken(token, process.env.JWT_ACCESS_TOKEN_SECRET)
}
