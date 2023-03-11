import { LoginInfo } from './LoginInfo'

type NDExAccountModel = {
  loginInfo: LoginInfo
  setLoginInfo: (loginInfo: LoginInfo) => void

  isUserProfileLoading: boolean
  userProfile: any
  userProfileError?: string
  getUserProfile: Function
}

export default NDExAccountModel
