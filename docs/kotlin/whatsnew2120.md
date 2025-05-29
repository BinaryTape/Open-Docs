[//]: # (title: Kotlin 2.1.20 有哪些新特性)

_[发布日期：2025 年 3 月 20 日](releases.md#release-details)_

Kotlin 2.1.20 版本发布了！以下是主要亮点：

*   **K2 编译器更新**：[新 kapt 和 Lombok 插件的更新](#kotlin-k2-compiler)
*   **Kotlin 多平台**：[用于替代 Gradle Application 插件的新 DSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
*   **Kotlin/Native**：[支持 Xcode 16.3 和一项新的内联优化](#kotlin-native)
*   **Kotlin/Wasm**：[默认自定义格式化程序、支持 DWARF 以及迁移到 Provider API](#kotlin-wasm)
*   **Gradle 支持**：[与 Gradle 隔离项目和自定义发布变体兼容](#gradle)
*   **标准库**：[通用原子类型、改进的 UUID 支持以及新的时间跟踪功能](#standard-library)
*   **Compose 编译器**：[放宽了对 `@Composable` 函数的限制和其他更新](#compose-compiler)
*   **文档**：[Kotlin 文档的显著改进](#documentation-updates)。

## IDE 支持

支持 2.1.20 的 Kotlin 插件已捆绑在最新的 IntelliJ IDEA 和 Android Studio 中。
你无需在 IDE 中更新 Kotlin 插件。
你只需在构建脚本中将 Kotlin 版本更改为 2.1.20。

有关详细信息，请参阅[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

### 在支持 OSGi 的项目中下载 Kotlin Artifacts 的源代码

现在，`kotlin-osgi-bundle` 库的所有依赖项的源代码都包含在其分发包中。这使得
IntelliJ IDEA 能够下载这些源代码，为 Kotlin 符号提供文档并改善调试体验。

## Kotlin K2 编译器

我们正在持续改进对新 Kotlin K2 编译器的插件支持。此版本为新的 kapt
和 Lombok 插件带来了更新。

### 新的默认 kapt 插件
<primary-label ref="beta"/>

从 Kotlin 2.1.20 开始，kapt 编译器插件的 K2 实现默认对所有项目启用。

JetBrains 团队早在 Kotlin 1.9.20 中就推出了带有 K2 编译器的新 kapt 插件实现。
自那时以来，我们进一步开发了 K2 kapt 的内部实现，使其行为与 K1 版本相似，
同时显著提高了其性能。

如果你在使用带有 K2 编译器的 kapt 时遇到任何问题，
你可以暂时恢复到以前的插件实现。

为此，请将以下选项添加到你项目的 `gradle.properties` 文件中：

```kotlin
kapt.use.k2=false
```

请将任何问题报告到我们的[问题跟踪器](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

### Lombok 编译器插件：支持 `@SuperBuilder` 和 `@Builder` 的更新
<primary-label ref="experimental-general"/>

[Kotlin Lombok 编译器插件](lombok.md)现在支持 `@SuperBuilder` 注解，从而更容易为类层次结构创建
构建器。以前，在 Kotlin 中使用 Lombok 的开发者在处理继承时必须手动定义构建器。有了 `@SuperBuilder`，构建器会自动继承超类字段，允许你在构建对象时对其进行初始化。

此外，此更新还包括多项改进和错误修复：

*   `@Builder` 注解现在可用于构造函数，允许更灵活地创建对象。有关更多详细信息，请参阅相应的[YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-71547)。
*   与 Lombok 在 Kotlin 中代码生成相关的多个问题已得到解决，提高了整体兼容性。有关更多详细信息，请参阅 [GitHub 变更日志](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)。

有关 `@SuperBuilder` 注解的更多信息，请参阅官方 [Lombok 文档](https://projectlombok.org/features/experimental/SuperBuilder)。

## Kotlin 多平台：用于替代 Gradle Application 插件的新 DSL
<primary-label ref="experimental-opt-in"/>

从 Gradle 8.7 开始，[Application](https://docs.gradle.org/current/userguide/application_plugin.html) 插件不再与 Kotlin 多平台 Gradle 插件兼容。Kotlin 2.1.20 引入了一个实验性 (Experimental)
DSL 来实现类似的功能。新的 `executable {}` 代码块为 JVM 目标配置执行任务和 Gradle
[分发](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)。

在你构建脚本的 `executable {}` 代码块之前，添加以下 `@OptIn` 注解：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

例如：

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // Configures a JavaExec task named "runJvm" and a Gradle distribution for the "main" compilation in this target
            executable {
                mainClass.set("foo.MainKt")
            }

            // Configures a JavaExec task named "runJvmAnother" and a Gradle distribution for the "main" compilation
            executable(KotlinCompilation.MAIN_COMPILATION_NAME, "another") {
                // Set a different class
                mainClass.set("foo.MainAnotherKt")
            }

            // Configures a JavaExec task named "runJvmTest" and a Gradle distribution for the "test" compilation
            executable(KotlinCompilation.TEST_COMPILATION_NAME) {
                mainClass.set("foo.MainTestKt")
            }

            // Configures a JavaExec task named "runJvmTestAnother" and a Gradle distribution for the "test" compilation
            executable(KotlinCompilation.TEST_COMPILATION_NAME, "another") {
                mainClass.set("foo.MainAnotherTestKt")
            }
        }
    }
}
```

在此示例中，Gradle 的 [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)
插件应用于第一个 `executable {}` 代码块。

如果你遇到任何问题，请在我们的[问题跟踪器](https://kotl.in/issue)中报告，或在我们的[公共 Slack 频道](https://kotlinlang.slack.com/archives/C19FD9681)中告知我们。

## Kotlin/Native

### 支持 Xcode 16.3

从 Kotlin **2.1.21** 开始，Kotlin/Native 编译器支持 Xcode 16.3 – Xcode 的最新稳定版本。
请随时更新你的 Xcode 并继续为 Apple 操作系统上的 Kotlin 项目工作。

2.1.21 版本还修复了相关的 [cinterop 问题](https://youtrack.jetbrains.com/issue/KT-75781/)，该问题导致
Kotlin 多平台项目中的编译失败。

### 新的内联优化
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 引入了一项新的内联优化过程，它在实际代码生成阶段之前执行。

Kotlin/Native 编译器中的新内联过程应该比标准的 LLVM 内联器表现更好，并提高生成代码的运行时性能。

新的内联过程目前处于[实验性 (Experimental) 阶段](components-stability.md#stability-levels-explained)。要试用它，请使用以下编译器选项：

```none
-Xbinary=preCodegenInlineThreshold=40
```

我们的实验表明，将阈值设置为 40 个令牌（由编译器解析的代码单元）为编译优化提供了一个合理的
折衷方案。根据我们的基准测试，这带来了 9.5% 的整体性能提升。当然，你也可以尝试其他值。

如果你遇到二进制文件大小增加或编译时间延长的问题，请通过 [YouTrack](https://kotl.in/issue) 报告此类问题。

## Kotlin/Wasm

此版本改进了 Kotlin/Wasm 调试和属性使用。自定义格式化程序现在在开发版本中开箱即用，
而 DWARF 调试则有助于代码检查。此外，Provider API 简化了 Kotlin/Wasm 和 Kotlin/JS 中的属性使用。

### 自定义格式化程序默认启用

之前，你必须[手动配置](whatsnew21.md#improved-debugging-experience-for-kotlin-wasm)自定义格式化程序，以在使用 Kotlin/Wasm 代码时改进 Web 浏览器中的调试。

在此版本中，自定义格式化程序在开发版本中默认启用，因此你无需进行额外的 Gradle 配置。

要使用此功能，你只需确保在浏览器的开发者工具中启用了自定义格式化程序：

*   在 Chrome DevTools 中，在**设置 | 首选项 | 控制台**中找到自定义格式化程序复选框：

    ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=400}

*   在 Firefox DevTools 中，在**设置 | 高级设置**中找到自定义格式化程序复选框：

    ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=400}

此更改主要影响 Kotlin/Wasm 开发版本。如果你对生产版本有特定要求，
你需要相应地调整你的 Gradle 配置。为此，请将以下编译器选项添加到 `wasmJs {}` 代码块：

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        // ...

        compilerOptions {
            freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
        }
    }
}
```

### 支持 DWARF 调试 Kotlin/Wasm 代码

Kotlin 2.1.20 在 Kotlin/Wasm 中引入了对 DWARF（任意记录格式调试）的支持。

通过此更改，Kotlin/Wasm 编译器能够将 DWARF 数据嵌入到生成的 WebAssembly (Wasm) 二进制文件中。
许多调试器和虚拟机可以读取此数据，以提供对编译代码的洞察。

DWARF 主要用于在独立 Wasm 虚拟机 (VM) 中调试 Kotlin/Wasm 应用程序。要使用此功能，Wasm VM 和调试器必须支持 DWARF。

借助 DWARF 支持，你可以单步调试 Kotlin/Wasm 应用程序、检查变量并获得代码洞察。要启用此功能，请使用以下编译器选项：

```bash
-Xwasm-generate-dwarf
```
### Kotlin/Wasm 和 Kotlin/JS 属性迁移到 Provider API

之前，Kotlin/Wasm 和 Kotlin/JS 扩展中的属性是可变的 (`var`)，并直接在构建脚本中赋值：

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

现在，属性通过 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) 公开，
并且你必须使用 `.set()` 函数来赋值：

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API 确保值是延迟计算的，并与任务依赖项正确集成，从而提高了构建性能。

通过此更改，直接属性赋值已被弃用，取而代之的是 `*EnvSpec` 类，
例如 `NodeJsEnvSpec` 和 `YarnRootEnvSpec`。

此外，为了避免混淆，还移除了几个别名任务：

| Deprecated task        | Replacement                                                     |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` or `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` or `jsBrowserDistribution`         |

如果你只在构建脚本中使用 Kotlin/JS 或 Kotlin/Wasm，则无需采取任何操作，因为 Gradle 会自动处理赋值。

但是，如果你维护一个基于 Kotlin Gradle Plugin 的插件，并且你的插件没有应用 `kotlin-dsl`，
你必须更新属性赋值以使用 `.set()` 函数。

## Gradle

Kotlin 2.1.20 完全兼容 Gradle 7.6.3 到 8.11。你也可以使用直到最新 Gradle
发布版本的 Gradle。但是，请注意，这样做可能会导致弃用警告，并且某些新的 Gradle 功能可能无法工作。

此版本的 Kotlin 包含 Kotlin Gradle 插件与 Gradle 的隔离项目 (Isolated Projects) 的兼容性，以及对
自定义 Gradle 发布变体 (publication variants) 的支持。

### Kotlin Gradle 插件与 Gradle 隔离项目兼容
<primary-label ref="experimental-opt-in"/>

> 此功能目前在 Gradle 中处于预 Alpha 阶段。目前不支持 JS 和 Wasm 目标。
> 仅在 Gradle 8.10 或更高版本中使用此功能，且仅用于评估目的。
>
{style="warning"}

自 Kotlin 2.1.0 以来，你已经能够在项目中[预览 Gradle 的隔离项目功能](whatsnew21.md#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

之前，你需要配置 Kotlin Gradle 插件，使你的项目与隔离项目 (Isolated Projects)
功能兼容，然后才能尝试它。在 Kotlin 2.1.20 中，不再需要此额外步骤。

现在，要启用隔离项目 (Isolated Projects) 功能，你只需[设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

Gradle 的隔离项目 (Isolated Projects) 功能在 Kotlin Gradle 插件中得到了支持，适用于多平台项目和只包含 JVM 或 Android 目标的项目。

特别对于多平台项目，如果你在升级后发现 Gradle 构建有问题，你可以通过添加以下内容来选择退出
新的 Kotlin Gradle 插件行为：

```none
kotlin.kmp.isolated-projects.support=disable
```

但是，如果你在多平台项目中使用此 Gradle 属性，则无法使用隔离项目 (Isolated Projects) 功能。

请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中告知我们你对此功能的体验。

### 支持添加自定义 Gradle 发布变体
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 引入了对添加自定义 [Gradle 发布变体 (publication variants)](https://docs.gradle.org/current/userguide/variant_attributes.html) 的支持。
此功能适用于多平台项目和针对 JVM 的项目。

> 你无法使用此功能修改现有的 Gradle 变体。
>
{style="note"}

此功能是[实验性 (Experimental) 的](components-stability.md#stability-levels-explained)。
要选择启用，请使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 注解。

要添加自定义 Gradle 发布变体，请调用 `adhocSoftwareComponent()` 函数，它返回一个
[`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) 实例，
你可以在 Kotlin DSL 中配置它：

```kotlin
plugins {
    // Only JVM and Multiplatform are supported
    kotlin("jvm")
    // or
    kotlin("multiplatform")
}

kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    publishing {
        // Returns an instance of AdhocSoftwareComponent
        adhocSoftwareComponent()
        // Alternatively, you can configure AdhocSoftwareComponent in the DSL block as follows
        adhocSoftwareComponent {
            // Add your custom variants here using the AdhocSoftwareComponent API
        }
    }
}
```

> 有关变体的更多信息，请参阅 Gradle 的[自定义发布指南](https://docs.gradle.org/current/userguide/publishing_customization.html)。
>
{style="tip"}

## 标准库

此版本为标准库带来了新的实验性 (Experimental) 功能：通用原子类型、改进的 UUID 支持以及新的时间跟踪功能。

### 通用原子类型
<primary-label ref="experimental-opt-in"/>

在 Kotlin 2.1.20 中，我们将在标准库的 `kotlin.concurrent.atomics`
包中引入通用原子类型，为线程安全操作启用共享的、平台无关的代码。这通过消除在不同源集之间重复原子依赖逻辑的需要，简化了 Kotlin
多平台项目的开发。

`kotlin.concurrent.atomics` 包及其属性是[实验性 (Experimental) 的](components-stability.md#stability-levels-explained)。
要选择启用，请使用 `@OptIn(ExperimentalAtomicApi::class)` 注解或编译器选项 `-opt-in=kotlin.ExperimentalAtomicApi`。

以下示例展示了如何使用 `AtomicInt` 安全地计算多个线程中已处理的项：

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // Initializes the atomic counter for processed items
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // Splits the items into chunks for processing by multiple coroutines
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("Processing $item in thread ${Thread.currentThread()}")
                    processedItems += 1 // Increment counter atomically
                }
            }
         }
    }
//sampleEnd
    // Prints the total number of processed items
    println("Total processed items: ${processedItems.load()}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

为了实现 Kotlin 原子类型与 Java 的 [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html)
原子类型之间的无缝互操作性，API 提供了 `.asJavaAtomic()` 和 `.asKotlinAtomic()` 扩展函数。在 JVM 上，Kotlin
原子类型和 Java 原子类型在运行时是相同的类型，因此你可以将 Java 原子类型转换为 Kotlin 原子类型，反之亦然，而不会产生任何开销。

以下示例展示了 Kotlin 和 Java 原子类型如何协同工作：

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // Converts Kotlin AtomicInt to Java's AtomicInteger
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java atomic value: ${javaAtomic.get()}")
    // Java atomic value: 42

    // Converts Java's AtomicInteger back to Kotlin's AtomicInt
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin atomic value: ${kotlinAgain.load()}")
    // Kotlin atomic value: 42
}
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### UUID 解析、格式化和可比性方面的更改
<primary-label ref="experimental-opt-in"/>

JetBrains 团队持续改进对 [2.0.20 中引入标准库的](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library) UUID 的支持。

之前，`parse()` 函数只接受十六进制带短划线 (hex-and-dash) 格式的 UUID。在 Kotlin 2.1.20 中，
你可以将 `parse()` 用于_两种_格式：十六进制带短划线和纯十六进制（不带短划线）。

在此版本中，我们还引入了专门用于处理十六进制带短划线格式的函数：

*   `parseHexDash()` 从十六进制带短划线格式解析 UUID。
*   `toHexDashString()` 将 `Uuid` 转换为十六进制带短划线格式的 `String`（与 `toString()` 的功能相同）。

这些函数的工作方式类似于 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html)
和 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html)，它们是
之前为十六进制格式引入的。明确的解析和格式化功能命名应该会提高代码清晰度，并改善你使用 UUID 的整体体验。

Kotlin 中的 UUID 现在是 `Comparable` 类型。从 Kotlin 2.1.20 开始，你可以直接比较和排序 `Uuid`
类型的值。这使得可以使用 `<` 和 `>` 运算符以及标准库中专门为
`Comparable` 类型或其集合（例如 `sorted()`）提供的扩展，并且还允许将 UUID 传递给任何需要 `Comparable` 接口的函数或 API。

请记住，标准库中的 UUID 支持仍处于[实验性 (Experimental) 阶段](components-stability.md#stability-levels-explained)。
要选择启用，请使用 `@OptIn(ExperimentalUuidApi::class)` 注解或编译器选项 `-opt-in=kotlin.uuid.ExperimentalUuidApi`：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse() accepts a UUID in a plain hexadecimal format
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // Converts it to the hex-and-dash format
    val hexDashFormat = uuid.toHexDashString()
 
    // Outputs the UUID in the hex-and-dash format
    println(hexDashFormat)

    // Outputs UUIDs in ascending order
    println(
        listOf(
            uuid,
            Uuid.parse("780e8400e29b41d4a716446655440005"),
            Uuid.parse("5ab88400e29b41d4a716446655440076")
        ).sorted()
    )
   }
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### 新的时间跟踪功能
<primary-label ref="experimental-opt-in"/>

从 Kotlin 2.1.20 开始，标准库提供了表示时间点的功能。此功能
以前仅在 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/)（一个官方的 Kotlin 库）中可用。

[`kotlinx.datetime.Clock`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/) 接口
作为 `kotlin.time.Clock` 被引入标准库，而 [`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/)
类则作为 `kotlin.time.Instant` 被引入。这些概念与标准库中的 `time` 包自然地保持一致，因为
它们只关注时间点，而更复杂的日历和时区功能则保留在 `kotlinx-datetime` 中。

`Instant` 和 `Clock` 在你需要精确时间跟踪而无需考虑时区或日期时非常有用。例如，
你可以使用它们记录带时间戳的事件，测量两个时间点之间的持续时间，以及获取系统进程的当前时间点。

为了提供与其他语言的互操作性，还提供了额外的转换函数：

*   `.toKotlinInstant()` 将时间值转换为 `kotlin.time.Instant` 实例。
*   `.toJavaInstant()` 将 `kotlin.time.Instant` 值转换为 `java.time.Instant` 值。
*   `Instant.toJSDate()` 将 `kotlin.time.Instant` 值转换为 JS `Date` 类的一个实例。此转换
    不精确；JS 使用毫秒精度表示日期，而 Kotlin 允许纳秒分辨率。

标准库的新时间功能仍处于[实验性 (Experimental) 阶段](components-stability.md#stability-levels-explained)。
要选择启用，请使用 `@OptIn(ExperimentalTime::class)` 注解：

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // Get the current moment in time
    val currentInstant = Clock.System.now()
    println("Current time: $currentInstant")

    // Find the difference between two moments in time
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("Time elapsed since 2023-01-01: $duration")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

有关实现的更多信息，请参阅此 [KEEP 提案](https://github.com/Kotlin/KEEP/pull/387/files)。

## Compose 编译器

在 2.1.20 中，Compose 编译器放宽了先前版本中引入的对 `@Composable` 函数的一些限制。
此外，Compose 编译器 Gradle 插件默认设置为包含源信息，使所有平台上的行为与 Android 对齐。

### 支持开放的 `@Composable` 函数中的默认参数

编译器之前限制了开放的 `@Composable` 函数中的默认参数，因为不正确的编译器输出会导致
运行时崩溃。现在，底层问题已解决，当与 Kotlin 2.1.20 或更高版本一起使用时，默认参数将得到完全支持。

Compose 编译器在 [1.5.8 版本](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8)之前允许开放函数中的默认参数，
因此支持取决于项目配置：

*   如果开放的可组合函数使用 Kotlin 2.1.20 或更高版本编译，编译器会为默认参数生成正确的包装器。这包括与 1.5.8 之前的二进制文件兼容的包装器，这意味着下游库也能够使用此开放函数。
*   如果开放的可组合函数使用早于 2.1.20 的 Kotlin 版本编译，Compose 将使用兼容模式，这
    可能会导致运行时崩溃。在使用兼容模式时，编译器会发出警告以突出显示潜在问题。

### 最终重写函数允许可重启

虚拟函数（`open` 和 `abstract` 的重写，包括接口）[在 2.1.0 版本中被强制设置为不可重启](whatsnew21.md#changes-to-open-and-overridden-composable-functions)。
现在，对于作为 `final` 类成员或本身就是 `final` 的函数，此限制已放宽 – 它们将
照常重启或跳过。

升级到 Kotlin 2.1.20 后，你可能会在受影响的函数中观察到一些行为变化。要强制使用前一版本的不可重启
逻辑，请将 `@NonRestartableComposable` 注解应用于该函数。

### `ComposableSingletons` 从公共 API 中移除

`ComposableSingletons` 是 Compose 编译器在优化 `@Composable` lambda 表达式时创建的一个类。不捕获任何参数的 lambda 表达式会
分配一次并缓存在类的属性中，从而在运行时节省分配。
该类以内部可见性生成，仅用于优化编译单元（通常是一个文件）内的 lambda 表达式。

然而，此优化也应用于 `inline` 函数体，这导致单例 lambda 实例
泄漏到公共 API 中。为了解决这个问题，从 2.1.20 开始，`@Composable` lambda 表达式不再在内联函数中优化为单例。
同时，Compose 编译器将继续为内联函数生成单例类
和 lambda 表达式，以支持在先前模型下编译的模块的二进制兼容性。

### 默认包含源信息

Compose 编译器 Gradle 插件在 Android 上已经默认启用了[包含源信息](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html)
功能。从 Kotlin 2.1.20 开始，此功能将在所有平台默认启用。

请记住检查你是否使用 `freeCompilerArgs` 设置了此选项。如果与插件一起使用，这种方法可能会导致构建失败，
因为一个选项实际上被设置了两次。

## 破坏性变更和弃用

*   为了使 Kotlin 多平台与 Gradle 的未来更改保持一致，我们正在逐步淘汰 `withJava()` 函数。
    [Java 源集现在默认创建](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#java-source-sets-created-by-default)。如果你使用 [Java 测试夹具](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 插件，
    请直接升级到 [Kotlin 2.1.21](releases.md#release-details) 以避免兼容性问题。
*   JetBrains 团队正在继续弃用 `kotlin-android-extensions` 插件。如果你尝试在项目中使用它，
    你现在将收到配置错误，并且不会执行任何插件代码。
*   旧版 `kotlin.incremental.classpath.snapshot.enabled` 属性已从 Kotlin Gradle 插件中移除。
    该属性曾用于提供在 JVM 上回退到内置 ABI 快照的机会。该插件现在使用
    其他方法来检测和避免不必要的重新编译，从而使该属性过时。

## 文档更新

Kotlin 文档进行了一些显著更改：

### 重新设计和新增的页面

*   [Kotlin 路线图](roadmap.md) – 查看 Kotlin 在语言和生态系统演进方面的优先事项更新列表。
*   [Gradle 最佳实践](gradle-best-practices.md) 页面 – 了解优化 Gradle
    构建和提高性能的基本最佳实践。
*   [Compose Multiplatform 和 Jetpack Compose](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-and-jetpack-compose.html)
    – 概述这两个 UI 框架之间的关系。
*   [Kotlin Multiplatform 和 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html)
    – 查看两个流行跨平台框架的比较。
*   [与 C 互操作](native-c-interop.md) – 探索 Kotlin 与 C 互操作的详细信息。
*   [数字](numbers.md) – 了解用于表示数字的不同 Kotlin 类型。

### 新增和更新的教程

*   [将你的库发布到 Maven Central](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
    – 了解如何将 KMP 库构件发布到最流行的 Maven 仓库。
*   [Kotlin/Native 作为动态库](native-dynamic-libraries.md) – 创建一个动态 Kotlin 库。
*   [Kotlin/Native 作为 Apple 框架](apple-framework.md) – 创建你自己的框架，并在 macOS 和 iOS 上的 Swift/Objective-C 应用程序中使用 Kotlin/Native 代码。

## 如何更新到 Kotlin 2.1.20

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件作为
捆绑插件包含在你的 IDE 中。这意味着你无法再从 JetBrains Marketplace 安装该插件。

要更新到新的 Kotlin 版本，请在构建脚本中将 [Kotlin 版本](releases.md#update-to-a-new-kotlin-version)更改为 2.1.20。