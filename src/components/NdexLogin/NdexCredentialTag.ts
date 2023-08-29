/**
 * This tag is used to store the user credential in the local storage.
 */

export const NdexCredentialTag = {
  NdexCredential: 'loggedInUser',
} as const

export type NdexCredentialTag =
  (typeof NdexCredentialTag)[keyof typeof NdexCredentialTag]
