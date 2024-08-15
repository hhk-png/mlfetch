import type { MlOptions, MlOptionsKeys, QueueItem } from './types'

class FetchError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public url: string,
    public headers: Headers
  ) {
    super(message);
    this.name = "FetchError";
  }
}

function extractUrl(url: string | URL | Request): string {
  if (url instanceof Request) {
    return url.url
  }
  if (url instanceof URL) {
    return url.href
  }
  return url
}

class Mlfetch {
  private urls: QueueItem[] = []
  private poolingTime: number = 500
  private pollTimer: any
  // stateWindowSize: number
  private concurrency: number = 6
  private isFlowWorking: boolean[] = new Array(30).fill(false)
  private adjustInterval: number = 5000
  private requestTimeWindowLength: number = 30
  private adjustTimer: any
  private urlTimers = new Map<string, any>()

  private pickOptions(options?: MlOptions) {
    for (const key in options) {
      this[key as MlOptionsKeys] = options[key as MlOptionsKeys]!
    }
  }

  constructor(options?: MlOptions) {
    this.pickOptions(options)
  }

  // request time window
  private requestTimes: number[] = new Array(this.requestTimeWindowLength).fill(0)
  private averageRequestTime = 0
  private totalRequestTime = 0
  private timeIndex: number = 0
  private setRequestTime(time: number) {
    this.totalRequestTime -= this.requestTimes[this.timeIndex]
    this.requestTimes[this.timeIndex] = time
    this.totalRequestTime += time
    this.averageRequestTime = this.totalRequestTime / this.requestTimeWindowLength
    this.timeIndex = (this.timeIndex + 1) % this.requestTimeWindowLength
  }

  private async request(index: number) {
    if (this.urls.length > 0) {
      this.isFlowWorking[index] = true
      const {
        url,
        type,
        timeout,
        setCallback,
        errorCallback,
        fetchOptions,
      } = this.urls.shift()!

      const controller = new AbortController();
      const signal = controller.signal;
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout || 5000);

      try {
        const startTime = Date.now()
        fetch(url, { ...fetchOptions, signal })
          .then((response: Response) => {
            clearTimeout(timeoutId);
            this.setRequestTime(Date.now() - startTime)
            if (!response.ok) {
              throw new FetchError(
                `Request failed with status ${response.status}`,
                response.status,
                response.statusText,
                extractUrl(url),
                response.headers
              );
            }
            return response[type]()
          })
          .then(data => setCallback(data))
          .catch((err: Error) => {
            clearTimeout(timeoutId);
            this.setRequestTime(Date.now() - startTime)
            errorCallback && errorCallback(err)
          })
          .finally(() => {
            this.request(index)
          })
      } catch (error) {
        errorCallback && errorCallback(error as Error)
      }
    } else {
      this.isFlowWorking[index] = false
    }
  }

  private numOfRequestInAdjustTime = 0
  public enqueue(item: QueueItem) {
    this.numOfRequestInAdjustTime++
    this.urls.push(item)
  }

  public enqueueWithInterval(item: QueueItem, interval: number) {
    this.enqueue(item)
    const timer = setInterval(() => {
      this.enqueue(item)
    }, interval)
    this.urlTimers.set(extractUrl(item.url), timer)
  }

  public deleteUrlTimer(url: string | URL | Request) {
    const urlStr = extractUrl(url)
    if (this.urlTimers.has(urlStr)) {
      clearInterval(this.urlTimers.get(urlStr))
      this.urlTimers.delete(urlStr)
      return true
    }
    return undefined
  }

  private adjustMaxConcurrency() {
    this.adjustTimer = setInterval(() => {
      const couldRequestPerSecond = 1000 / this.averageRequestTime
      const requestPerSecond = (this.numOfRequestInAdjustTime * 1000) / this.adjustInterval
      this.concurrency = Math.ceil(requestPerSecond / couldRequestPerSecond)
      this.numOfRequestInAdjustTime = 0
      if (this.urls.length > 100) {
        this.concurrency += 5
      }
    }, this.adjustInterval)
  }

  private startRequest() {
    this.pollTimer = setInterval(() => {
      for (let i = 0; i < this.concurrency; i++) {
        if (!this.isFlowWorking[i]) {
          this.request(i)
        }
      }
    }, this.poolingTime)
  }

  public run() {
    this.startRequest()
    this.adjustMaxConcurrency()
  }

  public destroy() {
    clearInterval(this.adjustTimer)
    clearInterval(this.pollTimer)
    this.urlTimers.forEach(timer => clearInterval(timer))
    this.urls.length = 0
  }
}

export default Mlfetch
