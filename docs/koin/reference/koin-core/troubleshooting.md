---
title: 故障排除
---

# 故障排除

本指南涵盖了调试、常见错误以及应避免的反模式。

## 循环依赖 (Circular Dependencies)

### 问题

```kotlin
// 循环依赖 - 将在运行时失败
class ServiceA(val serviceB: ServiceB)
class ServiceB(val serviceA: ServiceA)

module {
    single { ServiceA(get()) }
    single { ServiceB(get()) }  // 错误：循环依赖！
}
```

### 解决方案 1：延迟注入 (Lazy Injection)

通过延迟解析打破循环：

```kotlin
class ServiceA : KoinComponent {
    val serviceB: ServiceB by inject()  // 延迟注入
}

class ServiceB : KoinComponent {
    val serviceA: ServiceA by inject()  // 延迟注入
}

module {
    single { ServiceA() }
    single { ServiceB() }
}
```

### 解决方案 2：提取共享依赖项 (Extract Shared Dependency)

通过重构移除循环（推荐做法）：

```kotlin
// 提取共享逻辑
@Singleton
class SharedService

@Singleton
class ServiceA(private val shared: SharedService)

@Singleton
class ServiceB(private val shared: SharedService)
```

### 解决方案 3：使用接口 (Interface)

```kotlin
interface ServiceBContract {
    fun doSomething()
}

@Singleton
class ServiceA(private val serviceB: ServiceBContract)

@Singleton
class ServiceB(private val serviceA: ServiceA) : ServiceBContract
```

## 调试 (Debugging)

### 启用日志

```kotlin
startKoin {
    // 设置日志级别
    printLogger(Level.DEBUG)  // DEBUG, INFO, ERROR, NONE

    modules(appModule)
}
```

### 使用 `verify()` 验证模块

验证所有定义是否都能被解析：

```kotlin
// 在测试中
@Test
fun `verify all modules`() {
    appModule.verify()  // 如果缺少任何依赖项则失败
}
```

:::info
`verify()` 和 `checkModules()` 都将被 Koin 编译器插件中的原生编译时安全性取代。详见 [模块验证](/docs/reference/koin-test/verify)。
:::

## 常见错误

**缺少定义 (Missing Definition)：**
```
No definition found for class 'UserRepository'
```
修复方法：在模块中添加缺少的定义。

**循环依赖 (Circular Dependency)：**
```
Circular dependency detected
```
修复方法：使用延迟注入或进行重构（见上文）。

**未找到作用域 (Scope Not Found)：**
```
No scope definition found for 'MyScope'
```
修复方法：确保在访问作用域依赖项之前已创建作用域。

**多个定义 (Multiple Definitions)：**
```
Multiple definitions found for type 'ApiClient'
```
修复方法：使用限定符 (qualifiers) 来区分不同的定义。

## 常见反模式

### 1. 过度使用服务定位器 (Service Locator Overuse)

```kotlin
// 错误做法 - 服务定位器模式
class UserViewModel : ViewModel(), KoinComponent {
    fun loadUser() {
        val repository = get<UserRepository>()  // 手动解析
        // ...
    }
}

// 正确做法 - 构造函数注入
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {
    fun loadUser() {
        // 依赖项已被注入
    }
}
```

### 2. 万能模块 (God Modules)

```kotlin
// 错误做法 - 所有内容都在一个模块中
val appModule = module {
    // 这里有 100 多个定义
}

// 正确做法 - 有组织的模块
val databaseModule = module { /* ... */ }
val networkModule = module { /* ... */ }
val homeModule = module { /* ... */ }
```

### 3. 过多使用限定符

```kotlin
// 错误做法 - 为不同类型使用限定符
module {
    single(named("user_repository")) { UserRepository() }
    single(named("order_repository")) { OrderRepository() }
}

// 正确做法 - 通过类型进行区分
module {
    singleOf(::UserRepository)
    singleOf(::OrderRepository)
}
```

### 4. 混合关注点 (Mixing Concerns)

```kotlin
// 错误做法 - 模块中带有副作用
module {
    single {
        println("Loading database...")  // 副作用
        Database()
    }
}

// 正确做法 - 纯粹的依赖创建
module {
    single { Database() }
}
```

### 5. 隐藏依赖项 (Hidden Dependencies)

```kotlin
// 错误做法 - 内部隐藏依赖项
class UserService {
    private val api = ApiClient()  // 隐藏依赖项
}

// 正确做法 - 显式依赖项
class UserService(private val api: ApiClient)
```

## 最佳做法总结

1. **首选构造函数注入** - 避免在类内部调用 `get()`。
2. **在测试中使用 `verify()`** - 及早发现缺失的定义。
3. **保持模块职责专一** - 每个模块遵循单一职责原则。
4. **避免循环依赖** - 进行重构或使用延迟注入。
5. **谨慎使用限定符** - 仅当同一类型有多个实例时使用。

## 后续步骤

- **[模块](/docs/reference/koin-core/modules)** - 模块组织
- **[测试](/docs/reference/koin-test/testing)** - 使用 Koin 进行测试
- **[作用域](/docs/reference/koin-core/scopes)** - 管理生命周期