[//]: # (title: Kotlin 1.6.20 最新变化)

<web-summary>阅读 Kotlin 1.6.20 版本说明，了解新的语言功能、Kotlin Multiplatform、JVM、Native、JS 的更新，以及 Gradle 和 Maven 的构建工具支持。</web-summary>

_[发布日期：2022 年 4 月 4 日](releases.md#release-history)_

Kotlin 1.6.20 展示了未来语言功能的预览，将分层结构设为多平台项目的默认设置，并为其他组件带来了演进式改进。

您也可以在此视频中找到这些变化的简要概述：

<video src="https://www.youtube.com/v/8F19ds109-o" title="Kotlin 1.6.20 最新变化"/>

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## 语言

在 Kotlin 1.6.20 中，您可以试用两个新的语言功能：

* [Kotlin/JVM 的上下文接收器（context receivers）原型](#prototype-of-context-receivers-for-kotlin-jvm)
* [绝对不可为 null 的类型](#definitely-non-nullable-types)

### Kotlin/JVM 的上下文接收器原型

> 该功能仅作为 Kotlin/JVM 的原型提供。启用 `-Xcontext-receivers` 后，编译器将生成预发布版本的二进制文件，这些文件不能用于生产代码。请仅在您的练手项目中使用上下文接收器。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供反馈。
>
{style="warning"}

在 Kotlin 1.6.20 中，您不再受限于只能拥有一个接收器。如果您需要更多接收器，可以通过在声明中添加上下文接收器，使函数、属性和类依赖于上下文（或称为“上下文相关”）。上下文相关的声明具有以下特性：

* 它要求所有声明的上下文接收器作为隐式接收器存在于调用者的作用域中。
* 它会将声明的上下文接收器作为隐式接收器引入其函数体作用域中。

```kotlin
interface LoggingContext {
    val log: Logger // 此上下文提供对 logger 的引用 
}

context(LoggingContext)
fun startBusinessOperation() {
    // 您可以访问 log 属性，因为 LoggingContext 是一个隐式接收器
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // 调用 startBusinessOperation() 
        // 需要作用域中存在 LoggingContext 作为隐式接收器
        startBusinessOperation()
    }
}
```

要在项目中启用上下文接收器，请使用 `-Xcontext-receivers` 编译器选项。您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md#detailed-design) 中找到该功能及其语法的详细说明。

请注意，目前的实现是原型：

* 启用 `-Xcontext-receivers` 后，编译器将生成预发布二进制文件，无法用于生产代码
* 目前 IDE 对上下文接收器的支持还非常有限

请在您的练手项目中试用此功能，并在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-42435) 中分享您的想法和经验。如果您遇到任何问题，请[提交新问题](https://kotl.in/issue)。

### 绝对不可为 null 的类型

> 绝对不可为 null 的类型目前处于 [Beta](components-stability.md) 阶段。它们已经基本稳定，但未来可能需要迁移步骤。我们会尽力减少您需要进行的更改。
>
{style="warning"}

为了在扩展泛型 Java 类和接口时提供更好的互操作性，Kotlin 1.6.20 允许您在工作站点（use site）使用新语法 `T & Any` 将泛型类型参数标记为绝对不可为 null。
这种语法形式源自[相交类型](https://wikipedia.org/wiki/Intersection_type)的表示法，目前仅限于 `&` 左侧带有可为 null 上界（upper bounds）的类型参数，以及右侧不可为 null 的 `Any`：

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // 正常
    elvisLike<String>("", "").length
    // 错误：'null' 不能作为非 null 类型的值
    elvisLike<String>("", null).length

    // 正常
    elvisLike<String?>(null, "").length
    // 错误：'null' 不能作为非 null 类型的值
    elvisLike<String?>(null, null).length
}
```
{validate="false"}

将语言版本设置为 `1.7` 以启用该功能：

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

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md) 中详细了解绝对不可为 null 的类型。

## Kotlin/JVM

Kotlin 1.6.20 引入了：

* JVM 接口中默认方法的兼容性改进：[为接口新增了 `@JvmDefaultWithCompatibility` 注解](#new-jvmdefaultwithcompatibility-annotation-for-interfaces) 以及 [针对 `-Xjvm-default` 模式的兼容性更改](#compatibility-changes-in-the-xjvm-default-modes)
* [支持在 JVM 后端对单个模块进行并行编译](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
* [支持对函数式接口构造函数的可调用引用](#support-for-callable-references-to-functional-interface-constructors)

### 为接口新增 @JvmDefaultWithCompatibility 注解

Kotlin 1.6.20 引入了新注解 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)：将其与 `-Xjvm-default=all` 编译器选项配合使用，可为任何 Kotlin 接口中的任何非抽象成员[在 JVM 接口中创建默认方法](java-to-kotlin-interop.md#default-methods-in-interfaces)。

如果有客户端使用未经 `-Xjvm-default=all` 选项编译的 Kotlin 接口，它们可能与使用此选项编译的代码二进制不兼容。
在 Kotlin 1.6.20 之前，为了避免这种兼容性问题，[推荐的做法](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility)是使用 `-Xjvm-default=all-compatibility` 模式，并对不需要此类兼容性的接口使用 `@JvmDefaultWithoutCompatibility` 注解。

这种做法有一些缺点：

* 在添加新接口时，很容易忘记添加注解。
* 通常非公开部分的接口比公开 API 中的接口多，因此您最终会在代码的许多地方都带有此注解。

现在，您可以使用 `-Xjvm-default=all` 模式并为接口标记 `@JvmDefaultWithCompatibility` 注解。这允许您一次性为公开 API 中的所有接口添加此注解，而对于新的非公开代码，则无需使用任何注解。

请在 [此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-48217) 中留下您对该新注解的反馈。

### -Xjvm-default 模式的兼容性更改

Kotlin 1.6.20 增加了对使用默认模式（`-Xjvm-default=disable` 编译器选项）编译的模块与使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式编译的模块进行编译的支持。
和以前一样，如果所有模块都使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式，编译也会成功。
您可以在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-47000) 中留下反馈。

Kotlin 1.6.20 弃用了编译器选项 `-Xjvm-default` 的 `compatibility` 和 `enable` 模式。
其他模式的兼容性描述有所更改，但整体逻辑保持不变。您可以查看[更新后的说明](java-to-kotlin-interop.md#compatibility-modes-for-default-methods)。

有关 Java 互操作中默认方法的更多信息，请参阅[互操作文档](java-to-kotlin-interop.md#default-methods-in-interfaces)以及[这篇博文](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 支持在 JVM 后端对单个模块进行并行编译

> 支持在 JVM 后端对单个模块进行并行编译目前处于 [实验性](components-stability.md) 阶段。它可能随时被删除或更改。需要启用该功能（详见下文），且您应仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-46085) 上提供反馈。
>
{style="warning"}

我们正在继续致力于[提高新 JVM IR 后端的编译时间](https://youtrack.jetbrains.com/issue/KT-46768)。
在 Kotlin 1.6.20 中，我们为 JVM IR 后端添加了实验性的并行编译模式，可以并行编译模块中的所有文件。并行编译可以将总编译时间最多缩短 15%。

使用 [编译器选项](compiler-reference.md#compiler-options) `-Xbackend-threads` 启用实验性的并行后端模式。该选项可使用以下参数：

* `N` 是您想要使用的线程数。它不应大于您的 CPU 核心数；否则，由于线程之间的上下文切换，并行化将失去效果。
* `0` 表示为每个 CPU 核心使用一个单独的线程。

[Gradle](gradle.md) 可以并行运行任务，但从 Gradle 的角度来看，当一个项目（或项目的主要部分）只是一个巨大的任务时，这种并行化帮助不大。
如果您有一个非常庞大的单体模块，请使用并行编译来提高编译速度。
如果您的项目包含许多小模块且已由 Gradle 进行了并行构建，那么添加另一层并行化可能会因为上下文切换而损害性能。

> 并行编译有一些限制：
> * 它不适用于 [kapt](kapt.md)，因为 kapt 会禁用 IR 后端。
> * 由于设计原因，它需要更多的 JVM 堆内存。堆内存量与线程数成正比。
>
{style="note"}

### 支持对函数式接口构造函数的可调用引用

> 支持对函数式接口构造函数的可调用引用目前处于 [实验性](components-stability.md) 阶段。它可能随时被删除或更改。需要启用该功能（详见下文），且您应仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47939) 上提供反馈。
>
{style="warning"}

支持对[可调用引用](reflection.md#callable-references)指向函数式接口构造函数，为从带有构造函数的普通接口迁移到[函数式接口](fun-interfaces.md)提供了一种源码兼容的方式。

考虑以下代码：

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

启用对函数式接口构造函数的可调用引用后，上述代码可以仅替换为函数式接口声明：

```kotlin
fun interface Printer {
    fun print()
}
```

它的构造函数将被隐式创建，任何使用 `::Printer` 函数引用的代码都将能够编译。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```
{validate="false"}

通过为旧函数 `Printer` 标记 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 注解并将 `DeprecationLevel` 设置为 `HIDDEN` 来保持二进制兼容性：

```kotlin
@Deprecated(message = "有关弃用的消息", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```
{validate="false"}

使用编译器选项 `-XXLanguage:+KotlinFunInterfaceConstructorReference` 来启用此功能。

## Kotlin/Native

Kotlin/Native 1.6.20 标志着其新组件的持续开发。我们在提供跨平台一致的 Kotlin 体验方面又迈出了一步：

* [新内存管理器的更新](#an-update-on-the-new-memory-manager)
* [新内存管理器中清除（sweep）阶段的并发实现](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
* [注解类实例化](#instantiation-of-annotation-classes)
* [与 Swift async/await 的互操作：返回 Swift 的 Void 而非 KotlinUnit](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [通过 libbacktrace 获得更好的堆栈跟踪](#better-stack-traces-with-libbacktrace)
* [支持独立的 Android 可执行文件](#support-for-standalone-android-executables)
* [性能改进](#performance-improvements)
* [改进了 cinterop 模块导入期间的错误处理](#improved-error-handling-during-cinterop-modules-import)
* [支持 Xcode 13 库](#support-for-xcode-13-libraries)

### 新内存管理器的更新 

> 新的 Kotlin/Native 内存管理器处于 [Alpha](components-stability.md) 阶段。它未来可能会发生不兼容的更改，并需要手动迁移。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 上提供反馈。
>
{style="note"}

在 Kotlin 1.6.20 中，您可以试用新 Kotlin/Native 内存管理器的 Alpha 版本。它消除了 JVM 和 Native 平台之间的差异，在多平台项目中提供一致的开发者体验。例如，您可以更轻松地创建同时在 Android 和 iOS 上运行的跨平台移动应用程序。

新的 Kotlin/Native 内存管理器解除了对线程间对象共享的限制。它还提供了无泄漏的并发编程原语，这些原语是安全的，不需要任何特殊的管理或注解。

新内存管理器将在未来版本中成为默认设置，因此我们鼓励您现在就尝试。
请查看我们的[博文](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)以了解有关新内存管理器的更多信息并探索示例项目，或者直接跳转到[迁移说明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)进行尝试。

尝试在您的项目中使用新内存管理器以了解其运行情况，并在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享反馈。

### 新内存管理器中清除阶段的并发实现

如果您已经切换到了我们在 [Kotlin 1.6 中宣布](whatsnew16.md#preview-of-the-new-memory-manager)的新内存管理器，您可能会注意到执行时间的大幅改进：我们的基准测试显示平均性能提升了 35%。
从 1.6.20 开始，新内存管理器还提供了清除阶段的并发实现。这应该会进一步提高性能并缩短垃圾回收器的暂停时长。

要为新 Kotlin/Native 内存管理器启用该功能，请传递以下编译器选项：

```bash
-Xgc=cms 
```

欢迎在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48526) 中分享您对新内存管理器性能的反馈。

### 注解类实例化

在 Kotlin 1.6.0 中，注解类的实例化在 Kotlin/JVM 和 Kotlin/JS 上已达到 [稳定](components-stability.md) 状态。1.6.20 版本则交付了对 Kotlin/Native 的支持。

了解有关 [注解类实例化](annotations.md#instantiation) 的更多信息。

### 与 Swift async/await 的互操作：返回 Void 而非 KotlinUnit

> 与 Swift async/await 的并发互操作性处于 [实验性](components-stability.md) 阶段。它可能随时被删除或更改。您应仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 上提供反馈。
>
{style="warning"}

我们继续致力于[与 Swift async/await 的实验性互操作](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await)（自 Swift 5.5 起可用）。Kotlin 1.6.20 与之前版本在处理返回类型为 `Unit` 的 `suspend` 函数方面有所不同。

此前，此类函数在 Swift 中呈现为返回 `KotlinUnit` 的 `async` 函数。然而，对于它们来说，更合适的返回类型应该是 `Void`，类似于非挂起函数。

为了避免破坏现有代码，我们引入了一个 Gradle 属性，使编译器将返回 `Unit` 的挂起函数翻译为返回 `Void` 类型的 `async` Swift 函数：

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

我们计划在未来的 Kotlin 版本中将此行为设为默认。

### 通过 libbacktrace 获得更好的堆栈跟踪

> 使用 libbacktrace 来解析源代码位置处于 [实验性](components-stability.md) 阶段。它可能随时被删除或更改。您应仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424) 上提供反馈。
>
{style="warning"}

Kotlin/Native 现在能够为 `linux*`（不包括 `linuxMips32` 和 `linuxMipsel32`）和 `androidNative*` 目标生成包含文件位置和行号的详细堆栈跟踪，以便更好地进行调试。

该功能在后台使用了 [libbacktrace](https://github.com/ianlancetaylor/libbacktrace) 库。请看以下代码示例了解差异：

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

* **1.6.20 使用 libbacktrace：**

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

对于已经可以在堆栈跟踪中显示文件位置和行号的 Apple 目标，libbacktrace 为内联函数调用提供了更多细节：

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

* **1.6.20 使用 libbacktrace：**

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

要使用 libbacktrace 生成更好的堆栈跟踪，请在 `gradle.properties` 中添加以下行：

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

请在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48424) 中告诉我们使用 libbacktrace 调试 Kotlin/Native 的体验如何。

### 支持独立的 Android 可执行文件

以前，Kotlin/Native 中的 Android Native 可执行文件实际上并不是真正的可执行文件，而是可以作为 NativeActivity 使用的共享库。现在增加了一个选项，可以为 Android Native 目标生成标准的可执行文件。

为此，请在项目的 `build.gradle(.kts)` 部分中，配置 `androidNative` 目标的 executable 块。添加以下二进制选项：

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

请注意，此功能将在 Kotlin 1.7.0 中成为默认设置。如果您想保留当前行为，请使用以下设置：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

感谢 Mattia Iavarone 的 [实现](https://github.com/jetbrains/kotlin/pull/4624)！

### 性能改进

我们正致力于 Kotlin/Native 以[加速编译过程](https://youtrack.jetbrains.com/issue/KT-42294)并提升您的开发体验。

Kotlin 1.6.20 带来了一些性能更新和错误修复，这些更新会影响 Kotlin 生成的 LLVM IR。根据我们内部项目的基准测试，我们平均实现了以下性能提升：

* 执行时间减少 15%
* 发行版（release）和调试版（debug）二进制文件的代码量均减少 20%
* 发行版二进制文件的编译时间减少 26%

这些更改还使大型内部项目调试版二进制文件的编译时间减少了 10%。

为了实现这一目标，我们为某些编译器生成的合成对象实现了静态初始化，改进了每个函数的 LLVM IR 结构化方式，并优化了编译器缓存。

### 改进了 cinterop 模块导入期间的错误处理

此版本针对使用 `cinterop` 工具导入 Objective-C 模块的情况（通常用于 CocoaPods pods）改进了错误处理。此前，如果您在尝试使用 Objective-C 模块时遇到错误（例如，在处理头文件中的编译错误时），您会收到一个毫无意义的错误消息，例如 `fatal error: could not build module $name`。我们对 `cinterop` 工具的这部分进行了扩展，因此您现在将收到带有详细说明的错误消息。

### 支持 Xcode 13 库

从本版本开始，完全支持随 Xcode 13 交付的库。您可以随时从 Kotlin 代码的任何地方访问它们。

## Kotlin Multiplatform

1.6.20 为 Kotlin Multiplatform 带来了以下显著更新：

* [现在所有新多平台项目默认启用分层结构支持](#hierarchical-structure-support-for-multiplatform-projects)
* [Kotlin CocoaPods Gradle 插件增加了几个用于 CocoaPods 集成的有用功能](#kotlin-cocoapods-gradle-plugin)

### 分层结构支持多平台项目

Kotlin 1.6.20 默认启用了分层结构支持。自 [Kotlin 1.4.0 引入此功能](whatsnew14.md#sharing-code-in-several-targets-with-the-hierarchical-project-structure)以来，我们显著改进了前端并使 IDE 导入变得稳定。

以前，在多平台项目中添加代码有两种方式。第一种是将其插入特定于平台的源集，这仅限于一个目标，且无法被其他平台重用。第二种是使用通用的源集，在 Kotlin 当前支持的所有平台之间共享。

现在，您可以在几个类似的 native 目标之间[共享源代码](#better-code-sharing-in-your-project)，这些目标重用了大量的通用逻辑和第三方 API。该技术将提供正确的默认依赖项，并找到共享代码中可用的确切 API。这消除了复杂的构建设置，也无需使用变通方法来获取 IDE 支持以在 native 目标之间共享源集。它还有助于防止在错误的平台上使用了不安全的 API。

这项技术对[库作者](#more-opportunities-for-library-authors)也非常有用，因为分层项目结构允许他们为目标的子集发布和使用具有通用 API 的库。

默认情况下，使用分层项目结构发布的库仅与分层结构项目兼容。

#### 更好地共享项目中的代码

如果没有分层结构支持，就无法直接在 _部分_ 但不是 _全部_ [Kotlin 目标](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)之间共享代码。一个典型的例子是在所有 iOS 目标之间共享代码，并访问 iOS 特有的[依赖项](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries)（如 Foundation）。

得益于分层项目结构的支持，您现在可以开箱即用。在新结构中，源集形成了一个层次结构。您可以使用针对给定源集所编译的每个目标都可用的特定平台语言功能和依赖项。

例如，考虑一个具有两个目标的典型多平台项目：针对 iOS 设备和模拟器的 `iosArm64` 和 `iosX64`。Kotlin 工具链识别出这两个目标具有相同的函数，并允许您从中间源集 `iosMain` 访问该函数。

![iOS 层次结构示例](ios-hierarchy-example.jpg){width=700}

Kotlin 工具链提供了正确的默认依赖项，如 Kotlin/Native 标准库或原生库。此外，Kotlin 工具链会尽力找到共享代码中可用的确切 API 范围。这可以防止出现诸如在为 Windows 共享的代码中使用特定于 macOS 的函数之类的情况。

#### 库作者的更多机会

当发布多平台库时，其中间源集的 API 现在会随之正确发布，供使用者使用。同样，Kotlin 工具链将自动计算使用者源集中可用的 API，同时仔细留意不安全的使用情况，例如在 JS 代码中使用专为 JVM 设计的 API。了解有关 [在库中共享代码](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-in-libraries) 的更多信息。

#### 配置与设置

从 Kotlin 1.6.20 开始，所有新创建的多平台项目都将具有分层项目结构。无需额外设置。

* 如果您已经[手动开启](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)了该功能，可以从 `gradle.properties` 中删除已弃用的选项：

  ```none
  # gradle.properties
  kotlin.mpp.enableGranularSourceSetsMetadata=true
  kotlin.native.enableDependencyPropagation=false // 或 'true'，取决于您之前的设置
  ```

* 对于 Kotlin 1.6.20，我们建议使用 [Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 或更高版本，以获得最佳体验。

* 您也可以选择退出。要禁用分层结构支持，请在 `gradle.properties` 中设置以下选项：

  ```none
  # gradle.properties
  kotlin.mpp.hierarchicalStructureSupport=false
  ```

#### 留下您的反馈

这是对整个生态系统的一次重大改变。我们欢迎您的反馈，以帮助我们做得更好。

现在就尝试，并将您遇到的任何困难报告给 [我们的问题跟踪器](https://kotl.in/issue)。

### Kotlin CocoaPods Gradle 插件

为了简化 CocoaPods 集成，Kotlin 1.6.20 交付了以下功能：

* CocoaPods 插件现在拥有可以为所有注册目标构建 XCFramework 并生成 Podspec 文件的任务。当您不想直接与 Xcode 集成，但希望构建工件并将其部署到本地 CocoaPods 仓库时，这非常有用。
  
  了解有关 [构建 XCFrameworks](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#build-xcframeworks) 的更多信息。

* 如果您在项目中使用 [CocoaPods 集成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)，通常需要为整个 Gradle 项目指定所需的 Pod 版本。现在您有了更多选择：
  * 直接在 `cocoapods` 块中指定 Pod 版本
  * 继续使用 Gradle 项目版本
  
  如果这些属性都没有配置，您将收到一个错误。

* 您现在可以在 `cocoapods` 块中配置 CocoaPod 名称，而无需更改整个 Gradle 项目的名称。

* CocoaPods 插件引入了一个新的 `extraSpecAttributes` 属性，您可以使用它配置 Podspec 文件中以前硬编码的属性，例如 `libraries` 或 `vendored_frameworks`。

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

查看完整的 Kotlin CocoaPods Gradle 插件 [DSL 参考](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html)。

## Kotlin/JS

Kotlin/JS 在 1.6.20 中的改进主要影响 IR 编译器：

* [开发版二进制文件的增量编译 (IR)](#incremental-compilation-for-development-binaries-with-ir-compiler)
* [默认对顶层属性进行延迟初始化 (IR)](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)
* [默认按项目模块生成单独的 JS 文件 (IR)](#separate-js-files-for-project-modules-by-default-with-ir-compiler)
* [Char 类优化 (IR)](#char-class-optimization)
* [导出机制改进（包括 IR 和旧版后端）](#improvements-to-export-and-typescript-declaration-generation)
* [异步测试的 @AfterTest 保证](#aftertest-guarantees-for-asynchronous-tests)

### 开发版二进制文件的增量编译（使用 IR 编译器）

为了提高使用 IR 编译器进行 Kotlin/JS 开发的效率，我们引入了一种新的“增量编译”模式。

在此模式下，使用 `compileDevelopmentExecutableKotlinJs` Gradle 任务构建 **开发版二进制文件** 时，编译器会在模块级别缓存先前编译的结果。在随后的编译中，它会对未更改的源文件使用缓存的编译结果，从而使编译能够更快完成，尤其是在只有细微改动的情况下。请注意，这项改进专门针对开发过程（缩短“编辑-构建-调试”循环），不会影响生产工件的构建。

要为开发版二进制文件启用增量编译，请将以下行添加到项目的 `gradle.properties`：

```none
# gradle.properties
kotlin.incremental.js.ir=true // 默认为 false
```

在我们的测试项目中，新模式使增量编译速度提升了多达 30%。然而，由于需要创建和填充缓存，该模式下的全新构建（clean build）会变得更慢。

请在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-50203) 中告诉我们您对在 Kotlin/JS 项目中使用增量编译的看法。

### 默认对顶层属性进行延迟初始化（使用 IR 编译器）

在 Kotlin 1.4.30 中，我们在 JS IR 编译器中展示了[顶层属性延迟初始化](whatsnew1430.md#lazy-initialization-of-top-level-properties)的原型。通过消除应用程序启动时初始化所有属性的需求，延迟初始化缩短了启动时间。我们的测量结果显示，在真实的 Kotlin/JS 应用程序中速度提升了约 10%。

现在，在经过完善和妥善测试后，我们正使延迟初始化成为 IR 编译器中顶层属性的默认行为。

```kotlin
// 延迟初始化
val a = run {
    val result = // 密集计算
        println(result)
    result
} // run 在变量第一次被使用时执行
```

如果由于某种原因您需要立即（在应用程序启动时）初始化属性，请标记 [`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/) 注解。

### 默认按项目模块生成单独的 JS 文件（使用 IR 编译器）

此前，JS IR 编译器提供了[为项目模块生成单独 `.js` 文件]( https://youtrack.jetbrains.com/issue/KT-44319)的能力。这是默认选项——整个项目生成单个 `.js` 文件——之外的一种替代方案。单个文件可能会太大且不便使用，因为每当您想使用项目中的一个函数时，都必须包含整个 JS 文件作为依赖项。拆分成多个文件增加了灵活性并减少了此类依赖项的大小。该功能可通过 `-Xir-per-module` 编译器选项使用。

从 1.6.20 开始，JS IR 编译器默认按项目模块生成单独的 `.js` 文件。

现在可以通过以下 Gradle 属性将项目编译为单个 `.js` 文件：

```none
# gradle.properties
kotlin.js.ir.output.granularity=whole-program // 默认为 `per-module`
```

在以前的发行版中，实验性的按模块模式（通过 `-Xir-per-module=true` 标志启用）会在每个模块中调用 `main()` 函数。这与常规的单个 `.js` 模式不一致。从 1.6.20 开始，在这两种情况下，`main()` 函数都将仅在主模块中被调用。如果您确实需要在加载模块时运行某些代码，可以使用带有 `@EagerInitialization` 注解的顶层属性。参见 [默认对顶层属性进行延迟初始化 (IR)](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)。

### Char 类优化

现在，Kotlin/JS 编译器处理 `Char` 类时无需引入装箱（类似于 [内联类](inline-classes.md)）。这加快了 Kotlin/JS 代码中字符操作的速度。

除了性能提升外，这还改变了 `Char` 导出到 JavaScript 的方式：它现在被翻译为 `Number`。

### 导出机制和 TypeScript 声明生成的改进

Kotlin 1.6.20 为导出机制（[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 注解）带来了多项修复和改进，包括 [TypeScript 声明 (`.d.ts`) 的生成](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)。
我们增加了导出接口和枚举的功能，并修复了之前向我们报告的一些边缘情况下的导出行为。
有关更多详细信息，请参阅 [YouTrack 上的导出改进列表](https://youtrack.jetbrains.com/issues?q=Project:%20Kotlin%20issue%20id:%20KT-45434,%20KT-44494,%20KT-37916,%20KT-43191,%20KT-46961,%20KT-40236)。

了解有关 [从 JavaScript 使用 Kotlin 代码](js-to-kotlin-interop.md) 的更多信息。

### 异步测试的 @AfterTest 保证

Kotlin 1.6.20 使 [`@AfterTest`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-after-test/) 函数能与 Kotlin/JS 上的异步测试正常协作。如果测试函数的返回类型被静态解析为 [`Promise`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/)，编译器现在会调度 `@AfterTest` 函数在相应的 [`then()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/then.html) 回调中执行。

## 安全性

Kotlin 1.6.20 引入了几项功能来提高代码的安全性：

* [在 klib 中使用相对路径](#using-relative-paths-in-klibs)
* [为 Kotlin/JS Gradle 项目持久化 yarn.lock](#persisting-yarn-lock-for-kotlin-js-gradle-projects)
* [默认通过 `--ignore-scripts` 安装 npm 依赖项](#installation-of-npm-dependencies-with-ignore-scripts-by-default)

### 在 klib 中使用相对路径

`klib` 格式的库[包含](native-libraries.md#library-format)源文件的序列化 IR 表示，其中还包括用于生成正确调试信息的路径。在 Kotlin 1.6.20 之前，存储的文件路径是绝对路径。由于库作者可能不想分享绝对路径，1.6.20 版本提供了一个替代选项。

如果您正在发布 `klib` 并希望工件中仅使用源文件的相对路径，现在可以传递 `-Xklib-relative-path-base` 编译器选项，并带有一个或多个源文件的基础路径：

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

### 为 Kotlin/JS Gradle 项目持久化 yarn.lock

> 该功能已反向移植到 Kotlin 1.6.10。
>
{style="note"}

Kotlin/JS Gradle 插件现在提供了持久化 `yarn.lock` 文件的能力，从而可以在无需额外 Gradle 配置的情况下锁定项目的 npm 依赖项版本。该功能通过在项目根目录添加自动生成的 `kotlin-js-store` 目录来改变默认项目结构。它在内部保存 `yarn.lock` 文件。

我们强烈建议将 `kotlin-js-store` 目录及其内容提交到您的版本控制系统。将锁文件提交到版本控制系统是[推荐的做法](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/)，因为它确保您的应用程序在所有机器上（无论是其他机器上的开发环境还是 CI/CD 服务）都使用完全相同的依赖树进行构建。锁文件还能防止在另一台新机器上检出项目时悄悄更新 npm 依赖项，这存在安全隐患。

诸如 [Dependabot](https://github.com/dependabot) 之类的工具也可以解析 Kotlin/JS 项目的 `yarn.lock` 文件，并在您依赖的任何 npm 软件包受到损害时为您提供警告。

如果需要，您可以在构建脚本中更改目录和锁文件的名称：

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

> 更改锁文件的名称可能会导致依赖项检查工具无法再识别该文件。
> 
{style="warning"}

### 默认通过 --ignore-scripts 安装 npm 依赖项

> 该功能已反向移植到 Kotlin 1.6.10。
>
{style="note"}

Kotlin/JS Gradle 插件现在默认防止在安装 npm 依赖项期间执行[生命周期脚本](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)。此更改旨在降低执行来自受损 npm 软件包的恶意代码的可能性。

要回退到旧配置，可以通过向 `build.gradle(.kts)` 添加以下行来显式启用生命周期脚本执行：

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

了解更多关于 [Kotlin/JS Gradle 项目的 npm 依赖项](js-project-setup.md#npm-dependencies)。

## Gradle

Kotlin 1.6.20 为 Kotlin Gradle 插件带来了以下变化：

* 新的 [属性 `kotlin.compiler.execution.strategy` 和 `compilerExecutionStrategy`](#properties-for-defining-kotlin-compiler-execution-strategy) 用于定义 Kotlin 编译器执行策略
* [弃用了 `kapt.use.worker.api`、`kotlin.experimental.coroutines` 和 `kotlin.coroutines` 选项](#deprecation-of-build-options-for-kapt-and-coroutines)
* [删除了 `kotlin.parallel.tasks.in.project` 构建选项](#removal-of-the-kotlin-parallel-tasks-in-project-build-option)

### 用于定义 Kotlin 编译器执行策略的属性

在 Kotlin 1.6.20 之前，您使用系统属性 `-Dkotlin.compiler.execution.strategy` 来定义 Kotlin 编译器执行策略。该属性在某些情况下可能不太方便。
Kotlin 1.6.20 引入了一个同名的 Gradle 属性 `kotlin.compiler.execution.strategy` 以及编译任务属性 `compilerExecutionStrategy`。

系统属性目前仍然有效，但在未来的版本中将被删除。

当前属性的优先级如下：

* 任务属性 `compilerExecutionStrategy` 的优先级高于系统属性和 Gradle 属性 `kotlin.compiler.execution.strategy`。
* Gradle 属性的优先级高于系统属性。

您可以为这些属性分配三种编译器执行策略：

| 策略 | Kotlin 编译器执行位置 | 增量编译 | 其他特点 |
|----------------|--------------------------------------|-------------------------|------------------------------------------------------------------------|
| Daemon（守护进程） | 在其自身的守护进程中 | 是 | *默认策略*。可以在不同的 Gradle 守护进程之间共享 |
| In process（进程内） | 在 Gradle 守护进程内 | 否 | 可能与 Gradle 守护进程共享堆内存 |
| Out of process（进程外） | 为每次调用在单独的进程中运行 | 否 | — |

相应地，`kotlin.compiler.execution.strategy` 属性（包括系统属性和 Gradle 属性）的可用值为：
1. `daemon`（默认）
2. `in-process`
3. `out-of-process`

在 `gradle.properties` 中使用 Gradle 属性 `kotlin.compiler.execution.strategy`：

```none
# gradle.properties
kotlin.compiler.execution.strategy=out-of-process
```

`compilerExecutionStrategy` 任务属性的可用值为：

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

请在 [此 YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-49299) 中留下您的反馈。

### 弃用 kapt 和协程的构建选项

在 Kotlin 1.6.20 中，我们更改了以下属性的弃用级别：

* 我们弃用了通过 Kotlin 守护进程运行 [kapt](kapt.md) 的功能（使用 `kapt.use.worker.api`）——现在它会在 Gradle 输出中生成警告。自 1.3.70 版本以来，[kapt 默认一直使用 Gradle workers](kapt.md#run-kapt-tasks-in-parallel)，我们建议坚持使用此方法。

  我们将在未来的版本中删除 `kapt.use.worker.api` 选项。

* 我们弃用了 `kotlin.experimental.coroutines` Gradle DSL 选项和 `gradle.properties` 中使用的 `kotlin.coroutines` 属性。直接使用“挂起函数”或在 `build.gradle(.kts)` 文件中[添加 `kotlinx.coroutines` 依赖项](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)即可。
  
  在 [协程指南](coroutines-guide.md) 中了解有关协程的更多信息。

### 删除了 kotlin.parallel.tasks.in.project 构建选项

在 Kotlin 1.5.20 中，我们宣布了[构建选项 `kotlin.parallel.tasks.in.project` 的弃用](whatsnew1520.md#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)。该选项已在 Kotlin 1.6.20 中被删除。

根据项目的不同，Kotlin 守护进程中的并行编译可能会需要更多内存。为了减少内存消耗，请[增加 Kotlin 守护进程的堆大小](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments)。

详细了解 Kotlin Gradle 插件中[当前支持的编译器选项](gradle-compiler-options.md)。