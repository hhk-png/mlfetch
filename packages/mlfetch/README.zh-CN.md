## 安装

`pnpm install mlfetch` 或者

`yarn add mlfetch ` 或者

`npm install mlfetch` 等

## 使用

```typescript
import Mlfetch from 'mlfetch'

const mlfetch = new Mlfetch()

mlfetch.run()

export default mlfetch
```

## interface

### MlOptions

**属性：**

- **poolingTime** (`number`, `optional`, default: `500`): 轮询请求流程的时间间隔，单位为 ms(毫秒)
- **concurrency** (`number`, `optional`, default: `10`): 初始的最大并发数，
- **adjustInterval** (`number`, `optional`, default: `5000`): 调整并发数的时间间隔，单位为 ms(毫秒)
- **requestTimeWindowLength** (`number`, `optional`, default: `30`): 平均请求时间的统计窗口大小，计算近 requestTimeWindowLength 次的平均请求时间

**typescript 定义：**

```typescript
interface MlOptions {
  poolingTime?: number
  concurrency?: number
  adjustInterval?: number
  requestTimeWindowLength?: number
}
```

### QueueItem

**属性：**

- **url** (`string|URL|Request`): 请求的 url，与 fetch 的第一个参数相同

- **type** (`BodyMethodNames`): 请求资源的类型，为 `"arrayBuffer" | "blob" | "formData" | "json" | "text"`
- **timeout** (`number`, `optional`, default: `5000`): 超时时间，请求超过多少秒算超时
- **setCallback** (`(res: any) => unknown`): 成功请求的回调函数。传入的值是经过 `response[type]()` 处理后的结果
- **errorCallback** (`(err: Error) => unknown`, `optional`): 请求失败的回调函数
- **fetchOptions** (`RequestInit`, `optional`): fetch 的第二个参数

**typescript 定义：**

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

**typescript 定义：**

```typescript
type BodyMethodNames = {
  [K in keyof Body]: Body[K] extends (...args: any[]) => any ? K : never
}[keyof Body]
// "arrayBuffer" | "blob" | "formData" | "json" | "text"
```

## API

### new Mlfetch(options?: MlOptions)

**描述:**

初始化请求管理队列

**参数**:

- **options**: (`MlOptions`, `optional`) 见 **interface**

### Mlfetch.enqueue(item: QueueItem): void

**描述：**

将请求的描述对象放到请求队列中

**参数：**

- **item**: (`QueueItem`): 见 **interface**

### Mlfetch.enqueueWithInterval(item: QueueItem, interval: number): void

**描述：**

内部通过开启定时器轮询将请求对象放到队列中，开启定时器之前会先将请求放入到队列中一次

**参数：**

- **item**: (`QueueItem`): QueueItem 的定义见 **interface**
- **interval**: (`number`): 定时器的间隔

### Mlfetch.deleteUrlTimer(url: string | URL | Request): true | undefined

**描述：**

删除通过 `enqueueWithInterval` 添加的 url 请求的定时器。返回 true 表示删除成功，返回 undefined 表示队列中没有该 url，删除失败。

**参数：**

- **url** (`string | URL | Request`): 请求的 url

**返回值：**

- `true | undefined`: 返回 true 表示删除成功，返回 undefined 表示队列中没有该 url，删除失败。

### Mlfetch.run(): void

**描述：**

开启请求的定时器，和自动调整并发数的定时器

### Mlfetch.destroy(): void

**描述：**

删除所有的定时器，并将队列的长度清零，可以调用 `run()` 来重启过程
