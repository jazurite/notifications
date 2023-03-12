import { NextApiResponse } from 'next'
import { ApiResponse } from '../../server/lib/types/api'
import { UserSession } from '../../server/lib/types/auth'
import { withMiddlewares } from '../../server/middlewares'
import {
  authMiddleware,
  NextApiRequestWithUser,
} from '../../server/middlewares/auth-middleware'

export type UserApiResponse = ApiResponse<UserSession>

const getCurrentUserRoute = (
  req: NextApiRequestWithUser,
  res: NextApiResponse<UserApiResponse>
) => {
  res.status(200).json({
    success: true,
    data: req.user,
  })
}

export default withMiddlewares(authMiddleware, getCurrentUserRoute)
