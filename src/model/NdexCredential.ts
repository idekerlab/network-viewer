type NdexCredential = {
  isLogin: boolean
  isGoogle: boolean
  oauth?: object
  basic?: {
    userId: string
    password: string
  }
}

export default NdexCredential
