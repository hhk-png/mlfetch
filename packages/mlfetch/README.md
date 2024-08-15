## Install

`pnpm install mlfetch` or

`yarn add mlfetch ` or

`npm install mlfetch` etc.

## Usage

```typescript
import Mlfetch from 'mlfetch'

const mlfetch = new Mlfetch()

for (let i = 0; i < 80; i++) {
  ml.enqueueWithInterval({
    url: `https://jsonplaceholder.typicode.com/photos/i`,
    type: 'json',
    setCallback: (json: Photo) => {
      console.log(json)
      info.value = json
    }
  }, 1000)
}

setTimeout(() => {
  ml.destroy()
}, 20000)

mlfetch.run()
```

## interface

### MlOptions

**properties：**

- **poolingTime** (`number`, `optional`, default: `500`): The interval for polling request process，measured in milliseconds (**ms**)
- **concurrency** (`number`, `optional`, default: `6`): Initial concurrency
- **adjustInterval** (`number`, `optional`, default: `5000`): The interval for adjusting concurrency, measured in milliseconds (**ms**)
- **requestTimeWindowLength** (`number`, `optional`, default: `30`): The statistical window size for calculating the average request time. To calculate the average request time for the nearest `requestTimeWindowLength` times

**typescript definition：**

```typescript
interface MlOptions {
  poolingTime?: number
  concurrency?: number
  adjustInterval?: number
  requestTimeWindowLength?: number
}
```

### QueueItem

**properties：**

- **url** (`string|URL|Request`): The requested URL, which is the same as the first parameter of fetch

- **type** (`BodyMethodNames`): The type of resource requested，`"arrayBuffer" | "blob" | "formData" | "json" | "text"`
- **timeout** (`number`, `optional`, default: `5000`): Timeout: The number of seconds after which a request is considered timed out.
- **setCallback** (`(res: any) => unknown`): The callback function for a successful request. The value passed in is the result processed by `response[type]()`.
- **errorCallback** (`(err: Error) => unknown`, `optional`): The callback function for a failed request
- **fetchOptions** (`RequestInit`, `optional`): the second parameter of fetch

**typescript definition：**

```typescript
interface QueueItem {
  url: string | URL | Request
  type: BodyMethodNames
  timeout?: number
  setCallback: (res: any) => unknown
  errorCallback?: (err: Error) => unknown
  fetchOptions?: RequestInit
}
```

### BodyMethodNames

**typescript definition：**

```typescript
type BodyMethodNames = {
  [K in keyof Body]: Body[K] extends (...args: any[]) => any ? K : never
}[keyof Body]
// "arrayBuffer" | "blob" | "formData" | "json" | "text"
```

## API

### new Mlfetch(options?: MlOptions)

**description:**

Initialize the request management queue

**parameters**:

- **options**: (`MlOptions`, `optional`) See **interface**

### Mlfetch.enqueue(item: QueueItem): void

**description：**

Push the request descriptor object `item` into the request queue

**parameters：**

- **item**: (`QueueItem`): See **interface**

### Mlfetch.enqueueWithInterval(item: QueueItem, interval: number): void

**description：**

Push the request object into the queue by starting a timer. The request is first push into the queue once before starting the timer."

**parameters：**

- **item**: (`QueueItem`): The definition of `QueueItem` can be found in **interface**.
- **interval**: (`number`): Timer interval

### Mlfetch.deleteUrlTimer(url: string | URL | Request): true | undefined

**description：**

Delete the timer for the URL request added via `enqueueWithInterval`. Returns `true` if the deletion is successful; returns `undefined` if the URL is not in the queue, indicating the deletion failed.

**parameters：**

- **url** (`string | URL | Request`): The URL of the request

**returned value：**

- `true | undefined`: Returns `true` if the deletion is successful; returns `undefined` if the URL is not in the queue, indicating the deletion failed.

### Mlfetch.run(): void

**description：**

Start the request timer and the auto-adjust concurrency timer

### Mlfetch.destroy(): void

**parameters：**

Delete all timers and reset the queue length to zero. You can call `run()` to restart the process.
