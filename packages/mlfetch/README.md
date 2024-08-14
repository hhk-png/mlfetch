## Install

`pnpm install mlfetch`

## Usage

```typescript
import Mlfetch from 'mlfetch'

const mlfetch = new Mlfetch()

mlfetch.run()

export default mlfetch
```

## API Reference

### new Mlfetch(options?: MlOptions)

**Description:**

Initialize the queue manager for requests

**Parameters**:

- MlOptions

### enqueue(url: string, setCallback: Function, fetchOptions?: RequestInit): void;

**Description:**

将一个请求和接收请求结果的的回调函数，放入请求队列中

**Parameters**:

- MlOptions

### enqueueWithInterval(url: string, interval: number, setCallback: Function, fetchOptions?: RequestInit): void;

### deleteUrlTimer(url: string): 1 | -1

### run(): void

### 3. **详细格式示例**

````markdown
# API Reference

## `add(a: number, b: number): number`

**Description**:
Adds two numbers and returns the result.

**Parameters**:

- `a` (`number`): The first number to add.
- `b` (`number`): The second number to add.

**Returns**:

- `number`: The sum of `a` and `b`.

**Example**:
​```typescript
const sum = add(3, 5);
console.log(sum); // Output: 8
```
