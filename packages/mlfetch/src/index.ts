
import type { Url, MlOptions } from './types'

class Mlfetch {
  private urls: Url[] = []
  private timeout: number = 5000
  private poolingTime: number = 500
  private pollTimer: any
  // stateWindowSize: number
  private maxConcurrency: number = 10
  private originalMaxConcurrency: number = this.maxConcurrency
  private isFlowWorking: boolean[] = new Array(30).fill(false)
  private adjustInterval: number = 5000
  private adjustTimer: any
  private urlTimers = new Map<string, any>()

  constructor(options?: MlOptions) {
    if (options?.timeout) {
      this.timeout = options.timeout
    }
    if (options?.poolingTime) {
      this.poolingTime = options.poolingTime
    }
    if (options?.maxConcurrency) {
      this.maxConcurrency = options.maxConcurrency
    }
    if (options?.adjustInterval) {
      this.adjustInterval = options.adjustInterval
    }
    this.originalMaxConcurrency = this.maxConcurrency
  }

  private async fetchWithTimeout(url: string, options = {}) {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPromise = fetch(url, { ...options, signal });

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    return fetchPromise
      .then(response => {
        clearTimeout(timeoutId);
        return response;
      })
      .catch(error => {
        clearTimeout(timeoutId);
        throw error;
      });
  }

  public destroy() {
    this.urls.length = 0
    clearInterval(this.adjustTimer)
    clearInterval(this.pollTimer)
    this.urlTimers.forEach(timer => clearInterval(timer))
  }

  public enqueue(
    url: string,
    setCallback: Function,
    fetchOptions?: RequestInit
  ) {
    this.urls.push({
      url,
      setCallback,
      fetchOptions
    })
  }

  public enqueueWithInterval(
    url: string,
    interval: number,
    setCallback: Function,
    fetchOptions?: RequestInit
  ) {
    this.enqueue(url, setCallback, fetchOptions)
    const timer = setInterval(() => {
      this.enqueue(url, setCallback, fetchOptions)
    }, interval)
    this.urlTimers.set(url, timer)
  }

  public deleteUrlTimer(url: string) {
    if (this.urlTimers.has(url)) {
      clearInterval(this.urlTimers.get(url))
      this.urlTimers.delete(url)
      return 1
    } else {
      return -1
    }
  }

  private async request(index: number) {
    if (this.urls.length > 0) {
      this.isFlowWorking[index] = true
      const { url, setCallback, fetchOptions } = this.urls.shift()!
      try {
        this.fetchWithTimeout(url, fetchOptions)
          .then(response => response!.json())
          .then(data => {
            setCallback(data)
          })
          .catch(err => {
            if (err.name === 'AbortError') {
              console.error('Request timed out')
            }
            console.error(err)
          })
          .finally(() => {
            this.request(index)
          })
      } catch (err) {
        console.error(err)
      }
    } else {
      this.isFlowWorking[index] = false
    }
  }

  private adjustMaxConcurrency() {
    this.adjustTimer = setInterval(() => {
      if (this.urls.length > 200) {
        this.maxConcurrency = 30
      }
      else if (this.urls.length > 100) {
        this.maxConcurrency = 20
      }
      else if (this.urls.length > 50) {
        this.maxConcurrency = 10
      }
      else {
        this.maxConcurrency = this.originalMaxConcurrency
      }
    }, this.adjustInterval)
  }

  private startRequest() {
    this.pollTimer = setInterval(() => {
      for (let i = 0; i < this.maxConcurrency; i++) {
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
}

export default Mlfetch
