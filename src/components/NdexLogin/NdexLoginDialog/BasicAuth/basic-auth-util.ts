import { NdexCredentialTag } from '../../NdexCredentialTag'
import { NdexBasicAuthInfo } from '../../NdexSignInButton/handleNdexSignOn'

export const getBasicAuth = (): NdexBasicAuthInfo | undefined => {
  const basicAuthInfo: string =
    window.localStorage.getItem(NdexCredentialTag.NdexCredential) ?? ''

  if (basicAuthInfo === undefined || basicAuthInfo === '') {
    return
  }

  return JSON.parse(basicAuthInfo) as NdexBasicAuthInfo
}

// Save the basic auth info to local storage
export const saveBasicAuth = (loggedInUser: NdexBasicAuthInfo): void => {
  const userString: string = JSON.stringify(loggedInUser)
  window.localStorage.setItem(NdexCredentialTag.NdexCredential, userString)
}
