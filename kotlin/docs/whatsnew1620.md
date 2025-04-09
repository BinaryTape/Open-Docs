---
title: "Kotlin 1.6.20 中的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[发布时间：2022 年 4 月 4 日](releases#release-details)_

Kotlin 1.6.20 发布了未来语言特性的预览版，使层级结构成为多平台项目的默认结构，并为其他组件带来了渐进式的改进。

您还可以在此视频中找到更改的简短概述：

<video src="https://www.youtube.com/v/8F19ds109-o" title="What's new in Kotlin 1.6.20"/>

## 语言

在 Kotlin 1.6.20 中，您可以尝试两个新的语言特性：

* [Kotlin/JVM 的上下文接收者原型](#prototype-of-context-receivers-for-kotlin-jvm)
* [明确的非空类型](#definitely-non-nullable-types)

### Kotlin/JVM 的上下文接收者原型

:::note
此特性是一个仅适用于 Kotlin/JVM 的原型。启用 `-Xcontext-receivers` 后，编译器将生成无法在生产代码中使用的预发布二进制文件。
请仅在您的玩具项目中使用上下文接收者。欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供反馈。

使用 Kotlin 1.6.20，您不再局限于只有一个接收者。如果您需要更多，您可以通过将上下文接收者添加到函数、属性和类的声明中，使其成为上下文相关的（或 _contextual_）。上下文声明执行以下操作：

* 它要求所有声明的上下文接收者作为隐式接收者存在于调用者的作用域中。
* 它将声明的上下文接收者作为隐式接收者引入到其主体作用域中。

```kotlin
interface LoggingContext {
    val log: Logger // 此上下文提供对记录器的引用
}

context(LoggingContext)
fun startBusinessOperation() {
    // 您可以访问 log 属性，因为 LoggingContext 是一个隐式接收者
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // 您需要在作用域中将 LoggingContext 作为隐式接收者
        // 才能调用 startBusinessOperation()
        startBusinessOperation()
    }
}
```

要在您的项目中启用上下文接收者，请使用 `-Xcontext-receivers` 编译器选项。
您可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers#detailed-design) 中找到该特性及其语法的详细描述。

请注意，此实现是一个原型：

* 启用 `-Xcontext-receivers` 后，编译器将生成无法在生产代码中使用的预发布二进制文件
* 目前 IDE 对上下文接收者的支持非常有限

请在您的玩具项目中尝试此特性，并在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-42435) 中与我们分享您的想法和经验。
如果您遇到任何问题，请[提交一个新问题](https://kotl.in/issue)。

### 明确的非空类型

明确的非空类型处于 [Beta](components-stability) 阶段。它们几乎是稳定的，
但将来可能需要迁移步骤。
我们将尽最大努力减少您必须进行的任何更改。

为了在扩展泛型 Java 类和接口时提供更好的互操作性，Kotlin 1.6.20 允许您使用新的语法 `T & Any` 在使用点将泛型类型参数标记为明确的非空类型。
该语法形式来自 [交集类型](https://en.wikipedia.org/wiki/Intersection_type) 的表示法，现在仅限于 `&` 左侧具有可空上限的类型参数和右侧的非空 `Any`：

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

将语言版本设置为 `1.7` 以启用此特性：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.7"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.7'
        }
    }
}
```

</TabItem>
</Tabs>

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types) 中了解更多关于明确的非空类型的信息。

## Kotlin/JVM

Kotlin 1.6.20 引入了：

* JVM 接口中默认方法的兼容性改进：[接口的新 `@JvmDefaultWithCompatibility` 注解](#new-jvmdefaultwithcompatibility-annotation-for-interfaces) 和 [`-Xjvm-default` 模式中的兼容性更改](#compatibility-changes-in-the-xjvm-default-modes)
* [支持在 JVM 后端并行编译单个模块](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
* [支持对函数式接口构造函数的可调用引用](#support-for-callable-references-to-functional-interface-constructors)

### 接口的新 @JvmDefaultWithCompatibility 注解

Kotlin 1.6.20 引入了新的注解 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/)：将其与 `-Xjvm-default=all` 编译器选项一起使用，[以在 JVM 接口中创建默认方法](java-to-kotlin-interop#default-methods-in-interfaces)，用于任何 Kotlin 接口中的任何非抽象成员。

如果有客户端使用在没有 `-Xjvm-default=all` 选项的情况下编译的 Kotlin 接口，则它们可能与使用此选项编译的代码不兼容。
在 Kotlin 1.6.20 之前，为了避免此兼容性问题，[推荐的方法](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility) 是使用 `-Xjvm-default=all-compatibility` 模式，以及用于不需要此类兼容性的接口的 `@JvmDefaultWithoutCompatibility` 注解。

此方法有一些缺点：

* 您很容易忘记在添加新接口时添加注解。
* 通常，非公共部分的接口多于公共 API 中的接口，因此您最终会在代码的许多地方使用此注解。

现在，您可以使用 `-Xjvm-default=all` 模式，并使用 `@JvmDefaultWithCompatibility` 注解标记接口。
这允许您一次将此注解添加到公共 API 中的所有接口，并且您无需为新的非公共代码使用任何注解。

请在 [此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-48217) 中留下您对此新注解的反馈。

### -Xjvm-default 模式中的兼容性更改

Kotlin 1.6.20 添加了针对使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式编译的模块，以默认模式（`-Xjvm-default=disable` 编译器选项）编译模块的选项。
与之前一样，如果所有模块都具有 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式，则编译也将成功。
您可以在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-47000) 中留下您的反馈。

Kotlin 1.6.20 弃用了编译器选项 `-Xjvm-default` 的 `compatibility` 和 `enable` 模式。
其他模式的描述中存在关于兼容性的更改，但总体逻辑保持不变。
您可以查看 [更新的描述](java-to-kotlin-interop#compatibility-modes-for-default-methods)。

有关 Java 互操作中默认方法的更多信息，请参阅 [互操作性文档](java-to-kotlin-interop#default-methods-in-interfaces) 和
[此博文](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)。

### 支持在 JVM 后端并行编译单个模块

支持在 JVM 后端并行编译单个模块是 [实验性](components-stability) 的。
它可能随时被删除或更改。需要选择加入（请参阅下面的详细信息），您应该仅将其用于评估目的。
我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-46085) 中提供的反馈。

我们正在继续努力 [改进新的 JVM IR 后端编译时间](https://youtrack.jetbrains.com/issue/KT-46768)。
在 Kotlin 1.6.20 中，我们添加了实验性的 JVM IR 后端模式，以并行编译模块中的所有文件。
并行编译可以将总编译时间减少多达 15%。

使用 [编译器选项](compiler-reference#compiler-options) `-Xbackend-threads` 启用实验性并行后端模式。
为此选项使用以下参数：

* `N` 是您要使用的线程数。它不应大于您的 CPU 核心数；否则，由于线程之间的上下文切换，并行化将停止有效
* `0` 为每个 CPU 核心使用一个单独的线程

[Gradle](gradle) 可以并行运行任务，但当项目（或项目的主要部分）只是 Gradle 角度来看的一个大型任务时，这种类型的并行化帮助不大。
如果您有一个非常大的单体模块，请使用并行编译以更快地编译。
如果您的项目由许多小模块组成，并且具有由 Gradle 并行化的构建，则由于上下文切换，添加另一层并行化可能会损害性能。

并行编译有一些限制：
* 它不适用于 [kapt](kapt)，因为 kapt 禁用 IR 后端
* 根据设计，它需要更多的 JVM 堆。堆的数量与线程数成正比

:::

### 支持对函数式接口构造函数的可调用引用

:::note
支持对函数式接口构造函数的可调用引用是 [实验性](components-stability) 的。
它可能随时被删除或更改。需要选择加入（请参阅下面的详细信息），您应该仅将其用于评估目的。
我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47939) 中提供的反馈。

支持对函数式接口构造函数的 [可调用引用](reflection#callable-references) 增加了一种源兼容的方式，可以从具有构造函数函数的接口迁移到 [函数式接口](fun-interfaces)。

考虑以下代码：

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () `->` Unit): Printer = object : Printer { override fun print() = block() }
```

启用对函数式接口构造函数的可调用引用后，此代码可以仅用函数式接口声明替换：

```kotlin
fun interface Printer {
    fun print()
}
```

将隐式创建其构造函数，并且将编译使用 `::Printer` 函数引用的任何代码。例如：

```kotlin
documentsStorage.addPrinter(::Printer)
```

通过使用 `DeprecationLevel.HIDDEN` 的 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 注解标记旧函数 `Printer` 来保持二进制兼容性：

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```

使用编译器选项 `-XXLanguage:+KotlinFunInterfaceConstructorReference` 启用此特性。

## Kotlin/Native

Kotlin/Native 1.6.20 标志着其新组件的持续开发。我们已经朝着与其他平台上的 Kotlin 一致的体验迈出了另一步：

* [关于新内存管理器的更新](#an-update-on-the-new-memory-manager)
* [新内存管理器中扫描阶段的并发实现](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
* [注解类的实例化](#instantiation-of-annotation-classes)
* [与 Swift async/await 互操作：返回 Swift 的 Void 而不是 KotlinUnit](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [使用 libbacktrace 获得更好的堆栈跟踪](#better-stack-traces-with-libbacktrace)
* [支持独立的 Android 可执行文件](#support-for-standalone-android-executables)
* [性能改进](#performance-improvements)
* [改进了 cinterop 模块导入期间的错误处理](#improved-error-handling-during-cinterop-modules-import)
* [支持 Xcode 13 库](#support-for-xcode-13-libraries)

### 关于新内存管理器的更新

新的 Kotlin/Native 内存管理器处于 [Alpha](components-stability) 阶段。
将来可能会不兼容地更改，并且需要手动迁移。
我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中提供的反馈。

:::

使用 Kotlin 1.6.20，您可以尝试新 Kotlin/Native 内存管理器的 Alpha 版本。
它消除了 JVM 和 Native 平台之间的差异，以在多平台项目中提供一致的开发者体验。
例如，您将更容易创建在 Android 和 iOS 上都能工作的新跨平台移动应用程序。

新的 Kotlin/Native 内存管理器取消了对线程之间对象共享的限制。
它还提供了无泄漏的并发编程原语，这些原语是安全的，不需要任何特殊的管理或注解。

新的内存管理器将在未来的版本中成为默认设置，因此我们鼓励您立即尝试。
查看我们的 [博文](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/) 以了解有关新内存管理器的更多信息并探索演示项目，或者直接跳转到 [迁移说明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM) 以自行尝试。

尝试在您的项目中使用新的内存管理器，以查看其工作方式并在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享反馈。

### 新内存管理器中扫描阶段的并发实现

如果您已经切换到我们在 [Kotlin 1.6 中宣布](whatsnew16#preview-of-the-new-memory-manager) 的新内存管理器，您可能会注意到执行时间的巨大改进：我们的基准测试显示平均改进了 35%。
从 1.6.20 开始，新的内存管理器还提供扫描阶段的并发实现。
这也应该提高性能并减少垃圾收集器暂停的持续时间。

要为新的 Kotlin/Native 内存管理器启用此特性，请传递以下编译器选项：

```bash
-Xgc=cms 
```

请随时在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48526) 中分享您对新内存管理器性能的反馈。

### 注解类的实例化

在 Kotlin 1.6.0 中，注解类的实例化对于 Kotlin/JVM 和 Kotlin/JS 变为 [稳定](components-stability)。
1.6.20 版本提供了对 Kotlin/Native 的支持。

了解更多关于 [注解类的实例化](annotations#instantiation) 的信息。

### 与 Swift async/await 互操作：返回 Void 而不是 KotlinUnit

:::note
与 Swift async/await 的并发互操作是 [实验性](components-stability) 的。它可能随时被删除或更改。
您应该仅将其用于评估目的。我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 中提供的反馈。

我们一直在继续开发 [与 Swift 的 async/await 的实验性互操作](whatsnew1530#experimental-interoperability-with-swift-5-5-async-await)（自 Swift 5.5 起可用）。
Kotlin 1.6.20 与以前版本在处理具有 `Unit` 返回类型的 `suspend` 函数的方式上有所不同。

以前，此类函数在 Swift 中表示为返回 `KotlinUnit` 的 `async` 函数。但是，它们的正确返回类型是 `Void`，类似于非挂起函数。

为了避免破坏现有代码，我们引入了一个 Gradle 属性，该属性使编译器将返回 `Unit` 的挂起函数转换为具有 `Void` 返回类型的 `async` Swift：

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

我们计划在未来的 Kotlin 版本中将此行为设为默认行为。

### 使用 libbacktrace 获得更好的堆栈跟踪

使用 libbacktrace 解析源位置是 [实验性](components-stability) 的。它可能随时被删除或更改。
您应该仅将其用于评估目的。我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48424) 中提供的反馈。

Kotlin/Native 现在能够生成带有文件位置和行号的详细堆栈跟踪，
以便更好地调试 `linux*`（除了 `linuxMips32` 和 `linuxMipsel32`）和 `androidNative*` 目标。

此特性在底层使用 [libbacktrace](https://github.com/ianlancetaylor/libbacktrace) 库。
查看以下代码以查看差异示例：

```kotlin
fun main() = bar()
fun bar() = baz()
inline fun baz() {
    error("")
}
```

* **在 1.6.20 之前：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x227190       kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96
   at 1   example.kexe        0x221e4c       kfun:kotlin.Exception#<init>(kotlin.String?){} + 92
   at 2   example.kexe        0x221f4c       kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92
   at 3   example.kexe        0x22234c       kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92
   at 4   example.kexe        0x25d708       kfun:#bar(){} + 104
   at 5   example.kexe        0x25d68c       kfun:#main(){} + 12
```

* **使用 libbacktrace 的 1.6.20：**

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

在 Apple 目标上，堆栈跟踪中已经有文件位置和行号，libbacktrace 为内联函数调用提供了更多详细信息：

* **在 1.6.20 之前：**

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

* **使用 libbacktrace 的 1.6.20：**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10669bc88    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x106696bd6    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x106696cc6    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x106697016    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)  
:::caution
at 5   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe    0x106689d35    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe    0x106689cac    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```

要生成带有 libbacktrace 的更好堆栈跟踪，请将以下行添加到 `gradle.properties`：

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

请在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48424) 中告诉我们使用 libbacktrace 调试 Kotlin/Native 的效果。

### 支持独立的 Android 可执行文件

以前，Kotlin/Native 中的 Android Native 可执行文件实际上不是可执行文件，而是您可以作为 NativeActivity 使用的共享库。现在可以选择为 Android Native 目标生成标准可执行文件。

为此，在项目的 `build.gradle(.kts)` 部分中，配置 `androidNative` 目标的 executable 块。
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
如果要保留当前行为，请使用以下设置：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

感谢 Mattia Iavarone 的 [实现](https://github.com/jetbrains/kotlin/pull/4624)！

### 性能改进

我们正在努力改进 Kotlin/Native，以 [加快编译过程](https://youtrack.jetbrains.com/issue/KT-42294) 并改善您的开发体验。

Kotlin 1.6.20 带来了一些性能更新和错误修复，这些更新和修复会影响 Kotlin 生成的 LLVM IR。
根据我们内部项目的基准测试，我们平均实现了以下性能提升：

* 执行时间减少 15%
* 发布和调试二进制文件的代码大小减少 20%
* 发布二进制文件的编译时间减少 26%

这些更改还使大型内部项目上的调试二进制文件的编译时间减少了 10%。

为了实现这一点，我们为某些编译器生成的合成对象实现了静态初始化，改进了我们为每个函数构建 LLVM IR 的方式，并优化了编译器缓存。

### 改进了 cinterop 模块导入期间的错误处理

此版本引入了改进的错误处理，用于在使用 `cinterop` 工具导入 Objective-C 模块的情况（这对于 CocoaPods pod 来说很典型）。
以前，如果您在尝试使用 Objective-C 模块时遇到错误（例如，在处理头文件中的编译错误时），您会收到一条内容不丰富的错误消息，例如 `fatal error: could not build module $name`。
我们扩展了 `cinterop` 工具的这一部分，因此您将收到一条带有扩展描述的错误消息。

### 支持 Xcode 13 库

从该版本开始，Xcode 13 提供的库已获得完全支持。
您可以从 Kotlin 代码中的任何位置访问它们。

## Kotlin Multiplatform

1.6.20 为 Kotlin Multiplatform 带来了以下值得注意的更新：

* [层级结构支持现在是所有新多平台项目的默认设置](#hierarchical-structure-support-for-multiplatform-projects)
* [Kotlin CocoaPods Gradle 插件收到了用于 CocoaPods 集成的几个有用特性](#kotlin-cocoapods-gradle-plugin)

### 多平台项目的层级结构支持

Kotlin 1.6.20 默认启用了层级结构支持。
自从 [在 Kotlin 1.4.0 中引入它](whatsnew14#sharing-code-in-several-targets-with-the-hierarchical-project-structure) 以来，我们已经显著改进了前端并使 IDE 导入稳定。

以前，有两种方法可以在多平台项目中添加代码。第一种是将其插入特定于平台的源集，该源集仅限于一个目标，并且不能被其他平台重用。
第二种是使用在 Kotlin 当前支持的所有平台之间共享的公共源集。

现在，您可以在 [多个类似的 Native 目标之间共享源代码](#better-code-sharing-in-your-project)，这些目标重用了许多公共逻辑和第三方 API。
该技术将提供正确的默认依赖项，并找到共享代码中可用的确切 API。
这消除了复杂的构建设置，并且必须使用解决方法来获得 IDE 对在 Native 目标之间共享源集的支持。
它还有助于防止用于不同目标的不安全 API 用法。

该技术对于 [库作者](#more-opportunities-for-library-authors) 也将派上用场，因为层级项目结构允许他们发布和使用具有目标子集的公共 API 的库。

默认情况下，使用层级项目结构发布的库仅与层级结构项目兼容。

#### 在您的项目中更好地共享代码

如果没有层级结构支持，则没有直接的方法可以在 _某些_ 而不是 _所有_ [Kotlin 目标](multiplatform-dsl-reference#targets) 之间共享代码。
一个流行的例子是在所有 iOS 目标之间共享代码，并访问 iOS 特定的 [依赖项](multiplatform-share-on-platforms#connect-platform-specific-libraries)，例如 Foundation。

由于有层级项目结构支持，您现在可以开箱即用地实现此目的。
在新的结构中，源集形成一个层次结构。
您可以使用特定于平台的语言特性和每个给定源集编译到的目标可用的依赖项。

例如，考虑一个具有两个目标的典型多平台项目 - 用于 iOS 设备和模拟器的 `iosArm64` 和 `iosX64`。
Kotlin 工具链了解这两个目标具有相同的功能，并允许您从中间源集 `iosMain` 访问该功能。

<img src="/img/ios-hierarchy-example.jpg" alt="iOS 层次结构示例" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin 工具链提供了正确的默认依赖项，例如 Kotlin/Native stdlib 或 Native 库。
此外，Kotlin 工具链将尽最大努力找到共享代码中可用的确切 API 表面区域。
这样可以防止诸如在为 Windows 共享的代码中使用 macOS 特定的函数之类的情况。

#### 库作者的更多机会

发布多平台库时，其中间源集的 API 现在也随之正确发布，使其可供消费者使用。
同样，Kotlin 工具链将自动找出消费者源集中可用的 API，同时仔细注意不安全用法，例如在 JS 代码中使用用于 JVM 的 API。
了解更多关于 [在库中共享代码](multiplatform-share-on-platforms#share-code-in-libraries) 的信息。

#### 配置和设置

从 Kotlin 1.6.20 开始，所有新的多平台项目都将具有层级项目结构。无需额外设置。

* 如果您已经 [手动打开了它](multiplatform-share-on-platforms#share-code-on-similar-platforms)，您可以从 `gradle.properties` 中删除已弃用的选项：

  ```none
  # gradle.properties
  kotlin.mpp.enableGranularSourceSetsMetadata=true
  kotlin.native.enableDependencyPropagation=false // 或 'true'，取决于您之前的设置
  ```

* 对于 Kotlin 1.6.20，我们建议使用 [Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 或更高版本以获得最佳体验。

* 您也可以选择退出。要禁用层级结构支持，请在 `gradle.properties` 中设置以下选项：

  ```none
  # gradle.properties
  kotlin.mpp.hierarchicalStructureSupport=false
  ```

#### 留下您的反馈

这是对整个生态系统的重大改变。我们感谢您的反馈，以帮助使其变得更好。

立即尝试，并将您遇到的任何困难报告给 [我们的问题跟踪器](https://kotl.in/issue)。

### Kotlin CocoaPods Gradle 插件

为了简化 CocoaPods 集成，Kotlin 1.6.20 提供了以下特性：

* CocoaPods 插件现在具有构建具有所有已注册目标的 XCFrameworks 并生成 Podspec 文件的任务。当您不想直接与 Xcode 集成，但想要构建工件并将其部署到本地 CocoaPods 存储库时，这可能很有用。
  
  了解更多关于 [构建 XCFrameworks](multiplatform-build-native-binaries#build-xcframeworks) 的信息。

* 如果您在项目中使用了 [CocoaPods 集成](native-cocoapods)，那么您已经习惯于为整个 Gradle 项目指定所需的 Pod 版本。现在您有更多选择：
  * 直接在 `cocoapods` 块中指定 Pod 版本
  * 继续使用 Gradle 项目版本
  
  如果未配置这些属性，您将收到错误。

* 您