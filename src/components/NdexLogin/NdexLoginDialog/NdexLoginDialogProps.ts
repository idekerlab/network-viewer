export type NdexLoginDialogProps = {
  // Open / Close the dialog
  setIsOpen: (state: boolean) => void
  isOpen: boolean

  onLoginStateUpdated: () => void
  myAccountUrl: string
  onLoginSuccess: (credential: any) => void
  onLogout: () => void
  onError: (error: any) => void
  handleError: (error: any) => void
  // errorMessage: string
}
