type NdexCredential = {
  loaded: boolean
  isLogin: boolean
  isGoogle: boolean
  oauth?: object
  basic?: {
    userId: string
    password: string
  }
  accesskey?: string
}

export default NdexCredential
