export interface MlOptions {
  poolingTime?: number
  concurrency?: number
  adjustInterval?: number
  requestTimeWindowLength?: number
}

export type MlOptionsKeys = keyof MlOptions

type BodyMethodNames = {
  [K in keyof Body]: Body[K] extends (...args: any[]) => any ? K : never
}[keyof Body];

export interface QueueItem {
  url: string | URL | Request
  type: BodyMethodNames
  timeout?: number
  setCallback: (res: any) => unknown
  errorCallback?: (err: Error) => unknown
  fetchOptions?: RequestInit
}
