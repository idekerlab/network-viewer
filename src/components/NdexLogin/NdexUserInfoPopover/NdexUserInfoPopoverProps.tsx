export interface NdexUserInfoPopoverProps {
  userId: string
  userImage?: string
  userName: string
  onLogout: () => void
  anchorEl: any
  isOpen: boolean
  onClose: () => void
  myAccountUrl?: string
}
