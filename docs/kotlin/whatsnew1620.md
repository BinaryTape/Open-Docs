[//]: # (title: Kotlin 1.6.20 有哪些新特性)

_[发布时间：2022 年 4 月 4 日](releases.md#release-details)_

Kotlin 1.6.20 揭示了未来语言特性的预览，使分层结构成为多平台项目的默认设置，并为其他组件带来了演进式改进。

您还可以在此视频中找到对这些更改的简要概述：

<video src="https://www.youtube.com/v/8F19ds109-o" title="What's new in Kotlin 1.6.20"/>

## 语言

在 Kotlin 1.6.20 中，您可以尝试两个新的语言特性：

* [Kotlin/JVM 上下文接收器的原型](#prototype-of-context-receivers-for-kotlin-jvm)
* [明确的非空类型](#definitely-non-nullable-types)

### Kotlin/JVM 上下文接收器的原型

> 此特性是一个原型，仅适用于 Kotlin/JVM。启用 `-Xcontext-receivers` 后，
> 编译器将生成预发布二进制文件，不能用于生产代码。
> 请仅在您的试验项目中使用上下文接收器。
> 我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供反馈。
>
{style="warning"}

使用 Kotlin 1.6.20，您不再局限于只有一个接收器。如果您需要更多，可以通过在其声明中添加上下文接收器来使函数、属性和类变得上下文依赖（或_上下文相关的_）。上下文相关的声明会执行以下操作：

* 它要求所有声明的上下文接收器都以隐式接收器（implicit receivers）的形式存在于调用者的作用域中。
* 它将声明的上下文接收器作为隐式接收器（implicit receivers）引入其主体作用域。

```kotlin
interface LoggingContext {
    val log: Logger // 此上下文提供了对日志记录器的引用
}

context(LoggingContext)
fun startBusinessOperation() {
    // 由于 LoggingContext 是一个隐式接收器，因此您可以访问 log 属性
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // 您需要将 LoggingContext 作为隐式接收器放在作用域中才能调用 startBusinessOperation()
        startBusinessOperation()
    }
}
```

要在您的项目中启用上下文接收器，请使用 `-Xcontext-receivers` 编译器选项。
您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md#detailed-design) 中找到此特性及其语法的详细描述。

请注意，此实现是一个原型：

* 启用 `-Xcontext-receivers` 后，编译器将生成预发布二进制文件，不能用于生产代码
* 目前 IDE 对上下文接收器的支持是最低限度的

请在您的试验项目中尝试此特性，并在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-42435)中与我们分享您的想法和经验。
如果您遇到任何问题，请[提交新问题](https://kotl.in/issue)。

### 明确的非空类型

> 明确的非空类型处于 [Beta 版](components-stability.md)。它们已接近稳定，
> 但将来可能需要迁移步骤。
> 我们将尽力减少您需要进行的更改。
>
{style="warning"}

为了在扩展泛型 Java 类和接口时提供更好的互操作性，Kotlin 1.6.20 允许您使用新语法 `T & Any` 在使用处将泛型类型参数标记为明确非空类型。
此语法形式来自[交集类型（intersection types）](https://en.wikipedia.org/wiki/Intersection_type)的表示法，目前仅限于 `&` 左侧带有可空上限的类型参数和右侧非空的 `Any`：

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // OK
    elvisLike<String>("", "").length
    // Error: 'null' 不能是非空类型的值
    elvisLike<String>("", null).length

    // OK
    elvisLike<String?>(null, "").length
    // Error: 'null' 不能是非空类型的值
    elvisLike<String?>(null, null).length
}
```
{validate="false"}

将语言版本设置为 `1.7` 以启用此特性：

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

Kotlin 1.6.20 引入了：

* JVM 接口中默认方法的兼容性改进：[接口的新注解 `@JvmDefaultWithCompatibility`](#new-jvmdefaultwithcompatibility-annotation-for-interfaces) 和 [`-Xjvm-default` 模式的兼容性更改](#compatibility-changes-in-the-xjvm-default-modes)
* [JVM 后端支持单个模块的并行编译](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
* [支持函数式接口构造函数的可调用引用](#support-for-callable-references-to-functional-interface-constructors)

### 接口的新注解 @JvmDefaultWithCompatibility

Kotlin 1.6.20 引入了新注解 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)：将其与 `-Xjvm-default=all` 编译器选项一起使用，[在 JVM 接口中为任何 Kotlin 接口的任何非抽象成员创建默认方法](java-to-kotlin-interop.md#default-methods-in-interfaces)。

如果使用您的 Kotlin 接口的客户端在没有 `-Xjvm-default=all` 选项的情况下编译，则它们可能与使用此选项编译的代码二进制不兼容。
在 Kotlin 1.6.20 之前，为避免此兼容性问题，[推荐的方法](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility)是使用 `-Xjvm-default=all-compatibility` 模式，并对不需要此类兼容性的接口使用 `@JvmDefaultWithoutCompatibility` 注解。

此方法有一些缺点：

* 添加新接口时，您很容易忘记添加该注解。
* 非公共部分中的接口通常多于公共 API 中的接口，因此您最终会在代码中多处出现此注解。

现在，您可以使用 `-Xjvm-default=all` 模式并用 `@JvmDefaultWithCompatibility` 注解标记接口。
这允许您一次性将此注解添加到公共 API 中的所有接口，并且新非公共代码无需使用任何注解。

请在[此 YouTrack 票据](https://youtrack.jetbrains.com/issue/KT-48217)中留下您对此新注解的反馈。

### -Xjvm-default 模式的兼容性更改

Kotlin 1.6.20 增加了编译模块的选项，使其可以在默认模式（`-Xjvm-default=disable` 编译器选项）下与使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式编译的模块兼容。
与以前一样，如果所有模块都处于 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式，编译也将成功。
您可以在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-47000)中留下您的反馈。

Kotlin 1.6.20 弃用了编译器选项 `-Xjvm-default` 的 `compatibility` 和 `enable` 模式。
其他模式的描述中关于兼容性有所更改，但总体逻辑保持不变。
您可以查看[更新的描述](java-to-kotlin-interop.md#compatibility-modes-for-default-methods)。

有关 Java 互操作中默认方法的更多信息，请参阅[互操作性文档](java-to-kotlin-interop.md#default-methods-in-interfaces)和[这篇博客文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### JVM 后端支持单个模块的并行编译

> JVM 后端支持单个模块的并行编译是[实验性](components-stability.md)功能。
> 它可能随时删除或更改。需要选择启用（参见下方详细信息），并且您应仅将其用于评估目的。
> 我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-46085) 中提供反馈。
>
{style="warning"}

我们正在继续努力[改进新的 JVM IR 后端编译时间](https://youtrack.jetbrains.com/issue/KT-46768)。
在 Kotlin 1.6.20 中，我们增加了实验性 JVM IR 后端模式，以并行编译模块中的所有文件。
并行编译可以将总编译时间减少多达 15%。

使用[编译器选项](compiler-reference.md#compiler-options) `-Xbackend-threads` 启用实验性并行后端模式。
此选项使用以下参数：

* `N` 是您要使用的线程数。它不应超过您的 CPU 核心数；否则，由于线程之间的上下文切换，并行化将失效
* `0` 为每个 CPU 核心使用单独的线程

[Gradle](gradle.md) 可以并行运行任务，但是当项目（或项目的主要部分）从 Gradle 的角度来看只是一个大任务时，这种并行化帮助不大。
如果您有一个非常大型的单体模块，请使用并行编译以更快地编译。
如果您的项目由许多小型模块组成并且构建由 Gradle 并行化，那么再添加一层并行化可能会由于上下文切换而损害性能。

> 并行编译有一些限制：
> * 它不适用于 [kapt](kapt.md)，因为 kapt 禁用了 IR 后端
> * 设计上需要更多的 JVM 堆内存。堆内存量与线程数成正比
>
{style="note"}

### 支持函数式接口构造函数的可调用引用

> 对函数式接口构造函数的可调用引用支持是[实验性](components-stability.md)功能。
> 它可能随时删除或更改。需要选择启用（参见下方详细信息），并且您应仅将其用于评估目的。
> 我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47939) 中提供反馈。
>
{style="warning"}

对[可调用引用](reflection.md#callable-references)到函数式接口构造函数的支持增加了一种源代码兼容的迁移方式，可以从带构造函数的接口迁移到[函数式接口](fun-interfaces.md)。

考虑以下代码：

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

启用函数式接口构造函数的可调用引用后，此代码可以替换为仅一个函数式接口声明：

```kotlin
fun interface Printer {
    fun print()
}
```

它的构造函数将隐式创建，并且任何使用 `::Printer` 函数引用的代码都将编译成功。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```
{validate="false"}

通过使用 `DeprecationLevel.HIDDEN` 的 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 注解标记旧有函数 `Printer` 来保留二进制兼容性：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```
{validate="false"}

使用编译器选项 `-XXLanguage:+KotlinFunInterfaceConstructorReference` 启用此特性。

## Kotlin/Native

Kotlin/Native 1.6.20 标志着其新组件的持续开发。我们向着与其他平台上的 Kotlin 一致的体验又迈进了一步：

* [新内存管理器的更新](#an-update-on-the-new-memory-manager)
* [新内存管理器中扫描阶段的并发实现](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
* [注解类的实例化](#instantiation-of-annotation-classes)
* [与 Swift async/await 的互操作：返回 Swift 的 Void 而不是 KotlinUnit](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [使用 libbacktrace 获得更好的堆栈跟踪](#better-stack-traces-with-libbacktrace)
* [支持独立的 Android 可执行文件](#support-for-standalone-android-executables)
* [性能改进](#performance-improvements)
* [cinterop 模块导入期间改进的错误处理](#improved-error-handling-during-cinterop-modules-import)
* [支持 Xcode 13 库](#support-for-xcode-13-libraries)

### 新内存管理器的更新

> 新的 Kotlin/Native 内存管理器处于 [Alpha 版](components-stability.md)。
> 它将来可能不兼容地更改并需要手动迁移。
> 我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中提供反馈。
>
{style="note"}

使用 Kotlin 1.6.20，您可以试用新 Kotlin/Native 内存管理器的 Alpha 版本。
它消除了 JVM 和 Native 平台之间的差异，以便在多平台项目中提供一致的开发者体验。
例如，您将更容易创建同时适用于 Android 和 iOS 的新跨平台移动应用程序。

新的 Kotlin/Native 内存管理器取消了线程间对象共享的限制。
它还提供了无内存泄漏的并发编程原语，这些原语是安全的，不需要任何特殊管理或注解。

新内存管理器将在未来版本中成为默认设置，因此我们鼓励您现在尝试它。
查看我们的[博客文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)以了解有关新内存管理器的更多信息并探索示例项目，或直接跳到[迁移说明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)亲自尝试。

请在您的项目上尝试使用新的内存管理器，看看它是如何工作的，并在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享反馈。

### 新内存管理器中扫描阶段的并发实现

如果您已经切换到我们的新内存管理器（[在 Kotlin 1.6 中宣布](whatsnew16.md#preview-of-the-new-memory-manager)），您可能会注意到执行时间有了巨大的改进：我们的基准测试显示平均提高了 35%。
从 1.6.20 开始，新内存管理器还提供了扫描阶段的并发实现。
这也有望提高性能并减少垃圾收集器暂停的持续时间。

要为新的 Kotlin/Native 内存管理器启用此特性，请传递以下编译器选项：

```bash
-Xgc=cms 
```

欢迎在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48526)中分享您对新内存管理器性能的反馈。

### 注解类的实例化

在 Kotlin 1.6.0 中，注解类的实例化在 Kotlin/JVM 和 Kotlin/JS 中达到了[稳定版](components-stability.md)。
1.6.20 版本为 Kotlin/Native 提供了支持。

了解有关[注解类实例化](annotations.md#instantiation)的更多信息。

### 与 Swift async/await 的互操作：返回 Swift 的 Void 而不是 KotlinUnit

> 与 Swift async/await 的并发互操作是[实验性](components-stability.md)功能。它可能随时删除或更改。
> 您应仅将其用于评估目的。我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 中提供反馈。
>
{style="warning"}

我们继续致力于[与 Swift async/await 的实验性互操作](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await)（自 Swift 5.5 起可用）。
Kotlin 1.6.20 在处理返回类型为 `Unit` 的 `suspend` 函数的方式上与以前的版本不同。

此前，此类函数在 Swift 中表现为返回 `KotlinUnit` 的 `async` 函数。然而，它们正确的返回类型是 `Void`，类似于非 suspend 函数。

为了避免破坏现有代码，我们引入了一个 Gradle 属性，使编译器将返回 `Unit` 的 suspend 函数翻译为返回类型为 `Void` 的 `async` Swift：

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

我们计划在未来的 Kotlin 版本中使此行为成为默认设置。

### 使用 libbacktrace 获得更好的堆栈跟踪

> 使用 libbacktrace 解析源位置是[实验性](components-stability.md)功能。它可能随时删除或更改。
> 您应仅将其用于评估目的。我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424) 中提供反馈。
>
{style="warning"}

Kotlin/Native 现在能够生成详细的堆栈跟踪，其中包含文件位置和行号，以便更好地调试 `linux*`（`linuxMips32` 和 `linuxMipsel32` 除外）和 `androidNative*` 目标。

此特性底层使用了 [libbacktrace](https://github.com/ianlancetaylor/libbacktrace) 库。
请看以下代码，了解其差异示例：

```kotlin
fun main() = bar()
fun bar() = baz()
inline fun baz() {
    error("")
}
```

* **1.6.20 之前：**

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

* **1.6.20 启用 libbacktrace 后：**

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

在 Apple 目标上，堆栈跟踪中已包含文件位置和行号，但 libbacktrace 为内联函数调用提供了更多细节：

* **1.6.20 之前：**

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

* **1.6.20 启用 libbacktrace 后：**

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

要使用 libbacktrace 生成更好的堆栈跟踪，请将以下行添加到 `gradle.properties`：

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

请在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48424)中告诉我们您使用 libbacktrace 调试 Kotlin/Native 的体验如何。

### 支持独立的 Android 可执行文件

此前，Kotlin/Native 中的 Android Native 可执行文件实际上并非可执行文件，而是可以作为 NativeActivity 使用的共享库。现在提供了一个选项，可以为 Android Native 目标生成标准可执行文件。

为此，在您项目的 `build.gradle(.kts)` 部分，配置 `androidNative` 目标的 `executable` 块。
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

我们正在努力开发 Kotlin/Native，以[加快编译过程](https://youtrack.jetbrains.com/issue/KT-42294)并改善您的开发体验。

Kotlin 1.6.20 带来了一些性能更新和错误修复，影响了 Kotlin 生成的 LLVM IR。
根据我们内部项目的基准测试，我们平均实现了以下性能提升：

* 执行时间减少 15%
* 发布版和调试版二进制文件的代码大小减少 20%
* 发布版二进制文件的编译时间减少 26%

这些更改还使大型内部项目上的调试版二进制文件编译时间减少了 10%。

为了实现这一点，我们对一些编译器生成的合成对象实现了静态初始化，改进了我们为每个函数构建 LLVM IR 的方式，并优化了编译器缓存。

### cinterop 模块导入期间改进的错误处理

此版本引入了改进的错误处理，适用于您使用 `cinterop` 工具导入 Objective-C 模块的场景（这在 CocoaPods Pod 中很常见）。
此前，如果您在尝试使用 Objective-C 模块时遇到错误（例如，在头文件中遇到编译错误），您会收到一条信息不明确的错误消息，例如 `fatal error: could not build module $name`。
我们扩展了 `cinterop` 工具的这部分功能，因此您将收到带有扩展描述的错误消息。

### 支持 Xcode 13 库

随 Xcode 13 提供的库从本版本开始获得全面支持。
您可以随时在 Kotlin 代码中访问它们。

## Kotlin Multiplatform

1.6.20 为 Kotlin Multiplatform 带来了以下显著更新：

* [分层结构支持现在是所有新的多平台项目的默认设置](#hierarchical-structure-support-for-multiplatform-projects)
* [Kotlin CocoaPods Gradle 插件获得了几项用于 CocoaPods 集成的有用功能](#kotlin-cocoapods-gradle-plugin)

### 多平台项目的分层结构支持

Kotlin 1.6.20 默认启用了分层结构支持。
自 [Kotlin 1.4.0 中引入该功能](whatsnew14.md#sharing-code-in-several-targets-with-the-hierarchical-project-structure)以来，我们显著改进了前端并使 IDE 导入稳定。

此前，在多平台项目中添加代码有两种方式。第一种是将其插入平台特定的源集，该源集仅限于一个目标，不能被其他平台重用。
第二种是使用在 Kotlin 当前支持的所有平台之间共享的通用源集。

现在，您可以在[几个相似的 Native 目标之间共享源代码](#better-code-sharing-in-your-project)，这些目标重用大量的通用逻辑和第三方 API。
该技术将提供正确的默认依赖项并找到共享代码中可用的精确 API。
这消除了复杂的构建设置，并且不必使用变通方法来获得在 Native 目标之间共享源集的 IDE 支持。
它还有助于防止针对不同目标的不安全 API 用法。

该技术对[库作者](#more-opportunities-for-library-authors)也派上用场，因为分层项目结构允许他们发布和使用针对部分目标的共享 API 库。

默认情况下，使用分层项目结构发布的库仅与分层结构项目兼容。

#### 项目中更好的代码共享

如果没有分层结构支持，则没有直接的方法在_某些_而非_所有_ [Kotlin 目标](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)之间共享代码。
一个常见的例子是在所有 iOS 目标之间共享代码并访问 iOS 特定的[依赖项](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)，例如 Foundation。

得益于分层项目结构支持，您现在可以开箱即用地实现这一点。
在新结构中，源集形成了一个层次结构。
您可以使用适用于给定源集编译到的每个目标的平台特定的语言特性和依赖项。

例如，考虑一个典型的多平台项目，它有两个目标——用于 iOS 设备和模拟器的 `iosArm64` 和 `iosX64`。
Kotlin 工具理解这两个目标具有相同的功能，并允许您从中间源集 `iosMain` 访问该功能。

![iOS 层次结构示例](ios-hierarchy-example.jpg){width=700}

Kotlin 工具链提供正确的默认依赖项，如 Kotlin/Native 标准库或原生库。
此外，Kotlin 工具将尽力找到共享代码中可用的精确 API 接口。
这可以防止诸如在为 Windows 共享的代码中使用 macOS 特定函数的情况。

#### 库作者的更多机会

当多平台库发布时，其中间源集的 API 现在可以正确地随库一起发布，使其可供消费者使用。
同样，Kotlin 工具链将自动识别消费者源集中可用的 API，同时小心防范不安全的使用方式，例如在 JS 代码中使用为 JVM 设计的 API。
了解有关[在库中共享代码](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)的更多信息。

#### 配置与设置

从 Kotlin 1.6.20 开始，所有新的多平台项目都将采用分层项目结构。无需额外设置。

* 如果您已经[手动启用](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)，您可以从 `gradle.properties` 中删除已弃用的选项：

  ```none
  # gradle.properties
  kotlin.mpp.enableGranularSourceSetsMetadata=true
  kotlin.native.enableDependencyPropagation=false // or 'true', depending on your previous setup
  ```

* 对于 Kotlin 1.6.20，我们建议使用 [Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 或更高版本以获得最佳体验。

* 您也可以选择退出。要禁用分层结构支持，请在 `gradle.properties` 中设置以下选项：

  ```none
  # gradle.properties
  kotlin.mpp.hierarchicalStructureSupport=false
  ```

#### 请留下您的反馈

这对整个生态系统来说是一项重大改变。我们感谢您的反馈，帮助我们做得更好。

现在就尝试一下，并将您遇到的任何困难报告给[我们的问题跟踪器](https://kotl.in/issue)。

### Kotlin CocoaPods Gradle 插件

为了简化 CocoaPods 集成，Kotlin 1.6.20 提供了以下功能：

* CocoaPods 插件现在具有构建包含所有注册目标的 XCFrameworks 并生成 Podspec 文件的任务。当您不想直接与 Xcode 集成，但又想构建构件并将其部署到本地 CocoaPods 仓库时，此功能非常有用。
  
  了解有关[构建 XCFrameworks](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#build-xcframeworks) 的更多信息。

* 如果您在项目中使用 [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)，您习惯于为整个 Gradle 项目指定所需的 Pod 版本。现在您有更多选项：
  * 直接在 `cocoapods` 块中指定 Pod 版本
  * 继续使用 Gradle 项目版本
  
  如果这些属性都没有配置，您将收到错误。

* 您现在可以在 `cocoapods` 块中配置 CocoaPod 名称，而不是更改整个 Gradle 项目的名称。

* CocoaPods 插件引入了一个新的 `extraSpecAttributes` 属性，您可以使用它来配置 Podspec 文件中以前硬编码的属性，例如 `libraries` 或 `vendored_frameworks`。

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

请参阅完整的 Kotlin CocoaPods Gradle 插件 [DSL 参考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)。

## Kotlin/JS

Kotlin/JS 1.6.20 中的改进主要影响 IR 编译器：

* [开发二进制文件（IR）的增量编译](#incremental-compilation-for-development-binaries-with-ir-compiler)
* [顶层属性默认延迟初始化（IR）](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)
* [项目模块默认单独生成 JS 文件（IR）](#separate-js-files-for-project-modules-by-default-with-ir-compiler)
* [Char 类优化（IR）](#char-class-optimization)
* [导出改进（IR 和旧后端）](#improvements-to-export-and-typescript-declaration-generation)
* [异步测试的 @AfterTest 保证](#aftertest-guarantees-for-asynchronous-tests)

### 开发二进制文件增量编译（IR 编译器）

为了使 Kotlin/JS 使用 IR 编译器的开发更高效，我们引入了一种新的_增量编译_模式。

在此模式下，使用 `compileDevelopmentExecutableKotlinJs` Gradle 任务构建**开发二进制文件**时，编译器会在模块级别缓存先前编译的结果。
它在后续编译期间使用未更改源文件的缓存编译结果，从而使它们完成得更快，特别是针对小幅更改。
请注意，此改进专门针对开发过程（缩短了编辑-构建-调试周期），不影响生产构件的构建。

要为开发二进制文件启用增量编译，请将以下行添加到项目的 `gradle.properties`：

```none
# gradle.properties
kotlin.incremental.js.ir=true // false by default
```

在我们的试验项目中，新模式使增量编译速度提升高达 30%。但在此模式下的全新构建速度变慢了，因为需要创建和填充缓存。

请在[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-50203)中告诉我们您对 Kotlin/JS 项目中使用增量编译的看法。

### 顶层属性默认延迟初始化（IR 编译器）

在 Kotlin 1.4.30 中，我们在 JS IR 编译器中展示了[顶层属性的延迟初始化](whatsnew1430.md#lazy-initialization-of-top-level-properties)原型。
通过消除在应用程序启动时初始化所有属性的需要，延迟初始化减少了启动时间。
我们的测量结果显示，在实际的 Kotlin/JS 应用程序上，速度提升了约 10%。

现在，我们完善并充分测试了这一机制，并使延迟初始化成为 IR 编译器中顶层属性的默认设置。

```kotlin
// lazy initialization
val a = run {
    val result = // intensive computations
        println(result)
    result
} // run 在变量首次使用时执行
```

如果由于某种原因您需要急切地（在应用程序启动时）初始化一个属性，请用 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/) 注解标记它。

### 项目模块默认单独生成 JS 文件（IR 编译器）

此前，JS IR 编译器[提供了]( https://youtrack.jetbrains.com/issue/KT-44319)为项目模块生成单独 `.js` 文件的功能。
这是默认选项的替代方案——整个项目的一个 `.js` 文件。
此文件可能太大且不方便使用，因为每当您想使用项目中的函数时，都必须将整个 JS 文件作为依赖项包含在内。
多个文件增加了灵活性并减小了此类依赖项的大小。此特性可通过 `-Xir-per-module` 编译器选项获得。

从 1.6.20 开始，JS IR 编译器默认情况下为项目模块生成单独的 `.js` 文件。

现在可以通过以下 Gradle 属性将项目编译成单个 `.js` 文件：

```none
# gradle.properties
kotlin.js.ir.output.granularity=whole-program // `per-module` is the default
```

在以前的版本中，实验性每模块模式（通过 `-Xir-per-module=true` 标志可用）在每个模块中调用 `main()` 函数。这与常规的单个 `.js` 模式不一致。从 1.6.20 开始，`main()` 函数在两种情况下都只会在主模块中调用。如果您确实需要在模块加载时运行某些代码，可以使用用 `@EagerInitialization` 注解标记的顶层属性。请参阅[顶层属性默认延迟初始化（IR）](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)。

### Char 类优化

`Char` 类现在由 Kotlin/JS 编译器处理，而不会引入装箱（boxing）（类似于[内联类](inline-classes.md)）。
这加快了 Kotlin/JS 代码中字符操作的速度。

除了性能改进之外，这还改变了 `Char` 导出到 JavaScript 的方式：它现在被翻译为 `Number`。

### 导出和 TypeScript 声明生成改进

Kotlin 1.6.20 为导出机制（[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 注解）带来了多项修复和改进，包括 [TypeScript 声明（.d.ts）的生成](js-ir-compiler.md#preview-generation-of-typescript-declaration-files-d-ts)。
我们增加了导出接口和枚举的功能，并修复了在一些先前报告的特殊情况下的导出行为。
有关更多详细信息，请参阅 [YouTrack 中导出改进的列表](https://youtrack.jetbrains.com/issues?q=Project:%20Kotlin%20issue%20id:%20KT-45434,%20KT-44494,%20KT-37916,%20KT-43191,%20KT-46961,%20KT-40236)。

了解有关[从 JavaScript 使用 Kotlin 代码](js-to-kotlin-interop.md)的更多信息。

### 异步测试的 @AfterTest 保证

Kotlin 1.6.20 使 [`@AfterTest`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-after-test/) 函数在 Kotlin/JS 上的异步测试中正常工作。
如果测试函数的返回类型被静态解析为 [`Promise`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/)，编译器现在会将 `@AfterTest` 函数的执行调度到相应的 [`then()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/then.html) 回调。

## 安全性

Kotlin 1.6.20 引入了一些特性来提高代码的安全性：

* [在 klib 中使用相对路径](#using-relative-paths-in-klibs)
* [Kotlin/JS Gradle 项目的 yarn.lock 持久化](#persisting-yarn-lock-for-kotlin-js-gradle-projects)
* [默认情况下使用 `--ignore-scripts` 安装 npm 依赖项](#installation-of-npm-dependencies-with-ignore-scripts-by-default)

### 在 klib 中使用相对路径

`klib` 格式的库[包含](native-libraries.md#library-format)源文件的序列化 IR 表示，其中还包括用于生成正确调试信息的文件路径。
在 Kotlin 1.6.20 之前，存储的文件路径是绝对的。由于库作者可能不想共享绝对路径，因此 1.6.20 版本提供了替代选项。

如果您正在发布 `klib` 并希望在构件中只使用源文件的相对路径，您现在可以传递 `-Xklib-relative-path-base` 编译器选项，并带有一个或多个源文件的基础路径：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile::class).configureEach {
    // $base 是源文件的基础路径
    kotlinOptions.freeCompilerArgs += "-Xklib-relative-path-base=$base"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile).configureEach {
    kotlinOptions {
        // $base 是源文件的基础路径
        freeCompilerArgs += "-Xklib-relative-path-base=$base"
    }
}
``` 

</tab>
</tabs>

### Kotlin/JS Gradle 项目的 yarn.lock 持久化

> 此特性已回溯移植到 Kotlin 1.6.10。
>
{style="note"}

Kotlin/JS Gradle 插件现在提供了持久化 `yarn.lock` 文件的功能，使得无需额外的 Gradle 配置即可锁定项目 npm 依赖项的版本。
此特性通过在项目根目录添加自动生成的 `kotlin-js-store` 目录来改变默认项目结构。
其中包含 `yarn.lock` 文件。

我们强烈建议您将 `kotlin-js-store` 目录及其内容提交到您的版本控制系统。
将锁文件提交到版本控制系统是[推荐做法](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)，因为这确保您的应用程序在所有机器上都使用完全相同的依赖树进行构建，无论这些是其他机器上的开发环境还是 CI/CD 服务。
锁文件还可以防止您的 npm 依赖项在项目签出到新机器时静默更新，这是一个安全隐患。

像 [Dependabot](https://github.com/dependabot) 这样的工具也可以解析您的 Kotlin/JS 项目的 `yarn.lock` 文件，并在您的任何 npm 依赖包受到损害时向您提供警告。

如果需要，您可以在构建脚本中更改目录名和锁文件名称：

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

> 更改锁文件的名称可能导致依赖项检查工具无法再识别该文件。
> 
{style="warning"}

### 默认情况下使用 --ignore-scripts 安装 npm 依赖项

> 此特性已回溯移植到 Kotlin 1.6.10。
>
{style="note"}

Kotlin/JS Gradle 插件现在默认情况下阻止在安装 npm 依赖项期间执行[生命周期脚本](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)。
此更改旨在降低从受损 npm 包执行恶意代码的可能性。

要回滚到旧配置，您可以通过在 `build.gradle(.kts)` 中添加以下行来显式启用生命周期脚本执行：

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

* 用于定义 Kotlin 编译器执行策略的新[属性 `kotlin.compiler.execution.strategy` 和 `compilerExecutionStrategy`](#properties-for-defining-kotlin-compiler-execution-strategy)
* [弃用选项 `kapt.use.worker.api`、`kotlin.experimental.coroutines` 和 `kotlin.coroutines`](#deprecation-of-build-options-for-kapt-and-coroutines)
* [移除 `kotlin.parallel.tasks.in.project` 构建选项](#removal-of-the-kotlin-parallel-tasks-in-project-build-option)

### 用于定义 Kotlin 编译器执行策略的属性

在 Kotlin 1.6.20 之前，您使用系统属性 `-Dkotlin.compiler.execution.strategy` 来定义 Kotlin 编译器执行策略。
此属性在某些情况下可能不方便。
Kotlin 1.6.20 引入了一个同名的 Gradle 属性 `kotlin.compiler.execution.strategy`，以及编译任务属性 `compilerExecutionStrategy`。

系统属性仍然有效，但在未来版本中将被移除。

当前属性的优先级如下：

* 任务属性 `compilerExecutionStrategy` 优先于系统属性和 Gradle 属性 `kotlin.compiler.execution.strategy`。
* Gradle 属性优先于系统属性。

有三种编译器执行策略可以分配给这些属性：

| 策略       | Kotlin 编译器执行位置        | 增量编译 | 其他特性                                                  |
|----------------|--------------------------------------|-------------------------|------------------------------------------------------------------------|
| Daemon         | 在其自己的守护进程中        | 是                     | *默认策略*。可在不同 Gradle 守护进程之间共享 |
| In process     | 在 Gradle 守护进程中     | 否                      | 可能与 Gradle 守护进程共享堆内存                              |
| Out of process | 每次调用在单独的进程中  | 否                      | —                                                                           |

因此，`kotlin.compiler.execution.strategy` 属性（系统属性和 Gradle 属性）的可用值是：
1. `daemon`（默认）
2. `in-process`
3. `out-of-process`

在 `gradle.properties` 中使用 Gradle 属性 `kotlin.compiler.execution.strategy`：

```none
# gradle.properties
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 任务属性的可用值是：

1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON`（默认）
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

在 `build.gradle.kts` 构建脚本中使用任务属性 `compilerExecutionStrategy`：

```kotlin
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<KotlinCompile>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

请在[此 YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-49299)中留下您的反馈。

### 弃用 kapt 和协程的构建选项

在 Kotlin 1.6.20 中，我们更改了属性的弃用级别：

* 我们弃用了通过 Kotlin 守护进程运行 [kapt](kapt.md) 的功能，使用 `kapt.use.worker.api`——现在它会在 Gradle 的输出中生成一个警告。
  默认情况下，[kapt 从 1.3.70 版本开始已使用 Gradle worker](kapt.md#run-kapt-tasks-in-parallel)，我们建议继续使用此方法。

  我们将在未来版本中移除选项 `kapt.use.worker.api`。

* 我们弃用了 `kotlin.experimental.coroutines` Gradle DSL 选项和 `gradle.properties` 中使用的 `kotlin.coroutines` 属性。
  只需使用_挂起函数_或[将 `kotlinx.coroutines` 依赖项](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)添加到您的 `build.gradle(.kts)` 文件中。
  
  在[协程指南](coroutines-guide.md)中了解有关协程的更多信息。

### 移除 kotlin.parallel.tasks.in.project 构建选项

在 Kotlin 1.5.20 中，我们[宣布弃用构建选项 `kotlin.parallel.tasks.in.project`](whatsnew1520.md#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)。
此选项已在 Kotlin 1.6.20 中移除。

根据项目，Kotlin 守护进程中的并行编译可能需要更多内存。
要减少内存消耗，请[增加 Kotlin 守护进程的堆内存大小](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)。

在 Kotlin Gradle 插件中了解有关[当前支持的编译器选项](gradle-compiler-options.md)的更多信息。