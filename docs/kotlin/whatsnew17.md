---
title: "Kotlin 1.7.0 中的新特性"
---
:::info
<p>
   Kotlin 1.7.0 的 IDE 支持适用于 IntelliJ IDEA 2021.2、2021.3 和 2022.1。
</p>
:::

_[发布时间：2022 年 6 月 9 日](releases#release-details)_

Kotlin 1.7.0 已经发布。它揭开了新的 Kotlin/JVM K2 编译器的 Alpha 版本，稳定了语言特性，并为 JVM、JS 和 Native 平台带来了性能改进。

以下是此版本中的主要更新列表：

* [新的 Kotlin K2 编译器现在是 Alpha 版本](#new-kotlin-k2-compiler-for-the-jvm-in-alpha)，它提供了显著的性能改进。它仅适用于 JVM，并且包括 kapt 在内的所有编译器插件都无法使用它。
* [Gradle 中增量编译的新方法](#a-new-approach-to-incremental-compilation)。现在，增量编译也支持在依赖的非 Kotlin 模块内部进行的更改，并且与 Gradle 兼容。
* 我们已经稳定了[选择加入要求注解](#stable-opt-in-requirements)，[明确的非空类型](#stable-definitely-non-nullable-types)和[构建器推断](#stable-builder-inference)。
* [现在有一个用于类型参数的下划线运算符](#underscore-operator-for-type-arguments)。当指定其他类型时，你可以使用它来自动推断参数的类型。
* [此版本允许通过委托来实现内联类的内联值](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)。现在，你可以创建轻量级包装器，这些包装器在大多数情况下不分配内存。

你还可以在此视频中找到更改的简短概述：

<video src="https://www.youtube.com/v/54WEfLKtCGk" title="What's new in Kotlin 1.7.0"/>

## 用于 JVM 的新 Kotlin K2 编译器（Alpha 版）

此 Kotlin 版本引入了新的 Kotlin K2 编译器的 **Alpha** 版本。新编译器旨在加速新语言功能的开发，统一 Kotlin 支持的所有平台，带来性能改进，并为编译器扩展提供 API。

我们已经发布了一些关于新编译器及其优点的详细解释：

* [通往新的 Kotlin 编译器的道路](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 编译器：自顶向下视角](https://www.youtube.com/watch?v=db19VFLZqJM)

重要的是要指出，对于新的 K2 编译器的 Alpha 版本，我们主要关注性能改进，它仅适用于 JVM 项目。它不支持 Kotlin/JS、Kotlin/Native 或其他多平台项目，并且包括 [kapt](kapt) 在内的所有编译器插件都无法使用它。

我们的基准测试在我们的内部项目上显示了一些出色的结果：

| 项目          | 当前 Kotlin 编译器性能 | 新的 K2 Kotlin 编译器性能 | 性能提升 |
|---------------|-----------------------|---------------------------|----------|
| Kotlin        | 2.2 KLOC/s            | 4.8 KLOC/s                | ~ x2.2   |
| YouTrack      | 1.8 KLOC/s            | 4.2 KLOC/s                | ~ x2.3   |
| IntelliJ IDEA | 1.8 KLOC/s            | 3.9 KLOC/s                | ~ x2.2   |
| Space         | 1.2 KLOC/s            | 2.8 KLOC/s                | ~ x2.3   |
:::note
KLOC/s 性能数字代表编译器每秒处理的数千行代码数。

你可以在 JVM 项目上查看性能提升，并将其与旧编译器的结果进行比较。要启用 Kotlin K2 编译器，请使用以下编译器选项：

```bash
-Xuse-k2
```

此外，K2 编译器[包含许多错误修复](https://youtrack.jetbrains.com/issues/KT?q=tag:%20FIR-preview-qa%20%23Resolved)。请注意，即使此列表中的问题状态为“**State: Open**”，实际上也在 K2 中修复了。

下一个 Kotlin 版本将提高 K2 编译器的稳定性并提供更多功能，敬请关注！

如果你在使用 Kotlin K2 编译器时遇到任何性能问题，请[向我们的问题跟踪器报告](https://kotl.in/issue)。

## 语言

Kotlin 1.7.0 引入了对委托实现的委托支持以及用于类型参数的新下划线运算符。它还稳定了在先前版本中作为预览引入的几种语言特性：

* [通过委托来实现内联类的内联值](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)
* [类型参数的下划线运算符](#underscore-operator-for-type-arguments)
* [稳定的构建器推断](#stable-builder-inference)
* [稳定的选择加入要求](#stable-opt-in-requirements)
* [稳定的明确非空类型](#stable-definitely-non-nullable-types)

### 允许通过委托来实现内联类的内联值

如果你想为值或类实例创建一个轻量级包装器，则必须手动实现所有接口方法。委托实现解决了这个问题，但在 1.7.0 之前，它不适用于内联类。此限制已删除，因此你现在可以创建在大多数情况下不分配内存的轻量级包装器。

```kotlin
interface Bar {
    fun foo() = "foo"
}

@JvmInline
value class BarWrapper(val bar: Bar): Bar by bar

fun main() {
    val bw = BarWrapper(object: Bar {})
    println(bw.foo())
}
```

### 类型参数的下划线运算符

Kotlin 1.7.0 引入了类型参数的下划线运算符 `_`。当指定其他类型时，你可以使用它来自动推断类型参数：

```kotlin
abstract class SomeClass<T> {
    abstract fun execute(): T
}

class SomeImplementation : SomeClass<String>() {
    override fun execute(): String = "Test"
}

class OtherImplementation : SomeClass<Int>() {
    override fun execute(): Int = 42
}

object Runner {
    inline fun <reified S: SomeClass<T>, T> run(): T {
        return S::class.java.getDeclaredConstructor().newInstance().execute()
    }
}

fun main() {
    // T 被推断为 String，因为 SomeImplementation 派生自 SomeClass<String>
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T 被推断为 Int，因为 OtherImplementation 派生自 SomeClass<Int>
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```

你可以在变量列表中的任何位置使用下划线运算符来推断类型参数。

:::

### 稳定的构建器推断

构建器推断是一种特殊的类型推断，在调用泛型构建器函数时非常有用。它有助于编译器使用 lambda 参数内部其他调用的类型信息来推断调用的类型参数。

从 1.7.0 开始，如果常规类型推断无法获得足够的信息来了解某个类型，则会自动激活构建器推断，而无需指定在 [1.6.0 中引入的](whatsnew16#changes-to-builder-inference)`-Xenable-builder-inference` 编译器选项。

[了解如何编写自定义泛型构建器](using-builders-with-builder-inference)。

### 稳定的选择加入要求

[选择加入要求](opt-in-requirements) 现在是 [稳定的](components-stability)，不需要额外的编译器配置。

在 1.7.0 之前，选择加入功能本身需要参数 `-opt-in=kotlin.RequiresOptIn` 以避免警告。它不再需要这个；但是，你仍然可以使用编译器参数 `-opt-in` 来选择加入其他注解，[一个模块](opt-in-requirements#opt-in-a-module)。

### 稳定的明确非空类型

在 Kotlin 1.7.0 中，明确的非空类型已提升为 [稳定](components-stability)。在扩展泛型 Java 类和接口时，它们提供了更好的互操作性。

你可以使用新语法 `T & Any` 在使用位置将泛型类型参数标记为明确的非空类型。该语法形式来自 [交叉类型](https://en.wikipedia.org/wiki/Intersection_type) 的表示法，现在仅限于 `&` 左侧具有可空上限的类型参数，以及右侧的非空 `Any`：

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

在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types) 中了解有关明确的非空类型的更多信息。

## Kotlin/JVM

此版本为 Kotlin/JVM 编译器带来了性能改进和一个新的编译器选项。此外，函数式接口构造函数的可调用引用已变得稳定。请注意，自 1.7.0 起，Kotlin/JVM 编译的默认目标版本为 `1.8`。

* [编译器性能优化](#compiler-performance-optimizations)
* [新的编译器选项 `-Xjdk-release`](#new-compiler-option-xjdk-release)
* [函数式接口构造函数的稳定可调用引用](#stable-callable-references-to-functional-interface-constructors)
* [删除了 JVM 目标版本 1.6](#removed-jvm-target-version-1-6)

### 编译器性能优化

Kotlin 1.7.0 引入了 Kotlin/JVM 编译器的性能改进。根据我们的基准测试，与 Kotlin 1.6.0 相比，编译时间[平均减少了 10%](https://youtrack.jetbrains.com/issue/KT-48233/Switching-to-JVM-IR-backend-increases-compilation-time-by-more-t#focus=Comments-27-6114542.0-0)。大量使用内联函数的项目，例如[使用 `kotlinx.html` 的项目](https://youtrack.jetbrains.com/issue/KT-51416/Compilation-of-kotlinx-html-DSL-should-still-be-faster)，由于字节码后处理的改进，编译速度将更快。

### 新的编译器选项：-Xjdk-release

Kotlin 1.7.0 提供了一个新的编译器选项 `-Xjdk-release`。此选项类似于 [javac 的命令行 `--release` 选项](http://openjdk.java.net/jeps/247)。`-Xjdk-release` 选项控制目标字节码版本，并将类路径中 JDK 的 API 限制为指定的 Java 版本。例如，`kotlinc -Xjdk-release=1.8` 不允许引用 `java.lang.Module`，即使依赖项中的 JDK 是 9 或更高版本。

:::note
不能 [保证](https://youtrack.jetbrains.com/issue/KT-29974) 此选项对每个 JDK 发行版都有效。

:::

请在 [此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-29974/Add-a-compiler-option-Xjdk-release-similar-to-javac-s-release-to) 上留下你的反馈。

### 函数式接口构造函数的稳定可调用引用

函数式接口构造函数的[可调用引用](reflection#callable-references)现在是 [稳定的](components-stability)。了解如何使用可调用引用[从具有构造函数函数的接口迁移到函数式接口](fun-interfaces#migration-from-an-interface-with-constructor-function-to-a-functional-interface)。

请在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中报告你发现的任何问题。

### 删除了 JVM 目标版本 1.6

Kotlin/JVM 编译的默认目标版本为 `1.8`。已删除 `1.6` 目标。

请迁移到 JVM 目标 1.8 或更高版本。了解如何更新 JVM 目标版本：

* [Gradle](gradle-compiler-options#attributes-specific-to-jvm)
* [Maven](maven#attributes-specific-to-jvm)
* [命令行编译器](compiler-reference#jvm-target-version)

## Kotlin/Native

Kotlin 1.7.0 包括对 Objective-C 和 Swift 互操作性的更改，并稳定了在先前版本中引入的功能。它还为新的内存管理器带来了性能改进以及其他更新：

* [新的内存管理器的性能改进](#performance-improvements-for-the-new-memory-manager)
* [与 JVM 和 JS IR 后端统一的编译器插件 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [支持独立的 Android 可执行文件](#support-for-standalone-android-executables)
* [与 Swift async/await 互操作：返回 `Void` 而不是 `KotlinUnit`](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [禁止通过 Objective-C 桥接传递未声明的异常](#prohibited-undeclared-exceptions-through-objective-c-bridges)
* [改进的 CocoaPods 集成](#improved-cocoapods-integration)
* [覆盖 Kotlin/Native 编译器下载 URL](#overriding-the-kotlin-native-compiler-download-url)

### 新的内存管理器的性能改进

:::note
新的 Kotlin/Native 内存管理器处于 [Alpha](components-stability) 阶段。它可能会发生不兼容的更改，并且将来需要手动迁移。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中提供的反馈。

:::

新的内存管理器仍处于 Alpha 阶段，但它正在朝着 [稳定](components-stability) 阶段迈进。此版本为新的内存管理器提供了显著的性能改进，尤其是在垃圾回收（GC）方面。特别是，默认情况下现在启用在 [1.6.20 中引入的](whatsnew1620) 清扫阶段的并发实现。这有助于减少应用程序因 GC 而暂停的时间。新的 GC 调度程序更擅长选择 GC 频率，尤其是在较大的堆上。

此外，我们还专门优化了调试二进制文件，确保在内存管理器的实现代码中使用适当的优化级别和链接时优化。这帮助我们在基准测试中将调试二进制文件的执行时间大致提高了 30%。

尝试在你的项目中使用新的内存管理器，看看它的工作方式，并在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中与我们分享你的反馈。

### 与 JVM 和 JS IR 后端统一的编译器插件 ABI

从 Kotlin 1.7.0 开始，Kotlin Multiplatform Gradle 插件默认使用 Kotlin/Native 的可嵌入编译器 jar。此 [功能在 1.6.0 中宣布](whatsnew16#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends) 为 Experimental，现在它已稳定并可以使用。

此改进对库作者非常有用，因为它改善了编译器插件的开发体验。在此版本之前，你必须为 Kotlin/Native 提供单独的工件，但现在你可以为 Native 和其他受支持的平台使用相同的编译器插件工件。

:::note
此功能可能需要插件开发人员为其现有插件采取迁移步骤。

了解如何在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48595) 中准备你的插件以进行更新。

### 支持独立的 Android 可执行文件

Kotlin 1.7.0 提供对为 Android Native 目标生成标准可执行文件的完整支持。它在 [1.6.20 中引入](whatsnew1620#support-for-standalone-android-executables)，现在默认启用。

如果要回滚到 Kotlin/Native 生成共享库的先前行为，请使用以下设置：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

### 与 Swift async/await 互操作：返回 Void 而不是 KotlinUnit

Kotlin `suspend` 函数现在在 Swift 中返回 `Void` 类型而不是 `KotlinUnit`。这是改进的与 Swift 的 `async`/`await` 互操作的结果。此功能在 [1.6.20 中引入](whatsnew1620#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)，此版本默认启用此行为。

你不再需要使用 `kotlin.native.binary.unitSuspendFunctionObjCExport=proper` 属性来为此类函数返回正确的类型。

### 禁止通过 Objective-C 桥接传递未声明的异常

当你从 Swift/Objective-C 代码（或反之亦然）调用 Kotlin 代码并且此代码引发异常时，除非你专门允许使用适当的转换在语言之间转发异常（例如，使用 `@Throws` 注解），否则应由发生异常的代码处理该异常。

以前，Kotlin 还有另一种意外行为，其中未声明的异常有时会从一种语言“泄漏”到另一种语言。Kotlin 1.7.0 修复了该问题，现在此类情况会导致程序终止。

因此，例如，如果你在 Kotlin 中有一个 `{ throw Exception() }` lambda 表达式并从 Swift 调用它，则在 Kotlin 1.7.0 中，一旦异常到达 Swift 代码，它将终止。在以前的 Kotlin 版本中，此类异常可能会泄漏到 Swift 代码。

`@Throws` 注解继续像以前一样工作。

### 改进的 CocoaPods 集成

从 Kotlin 1.7.0 开始，如果你想在你的项目中集成 CocoaPods，你不再需要安装 `cocoapods-generate` 插件。

以前，你需要安装 CocoaPods 依赖项管理器和 `cocoapods-generate` 插件才能使用 CocoaPods，例如，在 Kotlin Multiplatform Mobile 项目中处理 [iOS 依赖项](multiplatform-ios-dependencies#with-cocoapods)。

现在，设置 CocoaPods 集成更容易了，并且我们解决了 `cocoapods-generate` 无法安装在 Ruby 3 及更高版本上的问题。现在还支持在 Apple M1 上运行得更好的最新 Ruby 版本。

请参阅如何设置 [初始 CocoaPods 集成](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)。

### 覆盖 Kotlin/Native 编译器下载 URL

从 Kotlin 1.7.0 开始，你可以自定义 Kotlin/Native 编译器的下载 URL。当 CI 上的外部链接被禁止时，这很有用。

要覆盖默认基本 URL `https://download.jetbrains.com/kotlin/native/builds`，请使用以下 Gradle 属性：

```none
kotlin.native.distribution.baseDownloadUrl=https://example.com
```

下载器会将本机版本和目标操作系统附加到此基本 URL，以确保它下载实际的编译器分发版。

:::

## Kotlin/JS

Kotlin/JS 正在接收对 [JS IR 编译器后端](js-ir-compiler) 的进一步改进以及其他更新，这些更新可以使你的开发体验更好：

* [新的 IR 后端的性能改进](#performance-improvements-for-the-new-ir-backend)
* [使用 IR 时，缩小成员名称](#minification-for-member-names-when-using-ir)
* [通过 IR 后端中的 polyfill 支持旧版浏览器](#support-for-older-browsers-via-polyfills-in-the-ir-backend)
* [从 js 表达式动态加载 JavaScript 模块](#dynamically-load-javascript-modules-from-js-expressions)
* [为 JavaScript 测试运行器指定环境变量](#specify-environment-variables-for-javascript-test-runners)

### 新的 IR 后端的性能改进

此版本有一些重大更新，应该可以改善你的开发体验：

* Kotlin/JS 的增量编译性能已得到显著提高。构建 JS 项目所需的时间更少。在许多情况下，增量重建现在应该与旧版后端大致相同。
* Kotlin/JS 最终捆绑包所需的空间更少，因为我们已大大减小了最终工件的大小。对于某些大型项目，我们已测量到生产捆绑包大小与旧版后端相比减少了 20%。
* 接口的类型检查已提高了几个数量级。
* Kotlin 生成更高质量的 JS 代码

### 使用 IR 时，缩小成员名称

Kotlin/JS IR 编译器现在使用其内部信息来了解 Kotlin 类和函数的关系，以应用更有效的缩小，从而缩短函数、属性和类的名称。这会缩小生成的捆绑应用程序。

当你在生产模式下构建 Kotlin/JS 应用程序时，会自动应用此类型的缩小，并且默认情况下已启用。要禁用成员名称缩小，请使用 `-Xir-minimized-member-names` 编译器标志：

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xir-minimized-member-names=false")
        }
    }
}
```

### 通过 IR 后端中的 polyfill 支持旧版浏览器

Kotlin/JS 的 IR 编译器后端现在包含与旧版后端相同的 polyfill。这允许使用新编译器编译的代码在不支持 Kotlin 标准库使用的 ES2015 中所有方法的旧版浏览器中运行。只有项目实际使用的那些 polyfill 才会包含在最终捆绑包中，这可以最大限度地减少它们对捆绑包大小的潜在影响。

使用 IR 编译器时，默认情况下启用此功能，你无需对其进行配置。

### 从 js 表达式动态加载 JavaScript 模块

在使用 JavaScript 模块时，大多数应用程序都使用静态导入，其用法已在 [JavaScript 模块集成](js-modules) 中涵盖。但是，Kotlin/JS 缺少一种在应用程序中运行时动态加载 JavaScript 模块的机制。

从 Kotlin 1.7.0 开始，JavaScript 中的 `import` 语句在 `js` 块中受支持，允许你在运行时将包动态引入到应用程序中：

```kotlin
val myPackage = js("import('my-package')")
```

### 为 JavaScript 测试运行器指定环境变量

要调整 Node.js 包解析或将外部信息传递给 Node.js 测试，你现在可以指定 JavaScript 测试运行器使用的环境变量。要定义环境变量，请在构建脚本中的 `testTask` 块中使用带有键值对的 `environment()` 函数：

```kotlin
kotlin {
    js {
        nodejs {
            testTask {
                environment("key", "value")
            }
        }
    }
}
```

## 标准库

在 Kotlin 1.7.0 中，标准库进行了一系列的更改和改进。它们引入了新功能，稳定了实验性功能，并统一了对 Native、JS 和 JVM 的命名捕获组的支持：

* [min() 和 max() 集合函数作为非空值返回](#min-and-max-collection-functions-return-as-non-nullable)
* [在特定索引处进行正则表达式匹配](#regular-expression-matching-at-specific-indices)
* [扩展了对先前语言和 API 版本的支持](#extended-support-for-previous-language-and-api-versions)
* [通过反射访问注解](#access-to-annotations-via-reflection)
* [稳定的深度递归函数](#stable-deep-recursive-functions)
* [基于默认时间源的内联类的时间标记](#time-marks-based-on-inline-classes-for-default-time-source)
* [适用于 Java Optionals 的新实验性扩展函数](#new-experimental-extension-functions-for-java-optionals)
* [支持 JS 和 Native 中的命名捕获组](#support-for-named-capturing-groups-in-js-and-native)

### min() 和 max() 集合函数作为非空值返回

在 [Kotlin 1.4.0](whatsnew14) 中，我们将 `min()` 和 `max()` 集合函数重命名为 `minOrNull()` 和 `maxOrNull()`。这些新名称更好地反映了它们的行为——如果接收器集合为空，则返回 null。它还有助于使函数的行为与 Kotlin 集合 API 中使用的命名约定保持一致。

`minBy()`、`maxBy()`、`minWith()` 和 `maxWith()` 也是如此，它们都在 Kotlin 1.4.0 中获得了它们的 *OrNull() 同义词。受此更改影响的较旧函数已逐渐弃用。

Kotlin 1.7.0 重新引入了原始函数名称，但具有非空返回类型。新的 `min()`、`max()`、`minBy()`、`maxBy()`、`minWith()` 和 `maxWith()` 函数现在严格返回集合元素或引发异常。

```kotlin
fun main() {
    val numbers = listOf<Int>()
    println(numbers.maxOrNull()) // "null"
    println(numbers.max()) // "Exception in... Collection is empty."
}
```

### 在特定索引处进行正则表达式匹配

在 [1.5.30 中引入的](whatsnew1530#matching-with-regex-at-a-particular-position)`Regex.matchAt()` 和 `Regex.matchesAt()` 函数现在是稳定的。它们提供了一种检查正则表达式是否在 `String` 或 `CharSequence` 中的特定位置具有完全匹配的方法。

`matchesAt()` 检查是否存在匹配项并返回布尔结果：

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    // regular expression: one digit, dot, one digit, dot, one or more digits
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
}
```

`matchAt()` 返回找到的匹配项，如果未找到匹配项，则返回 `null`：

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.7.0"
}
```

我们将感谢你对此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-34021) 的反馈。

### 扩展了对先前语言和 API 版本的支持

为了支持库作者开发旨在在各种先前 Kotlin 版本中使用的库，并解决主要 Kotlin 版本的发布频率增加的问题，我们扩展了对先前语言和 API 版本的支持。

使用 Kotlin 1.7.0，我们支持三个先前语言和 API 版本，而不是两个。这意味着 Kotlin 1.7.0 支持开发以 Kotlin 版本 1.4.0 为目标的库。有关向后兼容性的更多信息，请参阅 [兼容模式](compatibility-modes)。

### 通过反射访问注解

[`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 扩展函数，该函数首次在 [1.6.0 中引入](whatsnew16#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)，现在是 [稳定的](components-stability)。此 [反射](reflection) 函数返回元素上给定类型的所有注解，包括单独应用的注解和重复的注解。

```kotlin
@Repeatable
annotation class Tag(val name: String)

@Tag("First Tag")
@Tag("Second Tag")
fun taggedFunction() {
    println("I'm a tagged function!")
}

fun main() {
    val x = ::taggedFunction
    val foo = x as KAnnotatedElement
    println(foo.findAnnotations<Tag>()) // [@Tag(name=First Tag), @Tag(name=Second Tag)]
}
```

### 稳定的深度递归函数

自 [Kotlin 1.4.0](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/#Defining_deep_recursive_functions_using_coroutines) 以来，深度递归函数已作为实验性功能提供，并且它们现在在 Kotlin 1.7.0 中是 [稳定的](components-stability)。使用 `DeepRecursiveFunction`，你可以定义一个将其堆栈保留在堆上而不是使用实际调用堆栈的函数。这允许你运行非常深的递归计算。要调用深度递归函数，请 `invoke` 它。

在此示例中，深度递归函数用于递归计算二叉树的深度。即使此示例函数递归调用自身 100,000 次，也不会引发 `StackOverflowError`：

```kotlin
class Tree(val left: Tree?, val right: Tree?)

val calculateDepth = DeepRecursiveFunction<Tree?, Int> { t `->`
    if (t == null) 0 else maxOf(
        callRecursive(t.left),
        callRecursive(t.right)
    ) + 1
}

fun main() {
    // Generate a tree with a depth of 100_000
    val deepTree = generateSequence(Tree(null, null)) { prev `->`
        Tree(prev, null)
    }.take(100_000).last()

    println(calculateDepth(deepTree)) // 100000
}
```

考虑在代码中使用深度递归函数，其中递归深度超过 1000 次调用。

### 基于默认时间源的内联类的时间标记

Kotlin 1.7.0 通过将 `TimeSource.Monotonic` 返回的时间标记更改为内联值类来提高时间测量功能的性能。这意味着调用诸如 `markNow()`、`elapsedNow()`、`measureTime()` 和 `measureTimedValue()` 之类的函数不会为其 `TimeMark` 实例分配包装器类。特别是，当测量作为热路径一部分的代码时，这可以帮助最大限度地减少测量对性能的影响：

```kotlin
@OptIn(ExperimentalTime::class)
fun main() {
    val mark = TimeSource.Monotonic.markNow() // Returned `TimeMark` is inline class
    val elapsedDuration = mark.elapsedNow()
}
```

:::note
仅当静态知道从中获取 `TimeMark` 的时间源是 `TimeSource.Monotonic` 时，此优化才可用。

:::

### 适用于 Java Optionals 的新实验性扩展函数

Kotlin 1.7.0 附带了新的便捷函数，可简化在 Java 中使用 `Optional` 类。这些新函数可用于解包和转换 JVM 上的可选对象，并有助于使使用 Java API 更加简洁。

如果 `Optional` 存在，`getOrNull()`、`getOrDefault()` 和 `getOrElse()` 扩展函数允许你获取它的值。否则，你将分别获得 `null`、默认值或函数返回的值：

```kotlin
val presentOptional = Optional.of("I'm here!")

println(presentOptional.getOrNull())
// "I'm here!"

val absentOptional = Optional.empty<String>()

println(absentOptional.getOrNull())
// null
println(absentOptional.getOrDefault("Nobody here!"))
// "Nobody here!"
println(absentOptional.getOrElse {
    println("Optional was absent!")
    "Default value!"
})
// "Optional was absent!"
// "Default value!"
```

`toList()`、`toSet()` 和 `asSequence()` 扩展函数将存在的 `Optional` 的值转换为列表、集或序列，否则返回空集合。`toCollection()` 扩展函数将 `Optional` 值附加到已存在的目的地集合：

```kotlin
val presentOptional = Optional.of("I'm here!")
val absentOptional = Optional.empty<String>()
println(presentOptional.toList() + "," + absentOptional.toList())
// ["I'm here!"], []
println(presentOptional.toSet() + "," + absentOptional.toSet())
// ["I'm here!"], []
val myCollection = mutableListOf<String>()
absentOptional.toCollection(myCollection)
println(myCollection)
// []
presentOptional.toCollection(myCollection)
println(myCollection)
// ["I'm here!"]
val list = listOf(presentOptional, absentOptional).flatMap { it.asSequence() }
println(list)
// ["I'm here!"]
```

这些扩展函数在 Kotlin 1.7.0 中作为 Experimental 引入。你可以在 [此 KEEP](https://github.com/Kotlin/KEEP/pull/291) 中了解有关 `Optional` 扩展的更多信息。与往常一样，我们欢迎你在 [Kotlin 问题跟踪器](https://kotl.in/issue) 中提供反馈。

### 支持 JS 和 Native 中的命名捕获组

从 Kotlin 1.7.0 开始，命名捕获组不仅在 JVM 上受支持，而且在 JS 和 Native 平台上也受支持。

要为捕获组命名，请在正则表达式中使用 (`?<name>group`) 语法。要获取组匹配的文本，请调用新引入的 [`MatchGroupCollection.get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/get.html) 函数并传递组名称。

#### 按名称检索匹配的组值

考虑以下用于匹配城市坐标的示例。要获取正则表达式匹配的组的集合，请使用 [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html)。比较使用 `value` 按其编号（索引）和按其名称检索组的内容：

```kotlin
fun main() {
    val regex = "\\b(?<city>[A-Za-z\\s]+),\\s(?<state>[A-Z]{2}):\\s(?<areaCode>[0-9]{3})\\b".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    val match = regex.find(input)!!
    println(match.groups["city"]?.value) // "Austin" — 按名称
    println(match.groups[2]?.value) // "TX" — 按编号
}
```

#### 命名的反向引用

现在，你还可以在反向引用组时使用组名称。反向引用匹配先前由捕获组匹配的相同文本。为此，请在正则表达式中使用 `\k<name>` 语法：

```kotlin
fun backRef() {
    val regex = "(?<title>\\w+), yes \\k<title>".toRegex()
    val match = regex.find("Do you copy? Sir, yes Sir!")!!
    println(match.value) // "Sir, yes Sir"
    println(match.groups["title"]?.value) // "Sir"
}
```

#### 替换表达式中的命名组

命名组引用可以与替换表达式一起使用。考虑 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 函数，该函数将输入中指定的正则表达式的所有出现项替换为替换表达式，以及 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/