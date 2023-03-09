import { useState, useCallback } from 'react'
import NDExUserModel from '../model/NDExUserModel'
import HttpResponse from './HttpResponse'

export async function callApi<T>(
  request: RequestInfo,
  settings?,
): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request, settings)

  try {
    response.parsedBody = await response.json()
  } catch (ex) {
    console.error('API Call error:', ex)
  }

  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response
}

export async function callTextApi(
  request: RequestInfo,
  settings,
): Promise<HttpResponse<string>> {
  const response: HttpResponse<string> = await fetch(request, settings)

  try {
    response.parsedBody = await response.text()
  } catch (ex) {
    console.error('API Call error:', ex)
  }

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return response
}

export function signUp(ndexServer, api) {
  console.log('Sign Up!', ndexServer + api)
}

export const getUserByEmail = async (ndexServer, api, emailAddress) => {
  const path = '/' + api + '/user?email=' + emailAddress
  const apiCall = ndexServer + path
  return callApi(apiCall, undefined)
}

export const getUserByUserName = async (ndexServer, api, userName) => {
  const path = '/' + api + '/user?username=' + userName
  const apiCall = ndexServer + path
  return callApi(apiCall, undefined)
}

export const useUserProfile = (ndexServer: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [data, setData] = useState<string>()

  const execute = async (email) => {
    try {
      setIsLoading(true)
      setError(undefined)
      setData(undefined)
      if (email) {
        const newData: any = await getUserByEmail(ndexServer, 'v2', email)
        setData(newData.parsedBody)
        return newData
      } else {
        setData(undefined)
        return undefined
      }
    } catch (e) {
      setError('Error getting user profile: ' + e)
      setIsLoading(false)
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    data,
    execute: useCallback(execute, []), // to avoid infinite calls when inside a `useEffect`
  }
}

export const emailNewPassword = async (ndexServer, api, userId) => {
  const path = '/' + api + '/user/' + userId + '/password?forgot=true'
  const apiCall = ndexServer + path

  const putConfig = {
    method: 'PUT',
  }

  return callApi(apiCall, putConfig)
}

const emailRE =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isValidEmail = (inputString: string) => {
  return emailRE.test(String(inputString).toLowerCase())
}

export const getUserBySearch = async (
  ndexServer: string,
  api: string,
  emailAddress: string,
) => {
  let response

  if (isValidEmail(emailAddress)) {
    try {
      response = await getUserByEmail(ndexServer, api, emailAddress)
    } catch (error) {
      response = await getUserByUserName(ndexServer, api, emailAddress)
    }
  } else {
    response = await getUserByUserName(ndexServer, api, emailAddress)
  }
  return response.parsedBody.externalId
}

export const resetPassword = async (ndexServer, api, searchString) => {
  const user = await getUserBySearch(ndexServer, api, searchString)
  const result = await emailNewPassword(ndexServer, api, user)
  console.log('Result of resetPassword: ' + result)
  return user
}

export const useResetPassword = (ndexServer) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [data, setData] = useState<string>()

  const execute = async (user) => {
    try {
      setIsLoading(true)
      setError(undefined)
      setData(undefined)
      const newData = await resetPassword(ndexServer, 'v2', user)
      setData(newData)
      return newData
    } catch (e) {
      setError('Cannot find user.')
      setIsLoading(false)
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    data,
    execute: useCallback(execute, []), // to avoid infinite calls when inside a `useEffect`
  }
}

export const createUser = async (
  ndexServer: string,
  api: string,
  user: NDExUserModel,
) => {
  const path = '/' + api + '/user'
  const apiCall = ndexServer + path

  const postConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }

  return callTextApi(apiCall, postConfig)
}

export const useCreateUser = (ndexServer) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [data, setData] = useState<string>()

  const execute = async (user: NDExUserModel) => {
    try {
      setIsLoading(true)
      setError(undefined)
      setData(undefined)
      const newData: any = await createUser(ndexServer, 'v2', user)

      setData(newData.parsedBody)
      return newData
    } catch (e) {
      setError('Cannot create user: ' + e)
      setIsLoading(false)
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    data,
    execute: useCallback(execute, []), // to avoid infinite calls when inside a `useEffect`
  }
}

const USERNAME_LENGTH_LIMIT = 95

export const getUniqueUserName = async (ndexServer, api, email: string) => {
  let userName = email.replace(/@.*$/, '')

  if (userName.length > USERNAME_LENGTH_LIMIT) {
    // get first $scope.limitOfUserNameLength of user name
    userName = userName.substring(0, USERNAME_LENGTH_LIMIT)
  }
  try {
    let counter = 1
    while (await getUserByUserName(ndexServer, api, userName)) {
      userName = userName + counter
      counter++
    }
  } catch (error) {}
  return userName
}

export const createGoogleUser = async (
  ndexServer: string,
  api: string,
  tokenId: string,
  email: string,
) => {
  const path = '/' + api + '/user?idtoken=' + tokenId
  const apiCall = ndexServer + path

  const userName = await getUniqueUserName(ndexServer, api, email)

  const postConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName: userName }),
  }

  return callTextApi(apiCall, postConfig)
}

export const useCreateGoogleUser = (ndexServer) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [data, setData] = useState<string>()

  const execute = async (tokenId, email) => {
    try {
      setIsLoading(true)
      setError(undefined)
      setData(undefined)
      const newData: any = await createGoogleUser(
        ndexServer,
        'v2',
        tokenId,
        email,
      )

      setData(newData.parsedBody)
      return newData
    } catch (e) {
      setError('Cannot create user: ' + e)
      setIsLoading(false)
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    data,
    execute: useCallback(execute, []), // to avoid infinite calls when inside a `useEffect`
  }
}
