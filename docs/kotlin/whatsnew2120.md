[//]: # (title: Kotlin 2.1.20 最新变化)

<web-summary>阅读 Kotlin 2.1.20 发布说明，涵盖新的语言功能、Kotlin Multiplatform、JVM、Native、JS 与 Wasm 的更新，以及对 Gradle 和 Maven 的构建工具支持。</web-summary>

_[发布日期：2025 年 3 月 20 日](releases.md#release-history)_

Kotlin 2.1.20 现已发布！以下是主要亮点：

* **K2 编译器更新**：[对新 kapt 和 Lombok 插件的更新](#kotlin-k2-compiler)
* **Kotlin Multiplatform**：[用于替代 Gradle Application 插件的新 DSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* **Kotlin/Native**：[支持 Xcode 16.3 和新的内联优化](#kotlin-native)
* **Kotlin/Wasm**：[默认启用自定义格式化程序、支持 DWARF 以及向 Provider API 的迁移](#kotlin-wasm)
* **Gradle 支持**：[与 Gradle 的 Isolated Projects 以及自定义发布变体的兼容性](#gradle)
* **标准库**：[通用原子类型、改进的 UUID 支持以及新的时间跟踪功能](#standard-library)
* **Compose 编译器**：[放宽了对 `@Composable` 函数的限制及其他更新](#compose-compiler)
* **文档**：[Kotlin 文档的显著改进](#documentation-updates)。

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## IDE 支持

支持 2.1.20 的 Kotlin 插件已捆绑在最新的 IntelliJ IDEA 和 Android Studio 中。
您无需更新 IDE 中的 Kotlin 插件。
您只需在构建脚本中将 Kotlin 版本更改为 2.1.20 即可。

有关详情，请参阅[更新至新版本](releases.md#update-to-a-new-kotlin-version)。

### 为具有 OSGi 支持的项目下载 Kotlin 构件源码

`kotlin-osgi-bundle` 库的所有依赖项源码现在都已包含在其分发包中。这使得 IntelliJ IDEA 能够下载这些源码，从而为 Kotlin 符号提供文档并改进调试体验。

## Kotlin K2 编译器

我们正在继续改进新 Kotlin K2 编译器的插件支持。此版本带来了对新 kapt 和 Lombok 插件的更新。

### 新的默认 kapt 插件
<primary-label ref="beta"/>

从 Kotlin 2.1.20 开始，kapt 编译插件的 K2 实现已为所有项目默认启用。

JetBrains 团队早在 Kotlin 1.9.20 中就随 K2 编译器推出了 kapt 插件的新实现。
自那时起，我们进一步开发了 K2 kapt 的内部实现，使其行为与 K1 版本相似，同时显著提升了其性能。

如果您在将 kapt 与 K2 编译器配合使用时遇到任何问题，可以暂时还原到之前的插件实现。

为此，请将以下选项添加到项目的 `gradle.properties` 文件中：

```kotlin
kapt.use.k2=false
```

请向我们的[问题跟踪器](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)报告任何问题。

### Lombok 编译器插件：支持 `@SuperBuilder` 以及 `@Builder` 的更新
<primary-label ref="experimental-general"/>

[Kotlin Lombok 编译器插件](lombok.md)现在支持 `@SuperBuilder` 注解，从而更轻松地为类层次结构创建生成器。以前，在 Kotlin 中使用 Lombok 的开发者在处理继承时必须手动定义生成器。通过使用 `@SuperBuilder`，生成器会自动继承超类字段，允许您在构造对象时初始化它们。

此外，此更新还包括几项改进和错误修复：

* `@Builder` 注解现在可用于构造函数，从而实现更灵活的对象创建。有关更多详细信息，请参阅相应的 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-71547)。
* 解决了几个与 Kotlin 中 Lombok 代码生成相关的问题，提高了整体兼容性。有关更多详细信息，请参阅 [GitHub 变更日志](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)。

有关 `@SuperBuilder` 注解的更多信息，请参阅官方 [Lombok 文档](https://projectlombok.org/features/experimental/SuperBuilder)。

## Kotlin Multiplatform：用于替代 Gradle Application 插件的新 DSL
<primary-label ref="experimental-opt-in"/>

从 Gradle 8.7 开始，[Application](https://docs.gradle.org/current/userguide/application_plugin.html) 插件不再与 Kotlin Multiplatform Gradle 插件兼容。Kotlin 2.1.20 引入了一个实验性 DSL 来实现类似的功能。新的 `executable {}` 代码块为 JVM 目标配置执行任务和 Gradle [分发 (distributions)](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)。

在构建脚本中的 `executable {}` 代码块之前，请添加以下 `@OptIn` 注解：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

例如：

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // 配置一个名为 "runJvm" 的 JavaExec 任务，以及此目标中 "main" 编译的 Gradle 分发
            executable {
                mainClass.set("foo.MainKt")
            }

            // 配置一个名为 "runJvmAnother" 的 JavaExec 任务，以及 "main" 编译的 Gradle 分发
            executable(KotlinCompilation.MAIN_COMPILATION_NAME, "another") {
                // 设置一个不同的类
                mainClass.set("foo.MainAnotherKt")
            }

            // 配置一个名为 "runJvmTest" 的 JavaExec 任务，以及 "test" 编译的 Gradle 分发
            executable(KotlinCompilation.TEST_COMPILATION_NAME) {
                mainClass.set("foo.MainTestKt")
            }

            // 配置一个名为 "runJvmTestAnother" 的 JavaExec 任务，以及 "test" 编译的 Gradle 分发
            executable(KotlinCompilation.TEST_COMPILATION_NAME, "another") {
                mainClass.set("foo.MainAnotherTestKt")
            }
        }
    }
}
```

在此示例中，Gradle 的 [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) 插件被应用于第一个 `executable {}` 代码块。

如果您遇到任何问题，请在我们的[问题跟踪器](https://kotl.in/issue)中报告，或在我们的[公开 Slack 频道](https://kotlinlang.slack.com/archives/C19FD9681)中告知我们。

## Kotlin/Native

### 支持 Xcode 16.3

从 Kotlin **2.1.21** 开始，Kotlin/Native 编译器支持 Xcode 16.3 —— Xcode 的最新稳定版本。
欢迎更新您的 Xcode，并继续在适用于 Apple 操作系统的 Kotlin 项目上开展工作。

2.1.21 版本还修复了相关的 [cinterop 问题](https://youtrack.jetbrains.com/issue/KT-75781/)，该问题曾导致 Kotlin Multiplatform 项目中的编译失败。

### 新的内联优化
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 引入了一个新的内联优化阶段，该阶段位于实际的代码生成阶段之前。

Kotlin/Native 编译器中的新内联阶段应该比标准 LLVM 内联器表现更好，并提高生成代码的运行时性能。

新的内联阶段目前处于[实验性](components-stability.md#stability-levels-explained)阶段。要试用它，请使用以下编译器选项：

```none
-Xbinary=preCodegenInlineThreshold=40
```

我们的实验表明，将阈值设置为 40 个令牌（由编译器解析的代码单元）可以在编译优化方面提供合理的折中。根据我们的基准测试，这带来了 9.5% 的整体性能提升。当然，您也可以尝试其他值。

如果您遇到二进制文件大小增加或编译时间延长的情况，请通过 [YouTrack](https://kotl.in/issue) 报告此类问题。

## Kotlin/Wasm

此版本改进了 Kotlin/Wasm 的调试和属性用法。自定义格式化程序现在可以在开发构建中开箱即用，而 DWARF 调试则促进了代码检查。此外，Provider API 简化了 Kotlin/Wasm 和 Kotlin/JS 中的属性用法。

### 默认启用自定义格式化程序

以前，您必须[手动配置](whatsnew21.md#improved-debugging-experience-for-kotlin-wasm)自定义格式化程序，以便在处理 Kotlin/Wasm 代码时改进 Web 浏览器中的调试体验。

在此版本中，开发构建中默认启用了自定义格式化程序，因此您不需要额外的 Gradle 配置。

要使用此功能，您只需确保在浏览器的开发者工具中启用了自定义格式化程序：

* 在 Chrome DevTools 中，在 **Settings | Preferences | Console** 中找到自定义格式化程序复选框：

  ![在 Chrome 中启用自定义格式化程序](wasm-custom-formatters-chrome.png){width=400}

* 在 Firefox DevTools 中，在 **Settings | Advanced settings** 中找到自定义格式化程序复选框：

  ![在 Firefox 中启用自定义格式化程序](wasm-custom-formatters-firefox.png){width=400}

此更改主要影响 Kotlin/Wasm 开发构建。如果您对生产构建有特定要求，则需要相应地调整 Gradle 配置。为此，请将以下编译器选项添加到 `wasmJs {}` 代码块中：

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

### 支持使用 DWARF 调试 Kotlin/Wasm 代码

Kotlin 2.1.20 引入了对 Kotlin/Wasm 中 DWARF（debugging with arbitrary record format）的支持。

通过此更改，Kotlin/Wasm 编译器能够将 DWARF 数据嵌入到生成的 WebAssembly (Wasm) 二进制文件中。许多调试器和虚拟机可以读取这些数据，以提供对编译后代码的洞察。

DWARF 主要用于在独立的 Wasm 虚拟机 (VM) 中调试 Kotlin/Wasm 应用程序。要使用此功能，Wasm VM 和调试器必须支持 DWARF。

借助 DWARF 支持，您可以逐步执行 Kotlin/Wasm 应用程序、检查变量并获得代码洞察。要启用此功能，请使用以下编译器选项：

```bash
-Xwasm-generate-dwarf
```
### 向用于 Kotlin/Wasm 和 Kotlin/JS 属性的 Provider API 迁移

以前，Kotlin/Wasm 和 Kotlin/JS 扩展中的属性是可变的 (`var`)，并直接在构建脚本中赋值：

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

现在，属性通过 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) 公开，您必须使用 `.set()` 函数来赋值：

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API 确保值是延迟计算的，并与任务依赖项正确集成，从而提高构建性能。

通过此更改，直接属性赋值已被弃用，取而代之的是 `*EnvSpec` 类，例如 `NodeJsEnvSpec` 和 `YarnRootEnvSpec`。

此外，还删除了几个别名任务以避免混淆：

| 已弃用的任务 | 替代项 |
|------------------------|-----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                   |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                      |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` 或 `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                       |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                       |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                          |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` 或 `jsBrowserDistribution`         |

如果您仅在构建脚本中使用 Kotlin/JS 或 Kotlin/Wasm，则不需要采取任何操作，因为 Gradle 会自动处理赋值。

但是，如果您维护基于 Kotlin Gradle 插件的插件，并且您的插件未应用 `kotlin-dsl`，则必须更新属性赋值以使用 `.set()` 函数。

## Gradle

Kotlin 2.1.20 与 Gradle 7.6.3 到 8.11 完全兼容。您也可以使用截至最新发布的 Gradle 版本。但请注意，这样做可能会导致弃用警告，并且某些新的 Gradle 功能可能无法正常工作。

此版本的 Kotlin 包括 Kotlin Gradle 插件与 Gradle 的 Isolated Projects 的兼容性，以及对自定义 Gradle 发布变体的支持。

### Kotlin Gradle 插件与 Gradle 的 Isolated Projects 兼容
<primary-label ref="experimental-opt-in"/>

> 此功能目前在 Gradle 中处于 pre-Alpha 状态。目前不支持 JS 和 Wasm 目标。
> 请仅在 Gradle 8.10 或更高版本中使用它，且仅用于评估目的。
>
{style="warning"}

自 Kotlin 2.1.0 起，您已经能够在项目中[预览 Gradle 的 Isolated Projects 功能](whatsnew21.md#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

以前，您必须配置 Kotlin Gradle 插件使您的项目与 Isolated Projects 功能兼容，然后才能试用它。在 Kotlin 2.1.20 中，这一额外步骤不再必要。

现在，要启用 Isolated Projects 功能，您只需[设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

Gradle 的 Isolated Projects 功能在多平台项目以及仅包含 JVM 或 Android 目标的项目的 Kotlin Gradle 插件中均受支持。

专门针对多平台项目，如果您在升级后发现 Gradle 构建出现问题，可以通过添加以下内容来退出新的 Kotlin Gradle 插件行为：

```none
kotlin.kmp.isolated-projects.support=disable
```

但是，如果您在多平台项目中使用此 Gradle 属性，则无法使用 Isolated Projects 功能。

请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中告知我们您对该功能的体验。

### 支持添加自定义 Gradle 发布变体
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 引入了对添加自定义 [Gradle 发布变体 (publication variants)](https://docs.gradle.org/current/userguide/variant_attributes.html) 的支持。此功能适用于多平台项目和针对 JVM 的项目。

> 您不能使用此功能修改现有的 Gradle 变体。
>
{style="note"}

此功能是[实验性](components-stability.md#stability-levels-explained)的。
要启用它，请使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 注解。

要添加自定义 Gradle 发布变体，请调用 `adhocSoftwareComponent()` 函数，该函数会返回 [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) 的一个实例，您可以在 Kotlin DSL 中对其进行配置：

```kotlin
plugins {
    // 仅支持 JVM 和 Multiplatform
    kotlin("jvm")
    // 或
    kotlin("multiplatform")
}

kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    publishing {
        // 返回 AdhocSoftwareComponent 的一个实例
        adhocSoftwareComponent()
        // 或者，您可以按照如下方式在 DSL 代码块中配置 AdhocSoftwareComponent
        adhocSoftwareComponent {
            // 在此处使用 AdhocSoftwareComponent API 添加您的自定义变体
        }
    }
}
```

> 有关变体的更多信息，请参阅 Gradle 的[自定义发布指南](https://docs.gradle.org/current/userguide/publishing_customization.html)。
>
{style="tip"}

## 标准库

此版本为标准库带来了新的实验性功能：通用原子类型、改进的 UUID 支持以及新的时间跟踪功能。

### 通用原子类型
<primary-label ref="experimental-opt-in"/>

在 Kotlin 2.1.20 中，我们正在标准库的 `kotlin.concurrent.atomics` 软件包中引入通用原子类型，从而实现用于线程安全操作的共享且平台无关的代码。这通过消除在不同源集中重复依赖原子的逻辑的需求，简化了 Kotlin Multiplatform 项目的开发。

`kotlin.concurrent.atomics` 软件包及其属性是[实验性](components-stability.md#stability-levels-explained)的。要启用它，请使用 `@OptIn(ExperimentalAtomicApi::class)` 注解或编译器选项 `-opt-in=kotlin.ExperimentalAtomicApi`。

以下示例展示了如何使用 `AtomicInt` 在多个线程中安全地统计已处理的项：

```kotlin
// 导入必要的库
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // 为处理项初始化原子计数器
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // 将项拆分为块，以便由多个协程处理
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("Processing $item in thread ${Thread.currentThread()}")
                    processedItems += 1 // 原子地增加计数器
                }
            }
         }
    }
//sampleEnd
    // 打印已处理项的总数
    println("Total processed items: ${processedItems.load()}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

为了实现 Kotlin 原子类型与 Java [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html) 原子类型之间的无缝互操作性，该 API 提供了 `.asJavaAtomic()` 和 `.asKotlinAtomic()` 扩展函数。在 JVM 上，Kotlin 原子和 Java 原子在运行时是相同的类型，因此您可以将 Java 原子转换为 Kotlin 原子，反之亦然，且没有任何开销。

以下示例展示了 Kotlin 和 Java 原子类型如何协同工作：

```kotlin
// 导入必要的库
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // 将 Kotlin 的 AtomicInt 转换为 Java 的 AtomicInteger
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java atomic value: ${javaAtomic.get()}")
    // Java atomic value: 42

    // 将 Java 的 AtomicInteger 转换回 Kotlin 的 AtomicInt
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin atomic value: ${kotlinAgain.load()}")
    // Kotlin atomic value: 42
}
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### UUID 解析、格式化与可比性变更
<primary-label ref="experimental-opt-in"/>

JetBrains 团队继续改进对 [2.0.20 中引入标准库的 UUID](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library) 的支持。

以前，`parse()` 函数仅接受十六进制带连字符 (hex-and-dash) 格式的 UUID。在 Kotlin 2.1.20 中，您可以将 `parse()` 用于十六进制带连字符和纯十六进制（不带连字符）格式。

我们还在该版本中引入了专门用于十六进制带连字符格式操作的函数：

* `parseHexDash()` 从十六进制带连字符格式解析 UUID。
* `toHexDashString()` 将 `Uuid` 转换为十六进制带连字符格式的 `String`（镜像了 `toString()` 的功能）。

这些函数的工作方式类似于之前为十六进制格式引入的 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) 和 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html)。针对解析和格式化功能的显式命名应该会提高代码的清晰度以及您在使用 UUID 时的整体体验。

Kotlin 中的 UUID 现在是 `Comparable`（可比较）的。从 Kotlin 2.1.20 开始，您可以直接比较和排序 `Uuid` 类型的值。这使得可以使用 `<` 和 `>` 运算符以及专门用于 `Comparable` 类型或其集合的标准库扩展（例如 `sorted()`），并且还允许将 UUID 传递给任何需要 `Comparable` 接口的函数或 API。

请记住，标准库中的 UUID 支持仍处于[实验性](components-stability.md#stability-levels-explained)阶段。要启用它，请使用 `@OptIn(ExperimentalUuidApi::class)` 注解或编译器选项 `-opt-in=kotlin.uuid.ExperimentalUuidApi`：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse() 接受纯十六进制格式的 UUID
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // 将其转换为十六进制带连字符格式
    val hexDashFormat = uuid.toHexDashString()
 
    // 输出十六进制带连字符格式的 UUID
    println(hexDashFormat)

    // 按升序输出 UUID
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

从 Kotlin 2.1.20 开始，标准库提供了表示时间点的能力。此功能以前仅在 Kotlin 官方库 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 中可用。

`kotlinx.datetime.Clock` 接口作为 [`kotlin.time.Clock`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/-clock/) 被引入标准库，`kotlinx.datetime.Instant` 类作为 [`kotlin.time.Instant`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/-instant/) 被引入。这些概念自然地与标准库中的 `time` 软件包保持一致，因为它们仅关注时间点，而更复杂的日历和时区功能仍保留在 `kotlinx-datetime` 中。

当您需要精确的时间跟踪而无需考虑时区或日期时，`Instant` 和 `Clock` 非常有用。例如，您可以使用它们记录带有时间戳的事件、测量两个时间点之间的时间间隔，以及获取系统进程的当前时刻。

为了提供与其他语言的互操作性，提供了额外的转换函数：

* [`.toKotlinInstant()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-kotlin-instant.html) 将时间值转换为 `kotlin.time.Instant` 实例。
* [`.toJavaInstant()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-java-instant.html) 将 `kotlin.time.Instant` 值转换为 `java.time.Instant` 值。
* [`Instant.toJSDate()`](https://kotlinlang.org/api/core/2.1/kotlin-stdlib/kotlin.time/to-j-s-date.html) 将 `kotlin.time.Instant` 值转换为 JS `Date` 类的实例。此转换是不精确的；JS 使用毫秒精度表示日期，而 Kotlin 允许纳秒分辨率。

标准库的新时间功能仍处于[实验性](components-stability.md#stability-levels-explained)阶段。要启用它，请使用 `@OptIn(ExperimentalTime::class)` 注解：

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // 获取当前时间点
    val currentInstant = Clock.System.now()
    println("Current time: $currentInstant")

    // 计算两个时间点之间的差值
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("Time elapsed since 2023-01-01: $duration")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

有关实现的更多信息，请参阅此 [KEEP 提案](https://github.com/Kotlin/KEEP/pull/387/files)。

## Compose 编译器

在 2.1.20 中，Compose 编译器放宽了之前版本中对 `@Composable` 函数引入的一些限制。此外，Compose 编译器 Gradle 插件被设置为默认包含源信息，从而使所有平台上的行为与 Android 保持一致。

### 支持在 open `@Composable` 函数中使用带有默认值的形参

由于之前编译器输出不正确会导致运行时崩溃，编译器限制了在 open `@Composable` 函数中使用带有默认值的形参。根本问题现已解决，当与 Kotlin 2.1.20 或更高版本配合使用时，带有默认值的形参将得到完全支持。

Compose 编译器在 [1.5.8 版本](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8)之前允许在 open 函数中使用带有默认值的形参，因此支持情况取决于项目配置：

* 如果一个 open 可组合函数是使用 Kotlin 2.1.20 或更高版本编译的，编译器会为带有默认值的形参生成正确的包装器。这包括与 1.5.8 之前的二进制文件兼容的包装器，这意味着下游库也将能够使用该 open 函数。
* 如果该 open 可组合函数是使用早于 2.1.20 的 Kotlin 版本编译的，Compose 会使用兼容模式，这可能会导致运行时崩溃。在使用兼容模式时，编译器会发出警告以突出潜在问题。

### 允许将 final 重写函数设为可重新启动 (restartable)

虚拟函数（对 `open` 和 `abstract` 的重写，包括接口）[在 2.1.0 版本中被强制要求不可重新启动](whatsnew21.md#changes-to-open-and-overridden-composable-functions)。现在，对于作为 final 类的成员或其本身为 `final` 的函数，这一限制已放宽——它们将像往常一样被重新启动或跳过。

升级到 Kotlin 2.1.20 后，您可能会观察到受影响函数的一些行为变化。要强制执行上一个版本中的不可重新启动逻辑，请将 `@NonRestartableComposable` 注解应用于该函数。

### `ComposableSingletons` 从公共 API 中移除

`ComposableSingletons` 是 Compose 编译器在优化 `@Composable` lambda 时创建的一个类。不捕获任何形参的 lambda 只会被分配一次，并缓存到该类的一个属性中，从而节省运行时的分配开销。该类在生成时具有 internal 可见性，仅旨在用于优化编译单元（通常是一个文件）内部的 lambda。

但是，此优化以前也应用于 `inline` 函数体，导致单例 lambda 实例泄露到公共 API 中。为了解决这个问题，从 2.1.20 开始，内联函数内部的 `@Composable` lambda 不再被优化为单例。同时，Compose 编译器将继续为内联函数生成单例类和 lambda，以支持与根据旧模型编译的模块的二进制兼容性。

### 默认包含源信息

Compose 编译器 Gradle 插件在 Android 上已默认启用[包含源信息](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html)功能。从 Kotlin 2.1.20 开始，此功能将在所有平台上默认启用。

请记得检查您是否使用了 `freeCompilerArgs` 设置此选项。由于该选项实际上被设置了两次，此方法在与插件一起使用时可能会导致构建失败。

## 破坏性变更与弃用

* 为了使 Kotlin Multiplatform 与 Gradle 即将发生的变更保持一致，我们正在逐步取消 `withJava()` 函数。[Java 源集现在默认创建](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#java-source-sets-created-by-default)。如果您使用了 [Java 测试装置 (test fixtures)](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 插件，请直接升级到 [Kotlin 2.1.21](releases.md#release-history) 以避免兼容性问题。
* JetBrains 团队正在推进 `kotlin-android-extensions` 插件的弃用工作。如果您尝试在项目中使用它，现在会收到配置错误，并且不会执行任何插件代码。
* `kotlin.incremental.classpath.snapshot.enabled` 旧有属性已从 Kotlin Gradle 插件中移除。该属性曾用于提供回退到 JVM 上内置 ABI 快照的机会。该插件现在使用其他方法来检测和避免不必要的重新编译，从而使该属性过时。

## 文档更新

Kotlin 文档进行了一些显著的更改：

### 翻新及新增页面

* [Kotlin 路线图](roadmap.md) —— 查看有关语言和生态系统演进的 Kotlin 更新优先事项列表。
* [Gradle 最佳做法](gradle-best-practices.md)页面 —— 学习优化 Gradle 构建和提高性能的基本最佳做法。
* [Compose Multiplatform 与 Jetpack Compose](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-and-jetpack-compose.html) —— 这两个 UI 框架之间关系的概述。
* [Kotlin Multiplatform 与 Flutter](https://kotlinlang.org/docs/multiplatform/kotlin-multiplatform-flutter.html) —— 查看这两个流行的跨平台框架的对比。
* [与 C 的互操作性](native-c-interop.md) —— 探索 Kotlin 与 C 互操作的细节。
* [数字](numbers.md) —— 了解用于表示数字的不同 Kotlin 类型。

### 新增及更新的教程

* [将您的库发布到 Maven Central](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-libraries.html) —— 了解如何将 KMP 库构件发布到最流行的 Maven 仓库。
* [作为动态库的 Kotlin/Native](native-dynamic-libraries.md) —— 创建一个动态 Kotlin 库。
* [作为 Apple 框架的 Kotlin/Native](apple-framework.md) —— 创建您自己的框架，并在 macOS 和 iOS 上的 Swift/Objective-C 应用程序中使用 Kotlin/Native 代码。

## 如何更新到 Kotlin 2.1.20

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件作为捆绑插件包含在您的 IDE 中。这意味着您无法再从 JetBrains Marketplace 安装该插件。

要更新到新的 Kotlin 版本，请在构建脚本中将 [Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version)为 2.1.20。