[//]: # (title: 上下文参数)

<primary-label ref="experimental-general"/>

> 上下文参数（Context parameters）取代了名为[上下文接收器 (context receivers)](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm)的旧实验性功能。
> 您可以在[上下文参数设计文档](https://github.com/Kotlin/KEEP/blob/master/proposals/context-parameters.md#summary-of-changes-from-the-previous-proposal)中找到它们的主要区别。
> 要从上下文接收器迁移到上下文参数，您可以使用 IntelliJ IDEA 中的辅助支持，详见相关的[博客文章](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)。
>
{style="tip"}

上下文参数允许函数／方法和属性声明在周围上下文中隐式可用的依赖项。

使用上下文参数，您无需手动传递那些在函数／方法调用集合中共享且很少更改的值，例如服务或依赖项。

要为属性和函数／方法声明上下文参数，请使用 `context` 关键字，后跟参数列表，每个参数声明为 `name: Type`。以下是一个依赖于 `UserService` 接口的示例：

```kotlin
// UserService 定义了上下文中所需的依赖项 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 声明一个带有上下文参数的函数／方法
context(users: UserService)
fun outputMessage(message: String) {
    // 使用来自上下文的 log
    users.log("Log: $message")
}

// 声明一个带有上下文参数的属性
context(users: UserService)
val firstUser: String
    // 使用来自上下文的 findUserById    
    get() = users.findUserById(1)
```

您可以使用 `_` 作为上下文参数名称。在这种情况下，参数的值可用于解析，但在块内部无法通过名称访问：

```kotlin
// 使用 "_" 作为上下文参数名称
context(_: UserService)
fun logWelcome() {
    // 解析仍然可以从 UserService 中找到合适的 log 函数／方法
    outputMessage("Welcome!")
}
```

#### 上下文参数解析

Kotlin 在调用站点通过在当前作用域中搜索匹配的上下文值来解析上下文参数。Kotlin 通过类型来匹配它们。
如果同一作用域级别存在多个兼容的值，编译器将报告歧义：

```kotlin
// UserService 定义了上下文中所需的依赖项
interface UserService {
    fun log(message: String)
}

// 声明一个带有上下文参数的函数／方法
context(users: UserService)
fun outputMessage(message: String) {
    users.log("Log: $message")
}

fun main() {
    // 实现 UserService 
    val serviceA = object : UserService {
        override fun log(message: String) = println("A: $message")
    }

    // 实现 UserService
    val serviceB = object : UserService {
        override fun log(message: String) = println("B: $message")
    }

    // serviceA 和 serviceB 在调用站点都匹配预期的 UserService 类型
    context(serviceA, serviceB) {
        // 这将导致歧义错误
        outputMessage("This will not compile")
    }
}
```

#### 限制

上下文参数正在持续改进中，目前的一些限制包括：

*   构造函数不能声明上下文参数。
*   带有上下文参数的属性不能具有支持字段或初始值设定项。
*   带有上下文参数的属性不能使用委托。

尽管有这些限制，上下文参数仍通过简化的 SQL 注入、改进的 DSL 设计和作用域操作简化了依赖项管理。

#### 如何启用上下文参数

要在项目中启用上下文参数，请在命令行中使用以下编译器选项：

```Bash
-Xcontext-parameters
```

或者将其添加到 Gradle 构建文件的 `compilerOptions {}` 代码块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> 同时指定 `-Xcontext-receivers` 和 `-Xcontext-parameters` 编译器选项会导致错误。
>
{style="warning"}

此功能计划在未来的 Kotlin 版本中[稳定](components-stability.md#stability-levels-explained)并改进。
欢迎在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 中提供反馈。