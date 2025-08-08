[//]: # (title: 上下文形参)

<primary-label ref="experimental-general"/>

> 上下文形参取代了名为 [context receivers](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm) 的旧版实验性特性。
> 欲了解它们的主要区别，请参阅 [上下文形参的设计文档](https://github.com/Kotlin/KEEP/blob/master/proposals/context-parameters.md#summary-of-changes-from-the-previous-proposal)。
> 要从 context receivers 迁移到上下文形参，你可以使用 IntelliJ IDEA 中的辅助支持，具体请参阅相关的 [博客文章](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)。
>
{style="tip"}

上下文形参允许函数和属性声明在周围上下文中隐式可用的依赖项。

使用上下文形参，你无需手动传递那些在多组函数调用中共享且很少改变的值，例如服务或依赖项。

要为属性和函数声明上下文形参，请使用 `context` 关键字，后跟一个形参列表，其中每个形参声明为 `name: Type`。以下是一个依赖 `UserService` 接口的示例：

```kotlin
// UserService 定义了上下文中所需的依赖项
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 声明一个带有上下文形参的函数
context(users: UserService)
fun outputMessage(message: String) {
    // 使用上下文中提供的 log
    users.log("Log: $message")
}

// 声明一个带有上下文形参的属性
context(users: UserService)
val firstUser: String
    // 使用上下文中提供的 findUserById    
    get() = users.findUserById(1)
```

你可以使用 `_` 作为上下文形参名称。在这种情况下，形参的值可用于解析，但在代码块内部无法通过名称访问：

```kotlin
// 使用 "_" 作为上下文形参名称
context(_: UserService)
fun logWelcome() {
    // 解析仍能从 UserService 中找到相应的 log 函数
    outputMessage("Welcome!")
}
```

#### 上下文形参的解析

Kotlin 在调用点通过在当前作用域中搜索匹配的上下文值来解析上下文形参。Kotlin 根据它们的类型进行匹配。
如果相同作用域级别存在多个兼容值，编译器会报告歧义：

```kotlin
// UserService 定义了上下文中所需的依赖项
interface UserService {
    fun log(message: String)
}

// 声明一个带有上下文形参的函数
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

    // serviceA 和 serviceB 都与调用点预期的 UserService 类型匹配
    context(serviceA, serviceB) {
        // 这会导致歧义错误
        outputMessage("This will not compile")
    }
}
```

#### 限制

上下文形参正在持续改进中，当前的一些限制包括：

* 构造函数不能声明上下文形参。
* 带有上下文形参的属性不能拥有幕后字段或初始化器。
* 带有上下文形参的属性不能使用委托。

尽管存在这些限制，上下文形参仍通过简化的依赖注入、改进的 DSL 设计和作用域操作，简化了依赖项的管理。

#### 如何启用上下文形参

要在你的项目中启用上下文形参，请在命令行中使用以下编译器选项：

```Bash
-Xcontext-parameters
```

或将其添加到 Gradle 构建文件的 `compilerOptions {}` 代码块中：

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

此特性计划在未来的 Kotlin 版本中 [稳定化](components-stability.md#stability-levels-explained) 并得到改进。
我们非常感谢你在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 中提供反馈。