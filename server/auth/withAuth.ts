import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { verifyAccessToken } from '../../features/auth/util'
import { prisma } from '../lib/db'

const redirectToLogin = {
  redirect: {
    destination: '/login',
    permanent: false,
  },
}

export type AuthOptions = {
  redirectTo?: string
}

export const withAuth = async <T extends Object = any>(
  { req }: GetServerSidePropsContext,
  onSuccess: () => Promise<GetServerSidePropsResult<T>>,
  options: AuthOptions = {
    redirectTo: '/login'
  }
): Promise<GetServerSidePropsResult<T>> => {
  if (req.cookies.token) {

    const token = req.cookies.token.split(' ')[0]

    return verifyAccessToken(token)
      .then(async decoded => {
        const user = await prisma.user.findUnique({
          where: {
            id: decoded.id,
          },
        })

        if (!user) {
          return redirectToLogin
        } else {
          return onSuccess()
        }
      })
      .catch(err => {
        console.log(err)
        return redirectToLogin
      })
  } else {
    return redirectToLogin
  }
}
