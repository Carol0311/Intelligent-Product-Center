export interface Btn {
  type: string
  name: string
  action: string
  payload?: Record<string, any>
}
export interface ErrorInfo {
  type: string
  message: string
  buttons?: Btn[]
}
export interface ShortErrorInfo {
  success: boolean
  message: string
}
