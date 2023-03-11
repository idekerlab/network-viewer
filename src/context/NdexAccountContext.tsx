import { useUserProfile } from '../api/ndex'
import { createContext, useContext, useState } from 'react'
import NDExAccountModel from '../model/NDExAccountModel'
import { LoginInfo } from '../model/LoginInfo'

export const NdexAccountContext = createContext<NDExAccountModel>(
  {} as NDExAccountModel,
)

export const NdexAccountProvider = ({ ndexServerUrl, children }) => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>()

  const {
    isLoading: isUserProfileLoading,
    data: userProfile,
    error: userProfileError,
    execute: getUserProfile,
  } = useUserProfile(ndexServerUrl)

  const defState: NDExAccountModel = {
    loginInfo,
    setLoginInfo,
    isUserProfileLoading,
    userProfile,
    userProfileError,
    getUserProfile,
  }

  return (
    <NdexAccountContext.Provider value={defState}>
      {children}
    </NdexAccountContext.Provider>
  )
}
export const useNDExAccountValue = () => useContext(NdexAccountContext)
