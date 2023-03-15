import { NdexCredentialTag } from '../NdexCredentialTag'
import { NdexBasicAuthInfo } from '../NdexLoginDialog/BasicAuth/NdexBasicAuthInfo'

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
