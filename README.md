# mlfetch

mlfetch is a request manager for scenarios that require lots of requests to be sent, which uses fetch() api to send requests. It could also automatically adjust the concurrency based on the size of request queue.

You can click two link below to lean the usage of mlfetch. The implementation of mlfetch is loacted in `package/mlfetch`. And the test environment is located in `playground/jsonplaceholder`, it could handle the task of request `https://jsonplaceholder.typicode.com/photos/${i}` 80 times per second.

<center><a href="./packages/mlfetch/README.md">English</a> | <a href="./packages/mlfetch/README.zh-CN.md">简体中文</a></<center>
