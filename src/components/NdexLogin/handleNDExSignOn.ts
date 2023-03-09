const LOGGED_IN_USER = 'loggedInUser'

const handleNDExSignOn = (userInfo, onSuccessLogin) => {
  const loginInfo = { isGoogle: false, loginDetails: userInfo }

  const loggedInUser = {
    externalId: userInfo.details.externalId,
    firstName: userInfo.details.firstName,
    lastName: userInfo.details.lastName,
    token: userInfo.password,
    userName: userInfo.id,
  }

  window.localStorage.setItem(LOGGED_IN_USER, JSON.stringify(loggedInUser))

  onSuccessLogin(loginInfo)
}

export { handleNDExSignOn }
