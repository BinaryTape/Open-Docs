[//]: # (title: Kotlin 1.6.20 有哪些新变化)

_[发布日期：2022 年 4 月 4 日](releases.md#release-details)_

Kotlin 1.6.20 揭示了未来语言特性的抢先体验预览，将分层结构设为多平台项目的默认设置，并为其他组件带来了演进改进。

您还可以在此视频中找到更改的简要概述：

<video src="https://www.youtube.com/v/8F19ds109-o" title="What's new in Kotlin 1.6.20"/>

## 语言

在 Kotlin 1.6.20 中，您可以尝试两种新的语言特性：

*   [Kotlin/JVM 的上下文接收者原型](#prototype-of-context-receivers-for-kotlin-jvm)
*   [明确非空类型](#definitely-non-nullable-types)

### Kotlin/JVM 的上下文接收者原型

> 该特性是仅适用于 Kotlin/JVM 的原型。启用 `-Xcontext-receivers` 后，
> 编译器将生成预发布二进制文件，这些文件不能用于生产代码。
> 仅在您的实验项目中使用上下文接收者。
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供反馈。
>
{style="warning"}

使用 Kotlin 1.6.20，您不再限于只有一个接收者。如果您需要更多，可以通过向函数、属性和类的声明中添加上下文接收者来使它们依赖于上下文（或称“上下文相关的”）。上下文相关的声明执行以下操作：

*   它要求所有声明的上下文接收者以隐式接收者的形式存在于调用者的作用域中。
*   它将声明的上下文接收者作为隐式接收者引入到其代码块作用域中。

```kotlin
interface LoggingContext {
    val log: Logger // 此上下文提供对日志记录器的引用 
}

context(LoggingContext)
fun startBusinessOperation() {
    // 您可以访问 log 属性，因为 LoggingContext 是一个隐式接收者
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // 您需要在作用域中拥有 LoggingContext 作为隐式接收者
        // 才能调用 startBusinessOperation()
        startBusinessOperation()
    }
}
```

要在您的项目中启用上下文接收者，请使用 `-Xcontext-receivers` 编译器选项。
您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md#detailed-design) 中找到该特性及其语法的详细描述。

请注意，此实现是一个原型：

*   启用 `-Xcontext-receivers` 后，编译器将生成预发布二进制文件，这些文件不能用于生产代码
*   目前对上下文接收者的 IDE 支持最少

请在您的实验项目中尝试该特性，并在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-42435) 中与我们分享您的想法和经验。
如果您遇到任何问题，请[提交新问题](https://kotl.in/issue)。

### 明确非空类型

> 明确非空类型处于 [Beta 阶段](components-stability.md)。它们几乎稳定，
> 但未来可能需要迁移步骤。
> 我们将尽力减少您必须进行的任何更改。
>
{style="warning"}

为了在扩展 Java 泛型类和接口时提供更好的互操作性，Kotlin 1.6.20 允许您使用新语法 `T & Any` 在使用点将泛型类型形参标记为明确非空的。
这种语法形式来自[交集类型](https://en.wikipedia.org/wiki/Intersection_type)的表示法，目前仅限于 `&` 左侧具有可空上界和右侧具有非空 `Any` 的类型形参：

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // OK
    elvisLike<String>("", "").length
    // Error: 'null' cannot be a value of a non-null type
    elvisLike<String>("", null).length

    // OK
    elvisLike<String?>(null, "").length
    // Error: 'null' cannot be a value of a non-null type
    elvisLike<String?>(null, null).length
}
```
{validate="false"}

将语言版本设置为 `1.7` 以启用该特性：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.7"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.7'
        }
    }
}
```

</tab>
</tabs>

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md) 中了解有关明确非空类型的更多信息。

## Kotlin/JVM

Kotlin 1.6.20 引入：

*   JVM 接口中默认方法的兼容性改进：[接口的新 `@JvmDefaultWithCompatibility` 注解](#new-jvmdefaultwithcompatibility-annotation-for-interfaces)和 [`-Xjvm-default` 模式的兼容性更改](#compatibility-changes-in-the-xjvm-default-modes)
*   [支持 JVM 后端中单个模块的并行编译](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
*   [支持函数式接口构造函数的 Callable Reference](#support-for-callable-references-to-functional-interface-constructors)

### 接口的新 @JvmDefaultWithCompatibility 注解

Kotlin 1.6.20 引入了新注解 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)：将其与 `-Xjvm-default=all` 编译器选项一起使用，[为任何 Kotlin 接口中的任何非抽象成员创建 JVM 接口中的默认方法](java-to-kotlin-interop.md#default-methods-in-interfaces)。

如果存在使用未经 `-Xjvm-default=all` 选项编译的 Kotlin 接口的客户端，它们可能与使用此选项编译的代码二进制不兼容。
在 Kotlin 1.6.20 之前，为了避免此兼容性问题，[推荐的方法](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility)是使用 `-Xjvm-default=all-compatibility` 模式，并为不需要此类型兼容性的接口使用 `@JvmDefaultWithoutCompatibility` 注解。

这种方法有一些缺点：

*   添加新接口时，您很容易忘记添加注解。
*   通常非公共部分的接口多于公共 API 中的接口，因此您最终会在代码中的许多地方使用此注解。

现在，您可以使用 `-Xjvm-default=all` 模式并使用 `@JvmDefaultWithCompatibility` 注解标记接口。
这允许您一次性将此注解添加到公共 API 中的所有接口，并且无需为新的非公共代码使用任何注解。

请在 [此 YouTrack 问题单](https://youtrack.jetbrains.com/issue/KT-48217) 中留下您对此新注解的反馈。

### -Xjvm-default 模式的兼容性更改

Kotlin 1.6.20 添加了将模块以默认模式（`-Xjvm-default=disable` 编译器选项）编译到使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式编译的模块的选项。
与之前一样，如果所有模块都使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式，编译也将成功。
您可以在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-47000) 中留下您的反馈。

Kotlin 1.6.20 弃用了编译器选项 `-Xjvm-default` 的 `compatibility` 和 `enable` 模式。
其他模式的描述在兼容性方面有所更改，但总体逻辑保持不变。
您可以查看[更新的描述](java-to-kotlin-interop.md#compatibility-modes-for-default-methods)。

有关 Java 互操作中默认方法的更多信息，请参阅[互操作性文档](java-to-kotlin-interop.md#default-methods-in-interfaces)和
[此博客文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 支持 JVM 后端中单个模块的并行编译

> 支持 JVM 后端中单个模块的并行编译是[实验性的](components-stability.md)。
> 它可能随时被删除或更改。需要显式选择启用（参见下方详情），且您应仅将其用于评估目的。
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-46085) 中提供反馈。
>
{style="warning"}

我们正在继续努力[改进新的 JVM IR 后端编译时间](https://youtrack.jetbrains.com/issue/KT-46768)。
在 Kotlin 1.6.20 中，我们添加了实验性的 JVM IR 后端模式，以并行编译模块中的所有文件。
并行编译可以将总编译时间缩短多达 15%。

使用[编译器选项](compiler-reference.md#compiler-options) `-Xbackend-threads` 启用实验性的并行后端模式。
为此选项使用以下实参：

*   `N` 是您要使用的线程数。它不应大于您的 CPU 核心数；否则，由于线程之间上下文切换，并行化将停止有效。
*   `0` 表示为每个 CPU 核心使用单独的线程。

[Gradle](gradle.md) 可以并行运行任务，但当项目（或项目的主要部分）在 Gradle 看来只是一个大任务时，这种并行化帮助不大。
如果您有一个非常大的单体模块，请使用并行编译以更快地编译。
如果您的项目包含许多小模块并通过 Gradle 进行并行构建，添加另一层并行化可能会因为上下文切换而损害性能。

> 并行编译有一些限制：
> *   它不适用于 [kapt](kapt.md)，因为 kapt 禁用了 IR 后端。
> *   它设计上需要更多的 JVM 堆内存。堆内存量与线程数成比例。
>
{style="note"}

### 支持函数式接口构造函数的 Callable Reference

> 对函数式接口构造函数的 Callable Reference 支持是[实验性的](components-stability.md)。
> 它可能随时被删除或更改。需要显式选择启用（参见下方详情），且您应仅将其用于评估目的。
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47939) 中提供反馈。
>
{style="warning"}

对函数式接口构造函数[Callable Reference](reflection.md#callable-references) 的支持提供了一种源兼容的方式，用于从带有构造函数接口迁移到[函数式接口](fun-interfaces.md)。

考虑以下代码：

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

启用对函数式接口构造函数的 Callable Reference 后，此代码可以替换为仅一个函数式接口声明：

```kotlin
fun interface Printer {
    fun print()
}
```

其构造函数将隐式创建，并且任何使用 `::Printer` 函数引用的代码都将编译。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```
{validate="false"}

通过使用 `DeprecationLevel.HIDDEN` 标记旧的 `Printer` 函数来保留二进制兼容性 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 注解：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```
{validate="false"}

使用编译器选项 `-XXLanguage:+KotlinFunInterfaceConstructorReference` 启用此特性。

## Kotlin/Native

Kotlin/Native 1.6.20 标志着其新组件的持续开发。我们向在其他平台提供一致的 Kotlin 体验又迈进了一步：

*   [新内存管理器的更新](#an-update-on-the-new-memory-manager)
*   [新内存管理器中清除阶段的并发实现](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
*   [注解类实例化](#instantiation-of-annotation-classes)
*   [与 Swift async/await 的互操作：返回 Swift 的 Void 而不是 KotlinUnit](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
*   [使用 libbacktrace 改进栈跟踪](#better-stack-traces-with-libbacktrace)
*   [支持独立 Android 可执行文件](#support-for-standalone-android-executables)
*   [性能改进](#performance-improvements)
*   [cinterop 模块导入期间改进错误处理](#improved-error-handling-during-cinterop-modules-import)
*   [支持 Xcode 13 库](#support-for-xcode-13-libraries)

### 新内存管理器的更新

> 新的 Kotlin/Native 内存管理器处于 [Alpha 阶段](components-stability.md)。
> 它将来可能不兼容地更改并需要手动迁移。
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中提供反馈。
>
{style="note"}

使用 Kotlin 1.6.20，您可以尝试新的 Kotlin/Native 内存管理器的 Alpha 版本。
它消除了 JVM 和 Native 平台之间的差异，以便在多平台项目中提供一致的开发者体验。
例如，您将更容易创建可在 Android 和 iOS 上运行的新的跨平台移动应用程序。

新的 Kotlin/Native 内存管理器取消了线程间对象共享的限制。
它还提供了无内存泄漏的并发编程原语，这些原语是安全的，并且不需要任何特殊管理或注解。

新的内存管理器将在未来版本中成为默认设置，因此我们鼓励您现在就尝试它。
请查看我们的[博客文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)，了解有关新内存管理器的更多信息并探索演示项目，或者直接跳转到[迁移说明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)自行尝试。

尝试在您的项目中使用新的内存管理器，看看它是如何工作的，并在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享反馈。

### 新内存管理器中清除阶段的并发实现

如果您已经切换到我们在 [Kotlin 1.6 中宣布](whatsnew16.md#preview-of-the-new-memory-manager)的新内存管理器，您可能会注意到执行时间的大幅改进：我们的基准测试显示平均提升 35%。
从 1.6.20 开始，新的内存管理器还提供了清除阶段的并发实现。
这也应该能提高性能并缩短垃圾收集器暂停的持续时间。

要为新的 Kotlin/Native 内存管理器启用该特性，请传递以下编译器选项：

```bash
-Xgc=cms 
```

欢迎在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48526) 中分享您对新内存管理器性能的反馈。

### 注解类实例化

在 Kotlin 1.6.0 中，注解类的实例化对于 Kotlin/JVM 和 Kotlin/JS 而言已变为[稳定](components-stability.md)。
1.6.20 版本提供了对 Kotlin/Native 的支持。

了解有关[注解类实例化](annotations.md#instantiation)的更多信息。

### 与 Swift async/await 的互操作：返回 Swift 的 Void 而不是 KotlinUnit

> 与 Swift async/await 的并发互操作性是[实验性的](components-stability.md)。它可能随时被删除或更改。
> 您应仅将其用于评估目的。我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 中提供反馈。
>
{style="warning"}

我们继续致力于[与 Swift 5.5 async/await 的实验性互操作](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await)（自 Swift 5.5 起可用）。
Kotlin 1.6.20 与以前版本在处理 `Unit` 返回类型的[挂起函数](https://kotlinlang.org/docs/reference/coroutines/basics.html#suspending-functions)的方式上有所不同。

以前，此类函数在 Swift 中表示为返回 `KotlinUnit` 的 `async` 函数。但是，它们的正确返回类型应该是 `Void`，类似于非挂起函数。

为避免破坏现有代码，我们引入了一个 Gradle 属性，该属性使编译器将返回 `Unit` 的挂起函数转换为具有 `Void` 返回类型的 `async` Swift 函数：

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

我们计划在未来的 Kotlin 版本中使此行为成为默认设置。

### 使用 libbacktrace 改进栈跟踪

> 使用 libbacktrace 解析源位置是[实验性的](components-stability.md)。它可能随时被删除或更改。
> 您应仅将其用于评估目的。我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424) 中提供反馈。
>
{style="warning"}

Kotlin/Native 现在能够生成带有文件位置和行号的详细栈跟踪，以便更好地调试 `linux*`（`linuxMips32` 和 `linuxMipsel32` 除外）和 `androidNative*` 目标平台。

此特性底层使用 [libbacktrace](https://github.com/ianlancetaylor/libbacktrace) 库。
请看以下代码，了解差异示例：

```kotlin
fun main() = bar()
fun bar() = baz()
inline fun baz() {
    error("")
}
```

*   **1.6.20 之前：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x227190       kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96
   at 1   example.kexe        0x221e4c       kfun:kotlin.Exception#<init>(kotlin.String?){} + 92
   at 2   example.kexe        0x221f4c       kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92
   at 3   example.kexe        0x22234c       kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92
   at 4   example.kexe        0x25d708       kfun:#bar(){} + 104
   at 5   example.kexe        0x25d68c       kfun:#main(){} + 12
```
{initial-collapse-state="collapsed" collapsible="true"}

*   **1.6.20 带 libbacktrace：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x229550    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe        0x22420c    kfun:kotlin.Exception#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe        0x22430c    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe        0x22470c    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe        0x25fac8    kfun:#bar(){} + 104 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)
   at 5   example.kexe        0x25fac8    kfun:#bar(){} + 104 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe        0x25fac8    kfun:#bar(){} + 104 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe        0x25fa4c    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
```
{initial-collapse-state="collapsed" collapsible="true"}

在 Apple 目标平台中，栈跟踪中已经包含文件位置和行号，libbacktrace 为内联函数调用提供了更多详细信息：

*   **1.6.20 之前：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10a85a8f8    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x10a855846    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x10a855936    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x10a855c86    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x10a8489a5    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:1)
   at 5   example.kexe    0x10a84891c    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```
{initial-collapse-state="collapsed" collapsible="true"}

*   **1.6.20 带 libbacktrace：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10669bc88    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x106696bd6    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x106696cc6    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x106697016    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)
>>  at 5   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe    0x106689d35    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe    0x106689cac    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```
{initial-collapse-state="collapsed" collapsible="true"}

要使用 libbacktrace 生成更好的栈跟踪，请将以下行添加到 `gradle.properties`：

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

请在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48424) 中告诉我们使用 libbacktrace 调试 Kotlin/Native 的体验如何。

### 支持独立 Android 可执行文件

以前，Kotlin/Native 中的 Android 原生可执行文件实际上不是可执行文件，而是可以作为 NativeActivity 使用的共享库。现在有一个选项可以为 Android 原生目标平台生成标准可执行文件。

为此，在您项目的 `build.gradle(.kts)` 部分中，配置 `androidNative` 目标平台的可执行文件代码块。
添加以下二进制选项：

```kotlin
kotlin {
    androidNativeX64("android") {
        binaries {
            executable {
                binaryOptions["androidProgramType"] = "standalone"
            }
        }
    }
}
```

请注意，此特性将在 Kotlin 1.7.0 中成为默认设置。
如果您想保留当前行为，请使用以下设置：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

感谢 Mattia Iavarone 的[实现](https://github.com/jetbrains/kotlin/pull/4624)！

### 性能改进

我们正在努力改进 Kotlin/Native，以[加快编译过程](https://youtrack.jetbrains.com/issue/KT-42294)并改善您的开发体验。

Kotlin 1.6.20 带来了一些影响 Kotlin 生成的 LLVM IR 的性能更新和错误修复。
根据我们内部项目的基准测试，我们平均实现了以下性能提升：

*   执行时间减少 15%
*   发布和调试二进制文件的代码大小减少 20%
*   发布二进制文件的编译时间减少 26%

这些更改还在大型内部项目上将调试二进制文件的编译时间减少了 10%。

为了实现这一点，我们为一些编译器生成的合成对象实现了静态初始化，改进了为每个函数构造 LLVM IR 的方式，并优化了编译器缓存。

### cinterop 模块导入期间改进错误处理

此版本引入了对使用 `cinterop` 工具导入 Objective-C 模块（如 CocoaPods pods 典型情况）时的错误处理改进。
以前，如果您在尝试使用 Objective-C 模块时遇到错误（例如，处理头文件中的编译错误时），您会收到一条信息不明确的错误消息，例如 `fatal error: could not build module $name`。
我们扩展了 `cinterop` 工具的这部分功能，因此您将收到带有扩展描述的错误消息。

### 支持 Xcode 13 库

此版本完全支持 Xcode 13 附带的库。
您可以随时从 Kotlin 代码的任何地方访问它们。

## Kotlin Multiplatform

1.6.20 为 Kotlin Multiplatform 带来了以下值得注意的更新：

*   [分层结构支持现在是所有新多平台项目的默认设置](#hierarchical-structure-support-for-multiplatform-projects)
*   [Kotlin CocoaPods Gradle 插件获得了一些有用的 CocoaPods 集成特性](#kotlin-cocoapods-gradle-plugin)

### 多平台项目中的分层结构支持

Kotlin 1.6.20 默认启用分层结构支持。
自[在 Kotlin 1.4.0 中引入](whatsnew14.md#sharing-code-in-several-targets-with-the-hierarchical-project-structure)以来，我们显著改进了前端并使 IDE 导入稳定。

以前，在多平台项目中添加代码有两种方式。第一种是将其插入到平台特有的源代码集中，该源代码集仅限于单个目标平台，不能被其他平台重用。
第二种是使用在 Kotlin 当前支持的所有平台之间共享的公共源代码集。

现在，您可以在几个类似的，重用大量通用逻辑和第三方 API 的原生目标平台之间[共享源代码](#better-code-sharing-in-your-project)。
该技术将提供正确的默认依赖项，并找到共享代码中可用的确切 API。
这消除了复杂的构建设置以及不得不使用变通方案来获取 IDE 对在原生目标平台之间共享源代码集的支持。
它还有助于防止不安全地使用旨在用于不同目标平台上的 API。

该技术对于[库作者](#more-opportunities-for-library-authors)也很有用，因为分层项目结构允许他们发布和使用包含目标平台子集公共 API 的库。

默认情况下，使用分层项目结构发布的库仅与分层结构项目兼容。

#### 在您的项目中更好地共享代码

如果没有分层结构支持，没有直接的方法可以跨**某些**而非**所有** [Kotlin 目标平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)共享代码。
一个常见的例子是跨所有 iOS 目标平台共享代码并访问 iOS 特有的[依赖项](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)，如 Foundation。

得益于分层项目结构支持，您现在可以开箱即用地实现这一点。
在新结构中，源代码集形成一个层次结构。
您可以使用适用于给定源代码集编译到的每个目标平台的平台特有的语言特性和依赖项。

例如，考虑一个具有两个目标平台——`iosArm64` 和 `iosX64`（用于 iOS 设备和模拟器）的典型多平台项目。
Kotlin 工具理解这两个目标平台具有相同的功能，并允许您从中间源代码集 `iosMain` 访问该功能。

![iOS hierarchy example](ios-hierarchy-example.jpg){width=700}

Kotlin 工具链提供了正确的默认依赖项，如 Kotlin/Native stdlib 或原生库。
此外，Kotlin 工具链将尽力准确地找到共享代码中可用的 API 接口。
这可以防止诸如在共享给 Windows 的代码中使用 macOS 特有的函数之类的情况。

#### 为库作者带来更多机会

当发布多平台库时，其中间源代码集的 API 现在会随之正确发布，使其可供消费者使用。
同样，Kotlin 工具链将自动确定消费者源代码集中可用的 API，同时仔细留意不安全的使用，例如在 JS 代码中使用旨在用于 JVM 的 API。
了解有关[在库中共享代码](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)的更多信息。

#### 配置与设置

从 Kotlin 1.6.20 开始，所有新的多平台项目都将具有分层项目结构。无需额外设置。

*   如果您已[手动启用](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)，您可以从 `gradle.properties` 中删除弃用选项：

    ```none
    # gradle.properties
    kotlin.mpp.enableGranularSourceSetsMetadata=true
    kotlin.native.enableDependencyPropagation=false // or 'true', depending on your previous setup
    ```

*   对于 Kotlin 1.6.20，我们推荐使用 [Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 或更高版本以获得最佳体验。

*   您也可以选择退出。要禁用分层结构支持，请在 `gradle.properties` 中设置以下选项：

    ```none
    # gradle.properties
    kotlin.mpp.hierarchicalStructureSupport=false
    ```

#### 留下您的反馈

这是对整个生态系统的重大改变。我们非常感谢您的反馈，以帮助使其变得更好。

现在就尝试一下，并向[我们的问题跟踪器](https://kotl.in/issue)报告您遇到的任何困难。

### Kotlin CocoaPods Gradle 插件

为了简化 CocoaPods 集成，Kotlin 1.6.20 提供了以下特性：

*   CocoaPods 插件现在具有构建 XCFramework 并生成 Podspec 文件的任务，其中包含所有已注册的目标平台。这在您不想直接与 Xcode 集成，但又想构建 artifact 并将其部署到本地 CocoaPods 版本库时很有用。
    
    了解有关[构建 XCFramework](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#build-xcframeworks) 的更多信息。

*   如果您在项目中使用 [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)，您习惯于为整个 Gradle 项目指定所需的 Pod 版本。现在您有更多选项：
    *   直接在 `cocoapods` 代码块中指定 Pod 版本。
    *   继续使用 Gradle 项目版本。
    
    如果这些属性都没有配置，您将收到错误。

*   您现在可以在 `cocoapods` 代码块中配置 CocoaPod 名称，而不是更改整个 Gradle 项目的名称。

*   CocoaPods 插件引入了一个新的 `extraSpecAttributes` 属性，您可以使用它来配置 Podspec 文件中以前硬编码的属性，例如 `libraries` 或 `vendored_frameworks`。

```kotlin
kotlin {
    cocoapods {
        version = "1.0"
        name = "MyCocoaPod"
        extraSpecAttributes["social_media_url"] = 'https://twitter.com/kotlin'
        extraSpecAttributes["vendored_frameworks"] = 'CustomFramework.xcframework'
        extraSpecAttributes["libraries"] = 'xml'
    }
}
```

查看完整的 Kotlin CocoaPods Gradle 插件 [DSL 参考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)。

## Kotlin/JS

Kotlin/JS 1.6.20 的改进主要影响 IR 编译器：

*   [IR 编译器开发二进制文件的增量编译](#incremental-compilation-for-development-binaries-with-ir-compiler)
*   [IR 编译器默认顶层属性惰性初始化](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)
*   [IR 编译器默认项目模块独立 JS 文件](#separate-js-files-for-project-modules-by-default-with-ir-compiler)
*   [Char 类优化 (IR)](#char-class-optimization)
*   [导出改进（IR 和传统后端）](#improvements-to-export-and-typescript-declaration-generation)
*   [@AfterTest 对异步测试的保证](#aftertest-guarantees-for-asynchronous-tests)

### IR 编译器开发二进制文件的增量编译

为了提高使用 IR 编译器进行 Kotlin/JS 开发的效率，我们引入了一种新的**增量编译**模式。

在此模式下，使用 `compileDevelopmentExecutableKotlinJs` Gradle 任务构建**开发二进制文件**时，编译器会缓存先前编译的结果在模块级别。
它在后续编译期间使用未更改源文件的缓存编译结果，从而使编译更快完成，尤其是当更改很小时。
请注意，此改进仅针对开发过程（缩短编辑-构建-调试周期），不影响生产 artifact 的构建。

要为开发二进制文件启用增量编译，请将以下行添加到项目的 `gradle.properties`：

```none
# gradle.properties
kotlin.incremental.js.ir=true // false by default
```

在我们的测试项目中，新模式使增量编译速度提高了 30%。但是，在此模式下，干净构建变得更慢，因为需要创建和填充缓存。

请在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-50203) 中告诉我们您如何看待在 Kotlin/JS 项目中使用增量编译。

### IR 编译器默认顶层属性惰性初始化

在 Kotlin 1.4.30 中，我们展示了 JS IR 编译器中[顶层属性惰性初始化](whatsnew1430.md#lazy-initialization-of-top-level-properties)的原型。
通过消除应用程序启动时初始化所有属性的需要，惰性初始化缩短了启动时间。
我们的测量显示，在一个实际的 Kotlin/JS 应用程序中，速度提升了约 10%。

现在，我们已经完善并适当检测了此机制，我们正在使惰性初始化成为 IR 编译器中顶层属性的默认设置。

```kotlin
// lazy initialization
val a = run {
    val result = // intensive computations
        println(result)
    result
} // run 在变量首次使用时执行
```

如果由于某种原因您需要在应用程序启动时急切初始化属性，请使用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/) 注解标记它。

### IR 编译器默认项目模块独立 JS 文件

以前，JS IR 编译器提供了[生成独立 `.js` 文件]( https://youtrack.jetbrains.com/issue/KT-44319)的能力，用于项目模块。
这是默认选项——整个项目的单个 `.js` 文件——的替代方案。
这个文件可能太大且不方便使用，因为 whenever 您想使用项目中的函数时，都必须将整个 JS 文件作为依赖项包含在内。
拥有多个文件增加了灵活性并减小了此类依赖项的大小。此特性可与 `-Xir-per-module` 编译器选项一起使用。

从 1.6.20 开始，JS IR 编译器默认为项目模块生成独立的 `.js` 文件。

现在可以使用以下 Gradle 属性将项目编译成单个 `.js` 文件：

```none
# gradle.properties
kotlin.js.ir.output.granularity=whole-program // `per-module` is the default
```

在以前的版本中，实验性的按模块模式（通过 `-Xir-per-module=true` 标志可用）在每个模块中调用 `main()` 函数。这与常规的单个 `.js` 模式不一致。从 1.6.20 开始，`main()` 函数将仅在主模块中调用，在两种情况下都是如此。如果您确实需要在模块加载时运行一些代码，可以使用带有 `@EagerInitialization` 注解的顶层属性。请参阅[IR 编译器默认顶层属性惰性初始化](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)。

### Char 类优化

现在，Kotlin/JS 编译器处理 `Char` 类时不会引入装箱（类似于[内联类](inline-classes.md)）。
这加快了 Kotlin/JS 代码中对 char 的操作。

除了性能改进之外，这还改变了 `Char` 导出到 JavaScript 的方式：它现在被转换为 `Number`。

### 导出改进和 TypeScript 声明生成

Kotlin 1.6.20 为导出机制（[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 注解）带来了多项修复和改进，包括 [TypeScript 声明（.d.ts）的生成](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)。
我们增加了导出接口和枚举的功能，并修复了先前向我们报告的某些边缘情况下的导出行为。
有关更多详细信息，请参阅 [YouTrack 中导出改进列表](https://youtrack.jetbrains.com/issues?q=Project:%20Kotlin%20issue%20id:%20KT-45434,%20KT-44494,%20KT-37916,%20KT-43191,%20KT-46961,%20KT-40236)。

了解有关[从 JavaScript 使用 Kotlin 代码](js-to-kotlin-interop.md)的更多信息。

### @AfterTest 对异步测试的保证

Kotlin 1.6.20 使得 [`@AfterTest`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-after-test/) 函数可以在 Kotlin/JS 上的异步测试中正常工作。
如果测试函数的返回类型被静态解析为 [`Promise`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/)，编译器现在会将 `@AfterTest` 函数的执行调度到相应的 [`then()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/then.html) 回调。

## 安全性

Kotlin 1.6.20 引入了一些特性来提高您的代码安全性：

*   [在 klib 中使用相对路径](#using-relative-paths-in-klibs)
*   [Kotlin/JS Gradle 项目的 yarn.lock 文件持久化](#persisting-yarn-lock-for-kotlin-js-gradle-projects)
*   [默认情况下使用 `--ignore-scripts` 安装 npm 依赖项](#installation-of-npm-dependencies-with-ignore-scripts-by-default)

### 在 klib 中使用相对路径

`klib` 格式的库[包含](native-libraries.md#library-format)源文件的序列化 IR 表示，其中还包括它们的路径，用于生成适当的调试信息。
在 Kotlin 1.6.20 之前，存储的文件路径是绝对的。由于库作者可能不希望共享绝对路径，1.6.20 版本提供了一个替代选项。

如果您正在发布 `klib` 并希望在 artifact 中仅使用源文件的相对路径，您现在可以传递 `-Xklib-relative-path-base` 编译器选项，并附带一个或多个源文件的基本路径：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile::class).configureEach {
    // $base 是源文件的基本路径
    kotlinOptions.freeCompilerArgs += "-Xklib-relative-path-base=$base"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile).configureEach {
    kotlinOptions {
        // $base 是源文件的基本路径
        freeCompilerArgs += "-Xklib-relative-path-base=$base"
    }
}
```

</tab>
</tabs>

### Kotlin/JS Gradle 项目的 yarn.lock 文件持久化

> 该特性已回溯到 Kotlin 1.6.10。
>
{style="note"}

Kotlin/JS Gradle 插件现在提供了持久化 `yarn.lock` 文件的能力，从而可以在无需额外 Gradle 配置的情况下锁定项目中 npm 依赖项的版本。
该特性通过在项目根目录添加自动生成的 `kotlin-js-store` 目录来改变默认的项目结构。
它内部包含 `yarn.lock` 文件。

我们强烈建议将 `kotlin-js-store` 目录及其内容提交到您的版本控制系统。
将锁定文件提交到版本控制系统是一种[推荐实践](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)，因为它确保您的应用程序在所有机器上都使用完全相同的依赖树进行构建，无论这些机器是其他机器上的开发环境还是 CI/CD 服务。
锁定文件还可以防止 npm 依赖项在项目签出到新机器时被静默更新，这是一个安全隐患。

像 [Dependabot](https://github.com/dependabot) 这样的工具还可以解析您的 Kotlin/JS 项目的 `yarn.lock` 文件，并在您依赖的任何 npm 包被入侵时提供警告。

如果需要，您可以在构建脚本中更改目录和锁定文件名称：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
```

</tab>
</tabs>

> 更改锁定文件的名称可能会导致依赖项检查工具无法再识别该文件。
>
{style="warning"}

### 默认情况下使用 --ignore-scripts 安装 npm 依赖项

> 该特性已回溯到 Kotlin 1.6.10。
>
{style="note"}

Kotlin/JS Gradle 插件现在默认阻止在安装 npm 依赖项期间执行[生命周期脚本](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)。
此更改旨在降低从被入侵的 npm 包执行恶意代码的可能性。

要回滚到旧配置，您可以通过向 `build.gradle(.kts)` 添加以下行来显式启用生命周期脚本执行：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).ignoreScripts = false
}
```

</tab>
</tabs>

了解有关 [Kotlin/JS Gradle 项目的 npm 依赖项](js-project-setup.md#npm-dependencies)的更多信息。

## Gradle

Kotlin 1.6.20 为 Kotlin Gradle 插件带来了以下更改：

*   用于定义 Kotlin 编译器执行策略的新[属性 `kotlin.compiler.execution.strategy` 和 `compilerExecutionStrategy`](#properties-for-defining-kotlin-compiler-execution-strategy)
*   [kapt 和协程构建选项的弃用](#deprecation-of-build-options-for-kapt-and-coroutines)
*   [移除 `kotlin.parallel.tasks.in.project` 构建选项](#removal-of-the-kotlin-parallel-tasks-in-project-build-option)

### 用于定义 Kotlin 编译器执行策略的属性

在 Kotlin 1.6.20 之前，您使用系统属性 `-Dkotlin.compiler.execution.strategy` 来定义 Kotlin 编译器执行策略。
此属性在某些情况下可能不方便。
Kotlin 1.6.20 引入了一个同名的 Gradle 属性 `kotlin.compiler.execution.strategy` 和编译任务属性 `compilerExecutionStrategy`。

系统属性仍然有效，但将在未来版本中移除。

当前属性的优先级如下：

*   任务属性 `compilerExecutionStrategy` 优先于系统属性和 Gradle 属性 `kotlin.compiler.execution.strategy`。
*   Gradle 属性优先于系统属性。

您可以为这些属性分配三种编译器执行策略：

| 策略       | Kotlin 编译器执行位置       | 增量编译 | 其他特性                                                       |
| ---------- | ---------------------------- | -------- | ------------------------------------------------------------------ |
| Daemon     | 在其自身的守护进程中         | 是       | *默认策略*。可以在不同的 Gradle 守护进程之间共享                 |
| In process | 在 Gradle 守护进程中         | 否       | 可能与 Gradle 守护进程共享堆内存                                   |
| Out of process | 每次调用都在单独的进程中 | 否       | —                                                                  |

因此，`kotlin.compiler.execution.strategy` 属性（系统属性和 Gradle 属性）的可用值是：
1.  `daemon`（默认）
2.  `in-process`
3.  `out-of-process`

在 `gradle.properties` 中使用 Gradle 属性 `kotlin.compiler.execution.strategy`：

```none
# gradle.properties
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 任务属性的可用值是：

1.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON`（默认）
2.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3.  `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

在 `build.gradle.kts` 构建脚本中使用 `compilerExecutionStrategy` 任务属性：

```kotlin
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<KotlinCompile>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

请在 [此 YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-49299) 中留下您的反馈。

### kapt 和协程构建选项的弃用

在 Kotlin 1.6.20 中，我们更改了属性的弃用级别：

*   我们弃用了通过 `kapt.use.worker.api` 通过 Kotlin 守护进程运行 [kapt](kapt.md) 的能力——现在它会在 Gradle 的输出中生成警告。
    默认情况下，自 1.3.70 版本以来，[kapt 一直使用 Gradle worker](kapt.md#run-kapt-tasks-in-parallel)，我们建议坚持使用此方法。

    我们将在未来版本中移除 `kapt.use.worker.api` 选项。

*   我们弃用了 `kotlin.experimental.coroutines` Gradle DSL 选项以及 `gradle.properties` 中使用的 `kotlin.coroutines` 属性。
    只需使用[挂起函数](https://kotlinlang.org/docs/reference/coroutines/basics.html#suspending-functions)或[将 `kotlinx.coroutines` 依赖项添加到](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)您的 `build.gradle(.kts)` 文件。
    
    在[协程指南](coroutines-guide.md)中了解有关协程的更多信息。

### 移除 kotlin.parallel.tasks.in.project 构建选项

在 Kotlin 1.5.20 中，我们宣布[弃用构建选项 `kotlin.parallel.tasks.in.project`](whatsnew1520.md#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)。
此选项已在 Kotlin 1.6.20 中移除。

根据项目，Kotlin 守护进程中的并行编译可能需要更多内存。
要减少内存消耗，请[增加 Kotlin 守护进程的 JVM 堆内存大小](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)。

了解有关 Kotlin Gradle 插件中[当前支持的编译器选项](gradle-compiler-options.md)的更多信息。