export type DownloadProps = {
  data?: object
  fetchCX2?: () => Promise<object>
  tooltip?: string
  fileName?: string
}
