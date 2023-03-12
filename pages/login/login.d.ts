import { UserSession } from '../../server/lib/auth'
import { ApiResponse } from '../../server/lib/types/api'

export type LoginApiResponse = ApiResponse<{
  token: string
  refreshToken: string
  session: UserSession
}>

export type RefreshApiResponse = ApiResponse<{
  token: string
}>
