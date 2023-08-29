import { AuthType } from './AuthType'

export type LoginInfo = {
  authType: AuthType
  username: string
  accessKey?: string
}
