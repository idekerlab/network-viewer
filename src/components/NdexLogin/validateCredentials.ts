import { UserValidation } from './UserValidation'

/**
 * Utility function to validate user via basic auth
 */
export const validateLogin = async (
  id: string,
  password: string,
  ndexServer: string,
): Promise<UserValidation> => {
  const auth = 'Basic ' + btoa(id + ':' + password)
  const headers = {
    authorization: auth,
  }
  const url = ndexServer + '/v2/user?valid=true'

  try {
    const res: Response = await fetch(url, {
      method: 'GET',
      headers: headers,
    })

    const status: number = res.status
    const result: any = await res.json()

    let error: any
    if (!res.ok) {
      error = result
    }

    return {
      status,
      userData: result,
      error,
    } as UserValidation
  } catch (e) {
    console.error('Failed to validate user', e)
    return {
      status: 500,
      error: e,
    }
  }
}
