export interface Url {
  url: string
  setCallback: Function
  fetchOptions?: RequestInit
}

export interface MlOptions {
  poolingTime: number
  // stateWindowSize: number
  maxConcurrency: number
  adjustInterval: number
  timeout?: number
}
