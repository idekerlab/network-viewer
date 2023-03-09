import { useUserProfile } from '../api/ndex'
import { createContext, useContext, useState } from 'react'
import NDExAccountModel from '../model/NDExAccountModel'

export const NDExAccountContext = createContext<NDExAccountModel>(
  {} as NDExAccountModel,
)

export const NDExAccountProvider = ({
  ndexServerURL,
  googleClientId,
  children,
}) => {
  const [loginInfo, setLoginInfo] = useState<any>(null)

  const {
    isLoading: isUserProfileLoading,
    data: userProfile,
    error: userProfileError,
    execute: getUserProfile,
  } = useUserProfile(ndexServerURL)

  const defState: NDExAccountModel = {
    ndexServerURL,
    googleClientId,
    loginInfo,
    setLoginInfo,
    isUserProfileLoading,
    userProfile,
    userProfileError,
    getUserProfile,
  }

  return (
    <NDExAccountContext.Provider value={defState}>
      {children}
    </NDExAccountContext.Provider>
  )
}
export const useNDExAccountValue = () => useContext(NDExAccountContext)
