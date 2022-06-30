### 目标

优化 `getUserInfo` 请求

### 要求

- `getUserInfo` 是个通用接口，在各个模块里面都有可能使用
- 在一个页面有ABC3个模块，ABC的执行顺序不可控，各自都调用`getUserInfo`，需要优化成只有一次请求
