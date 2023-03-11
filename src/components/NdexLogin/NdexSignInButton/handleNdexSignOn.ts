import { NdexCredentialTag } from '../NdexCredentialTag'

type NdexBasicAuthInfo = {
  externalId: string
  firstName: string
  lastName: string
  password: string
  userName: string
}

/**
 * Store the user's credentials in local storage
 * TODO: in the long term, this will be removed.
 *
 * @param userInfo
 * @param onSuccessLogin
 */
export const handleNdexSignOn = (
  userInfo: any,
  onSuccessLogin: (loginInfo: any) => void,
): void => {
  const loggedInUser: NdexBasicAuthInfo = {
    externalId: userInfo.details.externalId,
    firstName: userInfo.details.firstName,
    lastName: userInfo.details.lastName,
    password: userInfo.password,
    userName: userInfo.id,
  }

  window.localStorage.setItem(
    NdexCredentialTag.NdexCredential,
    JSON.stringify(loggedInUser),
  )

  onSuccessLogin(loggedInUser)
}
