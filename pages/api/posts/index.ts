import { Post, Vote } from '@prisma/client'
import { NextApiResponse } from 'next'
import { ApiResponse } from '../../../server/lib/types/api'
import { withMiddlewares } from '../../../server/middlewares'
import {
  authMiddleware,
  NextApiRequestWithUser,
} from '../../../server/middlewares/auth-middleware'
import { prisma } from '../../../server/lib/db'

export type PostWithVote = Post & {
  votes: Vote[]
}

export type PostsApiResponse = ApiResponse<{
  posts: PostWithVote[]
}>

const getCurrentUserRoute = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse<PostsApiResponse>
) => {
  // Fetch list of posts from database
  const posts = await prisma.post.findMany({
    include: {
      votes: {
        where: {
          userId: req.user.id,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Return list of posts
  res.status(200).json({
    success: true,
    data: {
      posts,
    },
  })
}

export default withMiddlewares(authMiddleware, getCurrentUserRoute)
