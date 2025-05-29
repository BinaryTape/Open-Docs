[//]: # (title: Kotlin 1.7.0 的新特性)

<tldr>
   <p>Kotlin 1.7.0 的 IDE 支持适用于 IntelliJ IDEA 2021.2、2021.3 和 2022.1。</p>
</tldr>

_[发布日期：2022 年 6 月 9 日](releases.md#release-details)_

Kotlin 1.7.0 已发布。它揭示了新 Kotlin/JVM K2 编译器的 Alpha 版本，稳定了语言特性，并为 JVM、JS 和 Native 平台带来了性能改进。

以下是此版本中的主要更新列表：

* [新的 Kotlin K2 编译器现已进入 Alpha 阶段](#new-kotlin-k2-compiler-for-the-jvm-in-alpha)，它提供了显著的性能改进。它仅适用于 JVM，并且包括 kapt 在内的所有编译器插件都无法与其配合使用。
* [Gradle 中增量编译的新方法](#a-new-approach-to-incremental-compilation)。增量编译现在也支持在依赖的非 Kotlin 模块内部所做的更改，并与 Gradle 兼容。
* 我们已经稳定了[选用要求注解](#stable-opt-in-requirements)、[明确的非空类型](#stable-definitely-non-nullable-types)和[构建器推断](#stable-builder-inference)。
* [现在有了类型参数的下划线运算符](#underscore-operator-for-type-arguments)。您可以使用它在指定其他类型时自动推断参数类型。
* [此版本允许通过委托将内联类的内联值进行实现](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)。您现在可以创建在大多数情况下不分配内存的轻量级包装器。

您还可以在此视频中找到对更改的简短概述：

<video src="https://www.youtube.com/v/54WEfLKtCGk" title="Kotlin 1.7.0 的新特性"/>

## 适用于 JVM 的新 Kotlin K2 编译器进入 Alpha 阶段

此 Kotlin 版本引入了新 Kotlin K2 编译器的 **Alpha** 版本。新编译器旨在加速新语言特性的开发，统一 Kotlin 支持的所有平台，带来性能改进，并为编译器扩展提供 API。

我们已经发布了一些关于新编译器及其优势的详细解释：

* [通往新 Kotlin 编译器之路](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 编译器：自顶向下的视图](https://www.youtube.com/watch?v=db19VFLZqJM)

需要指出的是，新 K2 编译器的 Alpha 版本主要侧重于性能改进，并且它仅适用于 JVM 项目。它不支持 Kotlin/JS、Kotlin/Native 或其他多平台项目，并且包括 [kapt](kapt.md) 在内的所有编译器插件都无法与其配合使用。

我们的基准测试显示，在我们的内部项目上取得了出色结果：

| 项目          | 当前 Kotlin 编译器性能 | 新 K2 Kotlin 编译器性能 | 性能提升 |
|-------------|--------------------|--------------------|----------|
| Kotlin      | 2.2 KLOC/秒         | 4.8 KLOC/秒         | ~ x2.2   |
| YouTrack    | 1.8 KLOC/秒         | 4.2 KLOC/秒         | ~ x2.3   |
| IntelliJ IDEA | 1.8 KLOC/秒         | 3.9 KLOC/秒         | ~ x2.2   |
| Space       | 1.2 KLOC/秒         | 2.8 KLOC/秒         | ~ x2.3   |

> KLOC/秒 的性能数字表示编译器每秒处理的代码行数（以千为单位）。
>
> {style="tip"}

您可以在您的 JVM 项目上查看性能提升，并将其与旧编译器的结果进行比较。要启用 Kotlin K2 编译器，请使用以下编译器选项：

```bash
-Xuse-k2
```

此外，K2 编译器[包含多项 Bug 修复](https://youtrack.jetbrains.com/issues/KT?q=tag:%20FIR-preview-qa%20%23Resolved)。请注意，此列表中即使是 **State: Open** 的问题，实际上也已在 K2 中修复。

未来的 Kotlin 版本将改进 K2 编译器的稳定性并提供更多功能，敬请期待！

如果您在使用 Kotlin K2 编译器时遇到任何性能问题，请[向我们的问题跟踪器报告](https://kotl.in/issue)。

## 语言

Kotlin 1.7.0 引入了对委托实现的（implementation by delegation）支持以及类型参数的新下划线运算符。它还稳定了在之前版本中作为预览引入的几项语言特性：

* [通过委托实现内联类的内联值](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)
* [类型参数的下划线运算符](#underscore-operator-for-type-arguments)
* [稳定的构建器推断](#stable-builder-inference)
* [稳定的选用要求](#stable-opt-in-requirements)
* [稳定的明确非空类型](#stable-definitely-non-nullable-types)

### 允许通过委托实现内联类的内联值

如果您想为值或类实例创建轻量级包装器，则需要手动实现所有接口方法。委托实现解决了这个问题，但在 1.7.0 之前它不适用于内联类。此限制已被移除，因此您现在可以创建在大多数情况下不分配内存的轻量级包装器。

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

Kotlin 1.7.0 引入了类型参数的下划线运算符 `_`。您可以使用它在指定其他类型时自动推断类型参数：

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
    // T is inferred as String because SomeImplementation derives from SomeClass<String>
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T is inferred as Int because OtherImplementation derives from SomeClass<Int>
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```

> 您可以在变量列表中的任何位置使用下划线运算符来推断类型参数。
>
{style="note"}

### 稳定的构建器推断

构建器推断是一种特殊的类型推断，在调用泛型构建器函数时非常有用。它有助于编译器使用其 lambda 参数中其他调用的类型信息来推断调用的类型参数。

从 1.7.0 开始，如果常规类型推断无法获取关于类型足够的信息，构建器推断将自动激活，而无需指定 `-Xenable-builder-inference` 编译器选项，该选项是[在 1.6.0 中引入的](whatsnew16.md#changes-to-builder-inference)。

[了解如何编写自定义泛型构建器](using-builders-with-builder-inference.md)。

### 稳定的选用要求

[选用要求](opt-in-requirements.md)现在已[稳定](components-stability.md)，并且不需要额外的编译器配置。

在 1.7.0 之前，选用功能本身需要参数 `-opt-in=kotlin.RequiresOptIn` 以避免警告。现在不再需要此参数；但是，您仍然可以使用编译器参数 `-opt-in` 来选用其他注解、[一个模块](opt-in-requirements.md#opt-in-a-module)。

### 稳定的明确非空类型

在 Kotlin 1.7.0 中，明确非空类型已升级为[稳定](components-stability.md)特性。它们在扩展泛型 Java 类和接口时提供了更好的互操作性。

您可以使用新语法 `T & Any` 在使用点将泛型类型参数标记为明确非空。此语法形式源自[交集类型](https://en.wikipedia.org/wiki/Intersection_type)的表示法，现在仅限于 `&` 左侧具有可空上限的类型参数和右侧的非空 `Any`：

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

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md) 中了解有关明确非空类型的更多信息。

## Kotlin/JVM

此版本为 Kotlin/JVM 编译器带来了性能改进和新的编译器选项。此外，对函数式接口构造函数的[可调用引用](#stable-callable-references-to-functional-interface-constructors)已成为稳定特性。请注意，自 1.7.0 起，Kotlin/JVM 编译的默认目标版本为 `1.8`。

* [编译器性能优化](#compiler-performance-optimizations)
* [新的编译器选项：-Xjdk-release](#new-compiler-option-xjdk-release)
* [稳定的函数式接口构造函数的可调用引用](#stable-callable-references-to-functional-interface-constructors)
* [移除 JVM 目标版本 1.6](#removed-jvm-target-version-1-6)

### 编译器性能优化

Kotlin 1.7.0 引入了 Kotlin/JVM 编译器的性能改进。根据我们的基准测试，与 Kotlin 1.6.0 相比，编译时间[平均减少了 10%](https://youtrack.jetbrains.com/issue/KT-48233/Switching-to-JVM-IR-backend-increases-compilation-time-by-more-t#focus=Comments-27-6114542.0-0)。由于字节码后处理的改进，大量使用内联函数的项目，例如[使用 `kotlinx.html` 的项目](https://youtrack.jetbrains.com/issue/KT-51416/Compilation-of-kotlinx-html-DSL-should-still-be-faster)，将编译得更快。

### 新的编译器选项：-Xjdk-release

Kotlin 1.7.0 引入了一个新的编译器选项 `-Xjdk-release`。此选项类似于 [javac 的命令行 `--release` 选项](http://openjdk.java.net/jeps/247)。`-Xjdk-release` 选项控制目标字节码版本，并将 classpath 中 JDK 的 API 限制为指定的 Java 版本。例如，即使依赖项中的 JDK 是版本 9 或更高，`kotlinc -Xjdk-release=1.8` 也不会允许引用 `java.lang.Module`。

> 此选项[不保证](https://youtrack.jetbrains.com/issue/KT-29974)对每个 JDK 分发都有效。
>
{style="note"}

请在[此 YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-29974/Add-a-compiler-option-Xjdk-release-similar-to-javac-s-release-to)上留下您的反馈。

### 稳定的函数式接口构造函数的可调用引用

对函数式接口构造函数的[可调用引用](reflection.md#callable-references)现在已[稳定](components-stability.md)。了解如何使用可调用引用将[接口从具有构造函数迁移到函数式接口](fun-interfaces.md#migration-from-an-interface-with-constructor-function-to-a-functional-interface)。

请在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中报告您发现的任何问题。

### 移除 JVM 目标版本 1.6

Kotlin/JVM 编译的默认目标版本是 `1.8`。`1.6` 目标已被移除。

请迁移到 JVM 目标 1.8 或更高版本。了解如何更新以下各项的 JVM 目标版本：

* [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm)
* [Maven](maven.md#attributes-specific-to-jvm)
* [命令行编译器](compiler-reference.md#jvm-target-version)

## Kotlin/Native

Kotlin 1.7.0 包含了对 Objective-C 和 Swift 互操作性的更改，并稳定了在之前版本中引入的特性。它还为新的内存管理器带来了性能改进以及其他更新：

* [新内存管理器的性能改进](#performance-improvements-for-the-new-memory-manager)
* [与 JVM 和 JS IR 后端统一的编译器插件 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [支持独立 Android 可执行文件](#support-for-standalone-android-executables)
* [与 Swift async/await 的互操作：返回 `Void` 而非 `KotlinUnit`](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [禁止通过 Objective-C 桥接传递未声明的异常](#prohibited-undeclared-exceptions-through-objective-c-bridges)
* [改进的 CocoaPods 集成](#improved-cocoapods-integration)
* [覆盖 Kotlin/Native 编译器下载 URL](#overriding-the-kotlin-native-compiler-download-url)

### 新内存管理器的性能改进

> 新的 Kotlin/Native 内存管理器处于 [Alpha 阶段](components-stability.md)。它在未来可能会发生不兼容的更改并需要手动迁移。我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中提供反馈。
>
{style="note"}

新的内存管理器仍处于 Alpha 阶段，但它正在向[稳定](components-stability.md)发展。此版本为新的内存管理器带来了显著的性能改进，尤其是在垃圾回收 (GC) 方面。特别是，[在 1.6.20 中引入的](whatsnew1620.md)清扫阶段的并发实现现在已默认启用。这有助于减少应用程序因 GC 暂停的时间。新的 GC 调度器更擅长选择 GC 频率，特别是对于更大的堆。

此外，我们还专门优化了调试二进制文件，确保在内存管理器的实现代码中使用了适当的优化级别和链接时优化。这有助于我们将调试二进制文件在基准测试中的执行时间缩短约 30%。

请在您的项目中尝试使用新的内存管理器，看看它是如何工作的，并在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中与我们分享您的反馈。

### 与 JVM 和 JS IR 后端统一的编译器插件 ABI

从 Kotlin 1.7.0 开始，Kotlin Multiplatform Gradle 插件默认使用 Kotlin/Native 的嵌入式编译器 jar。此[功能在 1.6.0 中作为实验性功能宣布](whatsnew16.md#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)，现在已稳定并可供使用。

此改进对库作者来说非常方便，因为它改善了编译器插件的开发体验。在此版本之前，您必须为 Kotlin/Native 提供单独的 Artifact，但现在您可以将相同的编译器插件 Artifact 用于 Native 和其他受支持的平台。

> 此功能可能需要插件开发者对其现有插件采取迁移步骤。
>
> 在[此 YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-48595)中了解如何为更新准备您的插件。
>
{style="warning"}

### 支持独立 Android 可执行文件

Kotlin 1.7.0 提供了对为 Android Native 目标生成标准可执行文件的全面支持。它[在 1.6.20 中引入](whatsnew1620.md#support-for-standalone-android-executables)，现在已默认启用。

如果您想回滚到 Kotlin/Native 生成共享库的旧行为，请使用以下设置：

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

### 与 Swift async/await 的互操作：返回 Void 而非 KotlinUnit

Kotlin `suspend` 函数现在在 Swift 中返回 `Void` 类型而不是 `KotlinUnit`。这是与 Swift 的 `async`/`await` 互操作性改进的结果。此功能[在 1.6.20 中引入](whatsnew1620.md#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)，此版本默认启用此行为。

您不再需要使用 `kotlin.native.binary.unitSuspendFunctionObjCExport=proper` 属性来为此类函数返回正确的类型。

### 禁止通过 Objective-C 桥接传递未声明的异常

当您从 Swift/Objective-C 代码调用 Kotlin 代码（反之亦然），并且此代码抛出异常时，应由发生异常的代码处理，除非您明确允许通过适当的转换在语言之间转发异常（例如，使用 `@Throws` 注解）。

以前，Kotlin 还有另一个意外行为，即在某些情况下未声明的异常可能会“泄漏”到另一种语言。Kotlin 1.7.0 修复了该问题，现在此类情况会导致程序终止。

因此，例如，如果您在 Kotlin 中有一个 `{ throw Exception() }` lambda 并从 Swift 调用它，在 Kotlin 1.7.0 中，一旦异常到达 Swift 代码，它就会终止。在之前的 Kotlin 版本中，此类异常可能会泄漏到 Swift 代码。

`@Throws` 注解将继续像以前一样工作。

### 改进的 CocoaPods 集成

从 Kotlin 1.7.0 开始，如果您想在项目中集成 CocoaPods，您不再需要安装 `cocoapods-generate` 插件。

以前，您需要安装 CocoaPods 依赖管理器和 `cocoapods-generate` 插件才能使用 CocoaPods，例如，在 Kotlin Multiplatform Mobile 项目中处理 [iOS 依赖项](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ios-dependencies.html#with-cocoapods)。

现在设置 CocoaPods 集成更容易了，并且我们解决了 `cocoapods-generate` 无法在 Ruby 3 及更高版本上安装的问题。现在也支持在 Apple M1 上运行更好的最新 Ruby 版本。

了解如何设置[初始 CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html#set-up-an-environment-to-work-with-cocoapods)。

### 覆盖 Kotlin/Native 编译器下载 URL

从 Kotlin 1.7.0 开始，您可以自定义 Kotlin/Native 编译器的下载 URL。当 CI 上禁止外部链接时，这会很有用。

```none
kotlin.native.distribution.baseDownloadUrl=https://example.com
```

> 下载器会将原生版本和目标操作系统附加到此基本 URL，以确保下载实际的编译器分发。
>
{style="note"}

## Kotlin/JS

Kotlin/JS 正在获得对 [JS IR 编译器后端](js-ir-compiler.md)的进一步改进，以及其他可以改善您的开发体验的更新：

* [新 IR 后端的性能改进](#performance-improvements-for-the-new-ir-backend)
* [使用 IR 时成员名称的混淆](#minification-for-member-names-when-using-ir)
* [IR 后端通过 polyfills 支持旧版浏览器](#support-for-older-browsers-via-polyfills-in-the-ir-backend)
* [从 js 表达式动态加载 JavaScript 模块](#dynamically-load-javascript-modules-from-js-expressions)
* [为 JavaScript 测试运行器指定环境变量](#specify-environment-variables-for-javascript-test-runners)

### 新 IR 后端的性能改进

此版本包含一些重大更新，应该可以改善您的开发体验：

* Kotlin/JS 的增量编译性能已显著提升。构建 JS 项目所需的时间更少。在许多情况下，增量重建现在应该与旧版后端大致持平。
* Kotlin/JS 最终 Bundle 所需空间更少，因为我们已显著减小了最终 Artifact 的大小。对于一些大型项目，我们测得生产 Bundle 大小与旧版后端相比减少了高达 20%。
* 接口的类型检查已得到数量级的改进。
* Kotlin 生成更高质量的 JS 代码

### 使用 IR 时成员名称的混淆

Kotlin/JS IR 编译器现在利用其内部关于 Kotlin 类和函数关系的信息，应用更高效的混淆（minification），缩短函数、属性和类的名称。这会缩小生成的捆绑应用程序。

当您在生产模式下构建 Kotlin/JS 应用程序时，此类混淆会自动应用并默认启用。要禁用成员名称混淆，请使用 `-Xir-minimized-member-names` 编译器标志：

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xir-minimized-member-names=false")
        }
    }
}
```

### IR 后端通过 polyfills 支持旧版浏览器

Kotlin/JS 的 IR 编译器后端现在包含了与旧版后端相同的 polyfills。这使得用新编译器编译的代码可以在不支持 Kotlin 标准库所使用的所有 ES2015 方法的旧版浏览器中运行。最终的 bundle 中只包含项目实际使用的 polyfills，这最大限度地减少了它们对 bundle 大小的潜在影响。

使用 IR 编译器时，此功能默认启用，您无需进行配置。

### 从 js 表达式动态加载 JavaScript 模块

在使用 JavaScript 模块时，大多数应用程序都使用静态导入，其用法已在 [JavaScript 模块集成](js-modules.md)中涵盖。然而，Kotlin/JS 缺少一种在应用程序运行时动态加载 JavaScript 模块的机制。

从 Kotlin 1.7.0 开始，`js` 块中支持 JavaScript 的 `import` 语句，允许您在运行时动态地将包引入应用程序：

```kotlin
val myPackage = js("import('my-package')")
```

### 为 JavaScript 测试运行器指定环境变量

为了调整 Node.js 包解析或向 Node.js 测试传递外部信息，您现在可以指定 JavaScript 测试运行器使用的环境变量。要定义环境变量，请在构建脚本的 `testTask` 块内使用带有键值对的 `environment()` 函数：

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

在 Kotlin 1.7.0 中，标准库收到了一系列更改和改进。它们引入了新功能，稳定了实验性功能，并统一了 Native、JS 和 JVM 平台对命名捕获组的支持：

* [min() 和 max() 集合函数返回非空值](#min-and-max-collection-functions-return-as-non-nullable)
* [特定索引处的正则表达式匹配](#regular-expression-matching-at-specific-indices)
* [扩展支持以前的语言和 API 版本](#extended-support-for-previous-language-and-api-versions)
* [通过反射访问注解](#access-to-annotations-via-reflection)
* [稳定的深度递归函数](#stable-deep-recursive-functions)
* [基于内联类的时间标记用于默认时间源](#time-marks-based-on-inline-classes-for-default-time-source)
* [Java Optional 的新实验性扩展函数](#new-experimental-extension-functions-for-java-optionals)
* [JS 和 Native 中对命名捕获组的支持](#support-for-named-capturing-groups-in-js-and-native)

### min() 和 max() 集合函数返回非空值

在 [Kotlin 1.4.0](whatsnew14.md) 中，我们将 `min()` 和 `max()` 集合函数重命名为 `minOrNull()` 和 `maxOrNull()`。这些新名称更好地反映了它们的行为——如果接收集合为空则返回 null。它还有助于使这些函数的行为与整个 Kotlin 集合 API 中使用的命名约定保持一致。

`minBy()`、`maxBy()`、`minWith()` 和 `maxWith()` 也是如此，它们在 Kotlin 1.4.0 中都获得了 *OrNull() 同义词。受此更改影响的旧函数已逐步弃用。

Kotlin 1.7.0 重新引入了原始函数名称，但返回类型为非空。新的 `min()`、`max()`、`minBy()`、`maxBy()`、`minWith()` 和 `maxWith()` 函数现在严格返回集合元素或抛出异常。

```kotlin
fun main() {
    val numbers = listOf<Int>()
    println(numbers.maxOrNull()) // "null"
    println(numbers.max()) // "Exception in... Collection is empty."
}
```

### 特定索引处的正则表达式匹配

`Regex.matchAt()` 和 `Regex.matchesAt()` 函数，[在 1.5.30 中引入](whatsnew1530.md#matching-with-regex-at-a-particular-position)，现在已稳定。它们提供了一种方法来检查正则表达式是否在 `String` 或 `CharSequence` 中的特定位置有精确匹配。

`matchesAt()` 检查匹配并返回布尔结果：

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    // regular expression: one digit, dot, one digit, dot, one or more digits
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
}
```

`matchAt()` 如果找到匹配则返回匹配，否则返回 `null`：

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.7.0"
}
```

我们非常感谢您对此 [YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-34021)的反馈。

### 扩展支持以前的语言和 API 版本

为了支持库作者开发旨在兼容各种旧版 Kotlin 的库，并应对主要 Kotlin 版本发布频率的增加，我们扩展了对以前语言和 API 版本的支持。

通过 Kotlin 1.7.0，我们支持三个而不是两个以前的语言和 API 版本。这意味着 Kotlin 1.7.0 支持开发面向 Kotlin 1.4.0 及更低版本的库。有关向后兼容性的更多信息，请参阅[兼容模式](compatibility-modes.md)。

### 通过反射访问注解

[`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 扩展函数，[首次在 1.6.0 中引入](whatsnew16.md#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)，现在已[稳定](components-stability.md)。此[反射](reflection.md)函数返回元素上给定类型的所有注解，包括单独应用的注解和重复注解。

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

深度递归函数自 [Kotlin 1.4.0](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/#Defining_deep_recursive_functions_using_coroutines) 起作为实验性功能提供，现在在 Kotlin 1.7.0 中已[稳定](components-stability.md)。使用 `DeepRecursiveFunction`，您可以定义一个函数，该函数将其堆栈保留在堆上，而不是使用实际的调用堆栈。这使您能够运行非常深的递归计算。要调用深度递归函数，请 `invoke` 它。

在此示例中，深度递归函数用于递归计算二叉树的深度。即使此示例函数递归调用自身 100,000 次，也不会抛出 `StackOverflowError`：

```kotlin
class Tree(val left: Tree?, val right: Tree?)

val calculateDepth = DeepRecursiveFunction<Tree?, Int> { t ->
    if (t == null) 0 else maxOf(
        callRecursive(t.left),
        callRecursive(t.right)
    ) + 1
}

fun main() {
    // Generate a tree with a depth of 100_000
    val deepTree = generateSequence(Tree(null, null)) { prev ->
        Tree(prev, null)
    }.take(100_000).last()

    println(calculateDepth(deepTree)) // 100000
}
```

当您的递归深度超过 1000 次调用时，请考虑在代码中使用深度递归函数。

### 基于内联类的时间标记用于默认时间源

Kotlin 1.7.0 通过将 `TimeSource.Monotonic` 返回的时间标记更改为内联值类来提高时间测量功能的性能。这意味着调用 `markNow()`、`elapsedNow()`、`measureTime()` 和 `measureTimedValue()` 等函数不会为其 `TimeMark` 实例分配包装器类。特别是在测量热路径中的一段代码时，这有助于最大限度地减少测量的性能影响：

```kotlin
@OptIn(ExperimentalTime::class)
fun main() {
    val mark = TimeSource.Monotonic.markNow() // Returned `TimeMark` is inline class
    val elapsedDuration = mark.elapsedNow()
}
```

> 仅当获取 `TimeMark` 的时间源在静态上已知为 `TimeSource.Monotonic` 时，此优化才可用。
>
{style="note"}

### Java Optional 的新实验性扩展函数

Kotlin 1.7.0 带来了新的便捷函数，简化了在 Java 中使用 `Optional` 类。这些新函数可用于在 JVM 上解包和转换可选对象，并有助于使 Java API 的使用更简洁。

`getOrNull()`、`getOrDefault()` 和 `getOrElse()` 扩展函数允许您获取 `Optional` 的值（如果存在）。否则，您将分别获得 `null`、默认值或函数返回的值：

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

`toList()`、`toSet()` 和 `asSequence()` 扩展函数将存在的 `Optional` 的值转换为列表、集合或序列，否则返回空集合。`toCollection()` 扩展函数将 `Optional` 值附加到已存在的目的地集合：

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

这些扩展函数在 Kotlin 1.7.0 中作为实验性功能引入。您可以在[此 KEEP](https://github.com/Kotlin/KEEP/pull/291) 中了解有关 `Optional` 扩展的更多信息。一如既往，我们欢迎您在 [Kotlin 问题跟踪器](https://kotl.in/issue)中提供反馈。

### JS 和 Native 中对命名捕获组的支持

从 Kotlin 1.7.0 开始，命名捕获组不仅在 JVM 上受支持，而且在 JS 和 Native 平台上也受支持。

要为捕获组命名，请在正则表达式中使用 (`?<name>group`) 语法。要获取组匹配的文本，请调用新引入的 [`MatchGroupCollection.get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/get.html) 函数并传入组名称。

#### 按名称检索匹配的组值

考虑这个用于匹配城市坐标的示例。要获取正则表达式匹配的组集合，请使用 [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html)。比较通过其数字（索引）和通过其名称使用 `value` 检索组内容：

```kotlin
fun main() {
    val regex = "\\b(?<city>[A-Za-z\\s]+),\\s(?<state>[A-Z]{2}):\\s(?<areaCode>[0-9]{3})\\b".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    val match = regex.find(input)!!
    println(match.groups["city"]?.value) // "Austin" — by name
    println(match.groups[2]?.value) // "TX" — by number
}
```

#### 命名反向引用

您现在也可以在反向引用组时使用组名称。反向引用匹配先前由捕获组匹配的相同文本。为此，请在正则表达式中使用 `\k<name>` 语法：

```kotlin
fun backRef() {
    val regex = "(?<title>\\w+), yes \\k<title>".toRegex()
    val match = regex.find("Do you copy? Sir, yes Sir!")!!
    println(match.value) // "Sir, yes Sir"
    println(match.groups["title"]?.value) // "Sir"
}
```

#### 替换表达式中的命名组

命名组引用可以与替换表达式一起使用。考虑 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 函数，该函数用替换表达式替换输入中指定正则表达式的所有出现，以及 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) 函数，该函数仅交换第一次匹配。

替换字符串中 `${name}` 的出现将替换为与指定名称的捕获组对应的子序列。您可以比较按名称和索引在组引用中的替换：

```kotlin
fun dateReplace() {
    val dateRegex = Regex("(?<dd>\\d{2})-(?<mm>\\d{2})-(?<yyyy>\\d{4})")
    val input = "Date of birth: 27-04-2022"
    println(dateRegex.replace(input, "\${yyyy}-\${mm}-\${dd}")) // "Date of birth: 2022-04-27" — by name
    println(dateRegex.replace(input, "\$3-\$2-\$1")) // "Date of birth: 2022-04-27" — by number
}
```

## Gradle

此版本引入了新的构建报告、对 Gradle 插件变体的支持、kapt 的新统计信息以及更多内容：

* [增量编译的新方法](#a-new-approach-to-incremental-compilation)
* [用于跟踪编译器性能的新构建报告](#build-reports-for-kotlin-compiler-tasks)
* [Gradle 和 Android Gradle 插件的最低支持版本更改](#bumping-minimum-supported-versions)
* [支持 Gradle 插件变体](#support-for-gradle-plugin-variants)
* [Kotlin Gradle 插件 API 的更新](#updates-in-the-kotlin-gradle-plugin-api)
* [sam-with-receiver 插件可通过 plugins API 使用](#the-sam-with-receiver-plugin-is-available-via-the-plugins-api)
* [编译任务中的更改](#changes-in-compile-tasks)
* [kapt 中每个注解处理器生成文件的新统计信息](#statistics-of-generated-files-by-each-annotation-processor-in-kapt)
* [弃用 kotlin.compiler.execution.strategy 系统属性](#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)
* [移除已弃用的选项、方法和插件](#removal-of-deprecated-options-methods-and-plugins)

### 增量编译的新方法

> 增量编译的新方法是[实验性功能](components-stability.md)。它可能随时被放弃或更改。需要选择启用（详见下文）。我们鼓励您仅将其用于评估目的，并且我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供反馈。
>
{style="warning"}

在 Kotlin 1.7.0 中，我们重新设计了跨模块更改的增量编译。现在，增量编译也支持在依赖的非 Kotlin 模块内部所做的更改，并且它与 [Gradle 构建缓存](https://docs.gradle.org/current/userguide/build_cache.html)兼容。编译避免（compilation avoidance）的支持也得到了改进。

如果您使用构建缓存或经常在非 Kotlin Gradle 模块中进行更改，我们预计您会看到新方法最显著的优势。我们对 Kotlin 项目在 `kotlin-gradle-plugin` 模块上的测试显示，缓存命中后，更改的改进超过 80%。

要尝试这种新方法，请在您的 `gradle.properties` 中设置以下选项：

```none
kotlin.incremental.useClasspathSnapshot=true
```

> 增量编译的新方法目前仅适用于 Gradle 构建系统中的 JVM 后端。
>
{style="note"}

在[这篇博客文章](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/)中了解增量编译新方法的底层实现。

我们的计划是稳定这项技术并增加对其他后端（例如 JS）和构建系统的支持。如果您在此编译方案中遇到任何问题或异常行为，请在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中报告，我们将不胜感激。谢谢！

Kotlin 团队非常感谢 [Ivan Gavrilovic](https://github.com/gavra0)、[Hung Nguyen](https://github.com/hungvietnguyen)、[Cédric Champeau](https://github.com/melix) 和其他外部贡献者的帮助。

### Kotlin 编译器任务的构建报告

> Kotlin 构建报告是[实验性功能](components-stability.md)。它们可能随时被放弃或更改。需要选择启用（详见下文）。仅将其用于评估目的。我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供有关它们的反馈。
>
{style="warning"}

Kotlin 1.7.0 引入了构建报告，有助于跟踪编译器性能。报告包含不同编译阶段的持续时间以及编译无法增量的原因。

构建报告在您想调查编译器任务问题时非常有用，例如：

* 当 Gradle 构建耗时过长，您想了解性能不佳的根本原因时。
* 当同一项目的编译时间不同，有时需要几秒，有时需要几分钟时。

要启用构建报告，请在 `gradle.properties` 中声明构建报告输出的保存位置：

```none
kotlin.build.report.output=file
```

以下值（及其组合）可用：

* `file` 将构建报告保存在本地文件中。
* `build_scan` 将构建报告保存在 [构建扫描](https://scans.gradle.com/) 的 `custom values` 部分。

  > Gradle Enterprise 插件限制了自定义值的数量和长度。在大型项目中，一些值可能会丢失。
  >
  {style="note"}

* `http` 使用 HTTP(S) 发布构建报告。POST 方法以 JSON 格式发送指标。数据可能因版本而异。您可以在 [Kotlin 仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)中查看发送数据的当前版本。

分析长时间运行编译的构建报告可以帮助您解决两种常见情况：

* 构建不是增量的。分析原因并修复根本问题。
* 构建是增量的，但耗时过长。尝试重组源文件——拆分大文件，将单独的类保存在不同的文件中，重构大型类，在不同的文件中声明顶层函数等等。

在[这篇博客文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/)中了解有关新构建报告的更多信息。

欢迎您在您的基础设施中尝试使用构建报告。如果您有任何反馈、遇到任何问题或想提出改进建议，请随时在我们的[问题跟踪器](https://youtrack.jetbrains.com/newIssue)中报告。谢谢！

### 提高最低支持版本

从 Kotlin 1.7.0 开始，最低支持的 Gradle 版本是 6.7.1。我们不得不[提高版本](https://youtrack.jetbrains.com/issue/KT-49733/Bump-minimal-supported-Gradle-version-to-6-7-1)以支持[Gradle 插件变体](#support-for-gradle-plugin-variants)和新的 Gradle API。未来，由于 Gradle 插件变体功能，我们应该不必像现在这样频繁地提高最低支持版本。

此外，最低支持的 Android Gradle 插件版本现在是 3.6.4。

### 支持 Gradle 插件变体

Gradle 7.0 为 Gradle 插件作者引入了一项新功能——[带变体的插件](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants)。此功能使添加对新 Gradle 功能的支持变得更容易，同时保持与 7.1 以下 Gradle 版本的兼容性。了解有关 [Gradle 中变体选择](https://docs.gradle.org/current/userguide/variant_model.html)的更多信息。

通过 Gradle 插件变体，我们可以为不同的 Gradle 版本提供不同的 Kotlin Gradle 插件变体。目标是在 `main` 变体中支持基本的 Kotlin 编译，这对应于最旧的受支持 Gradle 版本。每个变体都将包含相应发布版本中 Gradle 功能的实现。最新的变体将支持最广泛的 Gradle 功能集。通过这种方法，我们可以扩展对功能有限的旧版 Gradle 的支持。

目前，Kotlin Gradle 插件只有两个变体：

* `main` 用于 Gradle 6.7.1–6.9.3 版本
* `gradle70` 用于 Gradle 7.0 及更高版本

在未来的 Kotlin 版本中，我们可能会添加更多。

要检查您的构建使用哪个变体，请启用 [`--info` 日志级别](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level) 并在输出中查找以 `Using Kotlin Gradle plugin` 开头的字符串，例如 `Using Kotlin Gradle plugin main variant`。

> 以下是一些 Gradle 中变体选择已知问题的解决方案：
> * [pluginManagement 中的 ResolutionStrategy 对多变体插件无效](https://github.com/gradle/gradle/issues/20545)
> * [当插件作为 `buildSrc` 常用依赖项添加时，插件变体被忽略](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

请在[此 YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-49227/Support-Gradle-plugins-variants)上留下您的反馈。

### Kotlin Gradle 插件 API 的更新

Kotlin Gradle 插件 API Artifact 获得了一些改进：

* Kotlin/JVM 和 Kotlin/kapt 任务有了新的接口，支持用户可配置的输入。
* 新增了一个 `KotlinBasePlugin` 接口，所有 Kotlin 插件都继承自该接口。当您希望在应用任何 Kotlin Gradle 插件（JVM、JS、多平台、Native 及其他平台）时触发某个配置操作时，请使用此接口：

  ```kotlin
  project.plugins.withType<org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin>() {
      // Configure your action here
  }
  ```
  您可以在[此 YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-48008/Consider-offering-a-KotlinBasePlugin)中留下关于 `KotlinBasePlugin` 的反馈。

* 我们为 Android Gradle 插件在其自身内部配置 Kotlin 编译奠定了基础，这意味着您无需将 Kotlin Android Gradle 插件添加到您的构建中。关注 [Android Gradle 插件发布公告](https://developer.android.com/studio/releases/gradle-plugin)以了解新增的支持并进行尝试！

### sam-with-receiver 插件可通过 plugins API 使用

[sam-with-receiver 编译器插件](sam-with-receiver-plugin.md)现在可通过 [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block) 使用：

```kotlin
plugins {
    id("org.jetbrains.kotlin.plugin.sam.with.receiver") version "$kotlin_version"
}
```

### 编译任务中的更改

此版本中编译任务获得了许多更改：

* Kotlin 编译任务不再继承 Gradle 的 `AbstractCompile` 任务。它们只继承 `DefaultTask`。
* `AbstractCompile` 任务有 `sourceCompatibility` 和 `targetCompatibility` 输入。由于 `AbstractCompile` 任务不再被继承，这些输入在 Kotlin 用户脚本中不再可用。
* `SourceTask.stableSources` 输入不再可用，您应该使用 `sources` 输入。`setSource(...)` 方法仍然可用。
* 所有编译任务现在都使用 `libraries` 输入来获取编译所需的库列表。`KotlinCompile` 任务仍然包含已弃用的 Kotlin 属性 `classpath`，该属性将在未来的版本中移除。
* 编译任务仍然实现了 `PatternFilterable` 接口，该接口允许过滤 Kotlin 源。`sourceFilesExtensions` 输入已被移除，转而使用 `PatternFilterable` 方法。
* 已弃用的 `Gradle destinationDir: File` 输出已被 `destinationDirectory: DirectoryProperty` 输出替换。
* Kotlin/Native 的 `AbstractNativeCompile` 任务现在继承了 `AbstractKotlinCompileTool` 基类。这是将 Kotlin/Native 构建工具集成到所有其他工具中的初始步骤。

请在[此 YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-32805)中留下您的反馈。

### kapt 中每个注解处理器生成文件的新统计信息

`kotlin-kapt` Gradle 插件已[报告每个处理器的性能统计信息](https://github.com/JetBrains/kotlin/pull/4280)。从 Kotlin 1.7.0 开始，它还可以报告每个注解处理器生成的文件数量的统计信息。

这对于跟踪构建中是否存在未使用的注解处理器很有用。您可以使用生成的报告来查找触发不必要的注解处理器的模块，并更新这些模块以防止这种情况发生。

通过两个步骤启用统计信息：

* 在您的 `build.gradle.kts` 中将 `showProcessorStats` 标志设置为 `true`：

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

* 在您的 `gradle.properties` 中将 `kapt.verbose` Gradle 属性设置为 `true`：
  
  ```none
  kapt.verbose=true
  ```

> 您还可以通过[命令行选项 `verbose`](kapt.md#use-in-cli) 启用详细输出。
>
{style="note"}

统计信息将以 `info` 级别显示在日志中。您将看到 `Annotation processor stats:` 行，其后是每个注解处理器执行时间的统计信息。这些行之后将是 `Generated files report:` 行，其后是每个注解处理器生成的文件数量的统计信息。例如：

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

请在[此 YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-51132/KAPT-Support-reporting-the-number-of-generated-files-by-each-ann)中留下您的反馈。

### 弃用 kotlin.compiler.execution.strategy 系统属性

Kotlin 1.6.20 引入了[用于定义 Kotlin 编译器执行策略的新属性](whatsnew1620.md#properties-for-defining-kotlin-compiler-execution-strategy)。在 Kotlin 1.7.0 中，已开始弃用旧的系统属性 `kotlin.compiler.execution.strategy`，转而使用新属性。

当您使用 `kotlin.compiler.execution.strategy` 系统属性时，您将收到警告。此属性将在未来的版本中删除。为了保留旧行为，请将系统属性替换为同名的 Gradle 属性。您可以在 `gradle.properties` 中执行此操作，例如：

```none
kotlin.compiler.execution.strategy=out-of-process
```

您还可以使用编译任务属性 `compilerExecutionStrategy`。在 [Gradle 页面](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)上了解更多信息。

### 移除已弃用的选项、方法和插件

#### 移除 useExperimentalAnnotation 方法

在 Kotlin 1.7.0 中，我们完成了对 `useExperimentalAnnotation` Gradle 方法的弃用周期。请改用 `optIn()` 来选择启用模块中的 API。

例如，如果您的 Gradle 模块是多平台：

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

了解 Kotlin 中的[选用要求](opt-in-requirements.md)。

#### 移除已弃用的编译器选项

我们已完成了几个编译器选项的弃用周期：

* `kotlinOptions.jdkHome` 编译器选项在 1.5.30 中已弃用，并在此版本中移除。如果 Gradle 构建包含此选项，现在将失败。我们鼓励您使用自 Kotlin 1.5.30 起受支持的 [Java 工具链](whatsnew1530.md#support-for-java-toolchains)。
* 已弃用的 `noStdlib` 编译器选项也已移除。Gradle 插件使用 `kotlin.stdlib.default.dependency=true` 属性来控制 Kotlin 标准库是否存在。

> 编译器参数 `-jdkHome` 和 `-no-stdlib` 仍然可用。
>
{style="note"}

#### 移除已弃用的插件

在 Kotlin 1.4.0 中，`kotlin2js` 和 `kotlin-dce-plugin` 插件已弃用，并在此版本中移除。请改用新的 `org.jetbrains.kotlin.js` 插件来替代 `kotlin2js`。当 Kotlin/JS Gradle 插件[正确配置](javascript-dce.md)时，死代码消除 (DCE) 才会生效。

在 Kotlin 1.6.0 中，我们将 `KotlinGradleSubplugin` 类的弃用级别更改为 `ERROR`。开发人员曾使用此类别来编写编译器插件。在此版本中，[此类别已被移除](https://youtrack.jetbrains.com/issue/KT-48831/)。请改用 `KotlinCompilerPluginSupportPlugin` 类。

> 最佳实践是在整个项目中使用 1.7.0 及更高版本的 Kotlin 插件。
>
{style="tip"}

#### 移除已弃用的协程 DSL 选项和属性

我们移除了已弃用的 `kotlin.experimental.coroutines` Gradle DSL 选项和 `gradle.properties` 中使用的 `kotlin.coroutines` 属性。现在您只需使用 _[挂起函数](coroutines-basics.md#extract-function-refactoring)_ 或[将 `kotlinx.coroutines` 依赖项添加到](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library)构建脚本中。

在[协程指南](coroutines-guide.md)中了解有关协程的更多信息。

#### 移除工具链扩展方法中的类型转换

在 Kotlin 1.7.0 之前，当使用 Kotlin DSL 配置 Gradle 工具链时，您必须将类型强制转换为 `JavaToolchainSpec` 类：

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

现在，您可以省略 `(this as JavaToolchainSpec)` 部分：

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

## 迁移到 Kotlin 1.7.0

### 安装 Kotlin 1.7.0

IntelliJ IDEA 2022.1 和 Android Studio Chipmunk (212) 会自动建议将 Kotlin 插件更新到 1.7.0。

> 对于 IntelliJ IDEA 2022.2，以及 Android Studio Dolphin (213) 或 Android Studio Electric Eel (221)，Kotlin 插件 1.7.0 将随即将发布的 IntelliJ IDEA 和 Android Studio 更新一起提供。
> 
{style="note"}

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.7.0)下载。

### 迁移现有项目或使用 Kotlin 1.7.0 启动新项目

* 要将现有项目迁移到 Kotlin 1.7.0，请将 Kotlin 版本更改为 `1.7.0` 并重新导入您的 Gradle 或 Maven 项目。[了解如何更新到 Kotlin 1.7.0](releases.md#update-to-a-new-kotlin-version)。

* 要使用 Kotlin 1.7.0 启动新项目，请更新 Kotlin 插件并从 **File** | **New** | **Project** 运行项目向导。

### Kotlin 1.7.0 兼容性指南

Kotlin 1.7.0 是一个[功能版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能会带来与您为早期语言版本编写的代码不兼容的更改。在 [Kotlin 1.7.0 兼容性指南](compatibility-guide-17.md)中查找此类更改的详细列表。