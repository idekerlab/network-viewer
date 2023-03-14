import { AuthType } from './AuthType'

type NdexCredential = {
  authType: AuthType
  userName?: string
  accesskey?: string
  fullName?: string
}

export default NdexCredential
