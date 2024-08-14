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
- **maxConcurrency** (`number`, `optional`, default: `6`): number 初始的最大并发数，
- **adjustInterval** (`number`, `optional`, default: `5000`): 调整并发数的时间间隔，单位为 ms(毫秒)
- **timeout** (`number`, `optional`, default: `5000`): 请求超时时间，超过该时间之后判断为超时，单位为 ms(毫秒)

**typescript 定义：**

```typescript
interface MlOptions {
  poolingTime?: number
  maxConcurrency?: number
  adjustInterval?: number
  timeout?: number
}
```

## API

### new Mlfetch(options?: MlOptions)

**描述:**

初始化请求管理队列

**参数**:

- **MlOptions** 见 **interface**

### enqueue(url: string, setCallback: Function, fetchOptions?: RequestInit): void;

**描述：**

将一个请求和接收请求结果的的回调函数，放入请求队列中

**参数**:

### enqueueWithInterval(url: string, interval: number, setCallback: Function, fetchOptions?: RequestInit): void;

**描述：**

内部通过开启定时器将该请求的对象放到队列中，开启定时器之前会先将请求放入到队列中一次

**参数：**

### deleteUrlTimer(url: string): 1 | -1

**描述：**

删除通过 `enqueueWithInterval` 添加的 url 请求的定时器。返回 1 表示删除成功，返回-1 表示队列中没有该 url，删除失败。

**参数：**

- **url** (`string`): string 请求的 url

### run(): void

**描述：**

开启请求的定时器，和自动调整并发数的定时器

### destroy(): void

**描述：**

删除所有的定时器，并将队列的长度清零
