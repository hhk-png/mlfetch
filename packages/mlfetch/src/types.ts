export interface MlOptions {
  poolingTime?: number
  // stateWindowSize: number
  concurrency?: number
  adjustInterval?: number
  requestTimeWindowLength?: number
}

export type MlOptionsKeys = keyof MlOptions

type BodyMethodNames = {
  [K in keyof Body]: Body[K] extends (...args: any[]) => any ? K : never
}[keyof Body];

export interface QueueItem {
  url: string
  type: BodyMethodNames
  timeout?: number
  setCallback: Function
  errorCallback?: Function
  fetchOptions?: RequestInit
}
