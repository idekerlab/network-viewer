type UserValidation = {
  status: number
  userData: any | null
  error: any | null
}

async function validateLogin(
  id: string,
  password: string,
  ndexServer: string
): Promise<UserValidation> {
  const auth = 'Basic ' + btoa(id + ':' + password)
  const headers = {
    authorization: auth,
  }
  const url = ndexServer + '/v2/user?valid=true'

  const res: Response = await fetch(url, {
    method: 'GET',
    headers: headers,
  })
  const status = res.status
  let userData = await res.json()

  let error = null
  if (!res.ok) {
    error = userData
    userData = null
  }

  const validation: UserValidation = {
    status,
    userData,
    error,
  }

  return validation
}

export { validateLogin, UserValidation }
