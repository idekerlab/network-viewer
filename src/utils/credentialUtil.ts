import NdexCredential from '../model/NdexCredential'
import * as ndex from 'ndex-client'

// const script = document.createElement('script')
// script.src = 'https://apis.google.com/js/client.js'
// const gapi = window['gapi']

const getGoogleHeader = (userInfo) => {
  const token = userInfo.tokenObj.token_type + ' ' + userInfo.tokenObj.id_token

  console.log('G Outh = ', token)
  return {
    authorization: token,
  }
}

const getNdexClient = (baseUrl: string, ndexCredential: NdexCredential) => {
  const ndexClient = new ndex.NDEx(baseUrl)
  ndexClient.getStatus().then((response) => {
    console.log('* NDEx Status checked: ' + response.message)
  })

  if (!ndexCredential.isLogin) {
    return ndexClient
  }

  if (ndexCredential.isGoogle) {
  } else {
    const basicAuth = ndexCredential.basic
    ndexClient.setBasicAuth(basicAuth.userId, basicAuth.password)
    console.log('----NDEx client status ::', ndexClient)
  }
  return ndexClient
}

const initClient = () => {
}

// gapi.load('client', () => {
//   console.log('2222222222222222&&&&&&&&&&&&&&&&&&&&&&&&&&&&LOADED+++++++++++++++GAPI client status ::', gapi)

//   const init = gapi.client
//     .init({
//       client_id: '802839698598-mrrd3iq3jl06n6c2fo1pmmc8uugt9ukq.apps.googleusercontent.com',
//       scopes: 'profile email',
//     })
//     console.log(init)




//     setTimeout(() => {
//       const googleAuth = gapi.auth2.getAuthInstance()
//       console.log('After 5:', googleAuth)


//     }, 5000);

//     // .then(
//     //   function () {
//     //     const authInstance = gapi.auth2.getAuthInstance()

//     //     console.log('AU&&&&&&&&&&&&&&&&&&&&&&&&& ::', authInstance)
//     //     authInstance.isSignedIn.listen(_updateStatus)
//     //     _updateStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
//     //   },
//     //   (err) => {
//     //     console.warn('GAPI Error: ', err)
//     //   },
//     // )

// })

function checkCurrentStatus() {}

// const _updateStatus = (isSignedIn) => {
//   if (isSignedIn) {
//     const curUser = gapi.auth2.getAuthInstance().currentUser.get()
//     console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&USR::', curUser)
//   }
// }

export { getGoogleHeader, getNdexClient, checkCurrentStatus }
