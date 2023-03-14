import { NdexCredentialTag } from '../../NdexCredentialTag'

export const getBasicAuth = (): object | undefined => {
  const basicAuthInfo: string =
    window.localStorage.getItem(NdexCredentialTag.NdexCredential) ?? ''

  if (basicAuthInfo === undefined || basicAuthInfo === '') {
    return
  }

  const val = JSON.parse(basicAuthInfo)
  return val
}

export const setBasicAuth = (credential: object): void => {}
