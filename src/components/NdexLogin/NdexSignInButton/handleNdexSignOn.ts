import { NdexCredentialTag } from '../NdexCredentialTag'

export type NdexBasicAuthInfo = {
  externalId: string
  firstName: string
  lastName: string
  password: string
  id: string
}

/**
 * Store the user's credentials in local storage
 * TODO: in the long term, this will be removed.
 *
 * @param userInfo
 * @param onSuccessLogin
 */
export const handleNdexSignOn = (loggedInUser: NdexBasicAuthInfo): void => {
  window.localStorage.setItem(
    NdexCredentialTag.NdexCredential,
    JSON.stringify(loggedInUser),
  )
}
