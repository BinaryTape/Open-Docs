---
title: "Kotlin 2.1.20-RC3 的新增功能"
---
_[发布于：2025 年 3 月 14 日](eap#build-details)_

:::note
本文档未涵盖“抢先体验预览版 (EAP)”版本的所有功能，但重点介绍了一些重大改进。

有关完整的更改列表，请参阅 [GitHub 变更日志](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20-RC3)。

:::

Kotlin 2.1.20-RC3 版本已发布！
以下是此 EAP 版本的一些详细信息：

* [](#kotlin-k2-compiler-new-default-kapt-plugin)
* [](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* [](#kotlin-native-new-inlining-optimization)
* [Kotlin/Wasm：默认自定义格式化程序和迁移到 Provider API](#kotlin-wasm)
* [Gradle：支持 Gradle 8.11、与 Isolated Projects 兼容以及自定义发布变体](#support-for-adding-custom-gradle-publication-variants)
* [标准库：通用原子类型、改进的 UUID 支持和新的时间跟踪功能](#standard-library)
* [](#compose-compiler-source-information-included-by-default)

## IDE 支持

支持 2.1.20-RC3 的 Kotlin 插件已捆绑在最新的 IntelliJ IDEA 和 Android Studio 中。
你无需更新 IDE 中的 Kotlin 插件。
你只需在构建脚本中将 [Kotlin 版本更改](configure-build-for-eap) 为 2.1.20-RC3 即可。

有关详细信息，请参阅 [更新到新版本](releases#update-to-a-new-kotlin-version)。

## Kotlin K2 编译器：新的默认 kapt 插件

从 Kotlin 2.1.20-RC3 开始，kapt 编译器插件的 K2 实现默认情况下为所有项目启用。

JetBrains 团队早在 Kotlin 1.9.20 中就推出了 K2 编译器的新 kapt 插件实现。
从那时起，我们进一步开发了 K2 kapt 的内部实现，并使其行为与 K1 版本相似，同时也显著提高了其性能。

如果在 K2 编译器中使用 kapt 时遇到任何问题，可以暂时恢复到以前的插件实现。

为此，请将以下选项添加到项目的 `gradle.properties` 文件中：

```kotlin
kapt.use.k2=false
```

请将任何问题报告给我们的 [问题跟踪器](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

## Kotlin Multiplatform：用于替换 Gradle Application 插件的新 DSL

从 Gradle 8.7 开始，[Application](https://docs.gradle.org/current/userguide/application_plugin.html) 插件不再与 Kotlin Multiplatform Gradle 插件兼容。Kotlin 2.1.20-RC3 引入了一个实验性 DSL 来实现类似的功能。新的 `executable {}` 块配置了 JVM 目标的执行任务和 Gradle [distributions](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)。

在使用 DSL 之前，请将以下内容添加到你的构建脚本中：

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

然后，添加新的 `executable {}` 块。例如：

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

在此示例中，Gradle 的 [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) 插件应用于第一个 `executable {}` 块。

如果你遇到任何问题，请在我们的 [问题跟踪器](https://kotl.in/issue) 中报告，或者在我们的 [公共 Slack 频道](https://kotlinlang.slack.com/archives/C19FD9681) 中告知我们。

## Kotlin/Native：新的内联优化

Kotlin 2.1.20-RC3 引入了一个新的内联优化通道，它位于实际代码生成阶段之前。

Kotlin/Native 编译器中的新内联通道应比标准的 LLVM 内联器执行得更好，并提高生成的代码的运行时性能。

新的内联通道当前处于 [Experimental](components-stability#stability-levels-explained) 阶段。要试用它，请使用以下编译器选项：

```none
-Xbinary=preCodegenInlineThreshold=40
```

我们的实验表明，40 是优化的一个很好的折衷阈值。根据我们的基准测试，这使总体性能提高了 9.5%。当然，你也可以尝试其他值。

如果你遇到二进制文件大小或编译时间增加的情况，请在 [YouTrack](https://kotl.in/issue) 中报告此类问题。

## Kotlin/Wasm

### 默认启用自定义格式化程序

之前，你需要 [手动配置](whatsnew21#improved-debugging-experience-for-kotlin-wasm) 自定义格式化程序，以在使用 Kotlin/Wasm 代码时改善 Web 浏览器中的调试体验。

在此版本中，自定义格式化程序在开发构建中默认启用，因此无需额外的 Gradle 配置。

要使用此功能，你只需确保在浏览器的开发者工具中启用自定义格式化程序：

* 在 Chrome DevTools 中，它可通过**设置 | 偏好设置 | 控制台**获得：

  <img src="/img/wasm-custom-formatters-chrome.png" alt="在 Chrome 中启用自定义格式化程序" width="400" style={{verticalAlign: 'middle'}}/>

* 在 Firefox DevTools 中，它可通过**设置 | 高级设置**获得：

  <img src="/img/wasm-custom-formatters-firefox.png" alt="在 Firefox 中启用自定义格式化程序" width="400" style={{verticalAlign: 'middle'}}/>

此更改主要影响开发构建。如果你对生产构建有特定要求，则需要相应地调整 Gradle 配置。将以下编译器选项添加到 `wasmJs {}` 块：

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

### 迁移到 Kotlin/Wasm 和 Kotlin/JS 属性的 Provider API

以前，Kotlin/Wasm 和 Kotlin/JS 扩展中的属性是可变的 (`var`)，并在构建脚本中直接分配：

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

现在，属性通过 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) 公开，你必须使用 `.set()` 函数来赋值：

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API 确保值以延迟方式计算，并与任务依赖项正确集成，从而提高构建性能。

通过此更改，直接属性赋值已被弃用，转而支持 `*EnvSpec` 类，例如 `NodeJsEnvSpec` 和 `YarnRootEnvSpec`。

此外，为了避免混淆，已删除多个别名任务：

| 弃用任务             | 替换项                                                      |
| -------------------- | ------------------------------------------------------------ |
| `wasmJsRun`          | `wasmJsBrowserDevelopmentRun`                                |
| `wasmJsBrowserRun`   | `wasmJsBrowserDevelopmentRun`                                |
| `wasmJsNodeRun`      | `wasmJsNodeDevelopmentRun`                                   |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` 或 `wasmJsBrowserDistribution` |
| `jsRun`              | `jsBrowserDevelopmentRun`                                    |
| `jsBrowserRun`       | `jsBrowserDevelopmentRun`                                    |
| `jsNodeRun`          | `jsNodeDevelopmentRun`                                       |
| `jsBrowserWebpack`   | `jsBrowserProductionWebpack` 或 `jsBrowserDistribution`      |

如果你仅在构建脚本中使用 Kotlin/JS 或 Kotlin/Wasm，则无需执行任何操作，因为 Gradle 会自动处理赋值。

但是，如果你维护一个基于 Kotlin Gradle 插件的插件，并且你的插件未应用 `kotlin-dsl`，则必须更新属性赋值以使用 `.set()` 函数。

## Gradle

### 支持 8.11 版本
Kotlin %kotlinEapVersion% 现在与最新的稳定 Gradle 版本 8.11 兼容，并支持其功能。

### Kotlin Gradle 插件与 Gradle 的 Isolated Projects 兼容

:::note
此功能目前在 Gradle 中处于 pre-Alpha 状态。
仅在 Gradle 8.10 或更高版本中使用，且仅用于评估目的。

自 Kotlin 2.1.0 起，你就可以在项目中 [预览 Gradle 的 Isolated Projects 功能](whatsnew21#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

以前，你必须配置 Kotlin Gradle 插件，以使你的项目与 Isolated Projects 功能兼容，然后才能试用它。在 Kotlin %kotlinEapVersion% 中，不再需要此额外步骤。

现在，要启用 Isolated Projects 功能，你只需 [设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

Kotlin Gradle 插件中的 Gradle Isolated Projects 功能同时支持多平台项目和仅包含 JVM 或 Android 目标的项目。

特别是对于多平台项目，如果你在升级后发现 Gradle 构建存在问题，可以通过设置以下内容来选择退出新的 Kotlin Gradle 插件行为：

```none
kotlin.kmp.isolated-projects.support=disable
```

但是，如果你在多平台项目中使用此 Gradle 属性，则无法使用 Isolated Projects 功能。

我们欢迎你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中提供有关此功能的反馈。

### 支持添加自定义 Gradle 发布变体

Kotlin %kotlinEapVersion% 引入了对添加自定义 [Gradle 发布变体](https://docs.gradle.org/current/userguide/variant_attributes.html) 的支持。此功能适用于多平台项目和以 JVM 为目标的项目。

你无法使用此功能修改现有的 Gradle 变体。

:::

此功能是 [Experimental](components-stability#stability-levels-explained) 的。
要选择加入，请使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 注解。

要添加自定义 Gradle 发布变体，请调用 `adhocSoftwareComponent()` 函数，该函数返回 [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) 的一个实例，你可以在 Kotlin DSL 中对其进行配置：

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

:::tip
有关变体的更多信息，请参阅 Gradle 的 [自定义发布指南](https://docs.gradle.org/current/userguide/publishing_customization.html)。

:::

## 标准库

### 通用原子类型

在 Kotlin %kotlinEapVersion% 中，我们将在标准库的 `kotlin.concurrent.atomics` 包中引入通用原子类型，从而能够为线程安全操作共享独立于平台的代码。这简化了 Kotlin Multiplatform 项目的开发，而无需跨源集复制依赖于原子的逻辑。

`kotlin.concurrent.atomics` 包及其属性是 [Experimental](components-stability#stability-levels-explained) 的。要选择加入，请使用 `@OptIn(ExperimentalAtomicApi::class)` 注解或编译器选项 `-opt-in=kotlin.ExperimentalAtomicApi`。

以下示例演示了如何使用 `AtomicInt` 安全地计算跨多个线程处理的项目：

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

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

    // Prints the total number of processed items
    println("Total processed items: ${processedItems.load()}")
}
```

为了在 Kotlin 的原子类型和 Java 的 [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html) 原子类型之间实现无缝互操作性，API 提供了 `asJavaAtomic()` 和 `asKotlinAtomic()` 扩展函数。在 JVM 上，Kotlin 原子类型和 Java 原子类型在运行时是相同的类型，因此你可以将 Java 原子类型转换为 Kotlin 原子类型，反之亦然，而无需任何开销。

以下示例演示了 Kotlin 和 Java 原子类型如何协同工作：

```kotlin
// Imports the necessary libraries
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

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

```

### UUID 解析、格式化和可比性方面的更改

JetBrains 团队继续改进对 UUID 的支持，该支持 [在 2.0.20 中引入到标准库](whatsnew2020#support-for-uuids-in-the-common-kotlin-standard-library)。

以前，`parse()` 函数仅接受十六进制和短划线格式的 UUID。在 Kotlin %kotlinEapVersion% 中，你可以将 `parse()` 用于_十六进制和短划线格式_和纯十六进制（无短划线）格式。

我们还在本版本中引入了特定于十六进制和短划线格式的操作的函数：

* `parseHexDash()` 从十六进制和短划线格式解析 UUID。
* `toHexDashString()` 将 `Uuid` 转换为十六进制和短划线格式的 `String`（镜像 `toString()` 的功能）。

这些函数的工作方式与 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) 和 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) 类似，后者是早期为十六进制格式引入的。用于解析和格式化功能的显式命名应提高代码清晰度，并改善你对 UUID 的总体体验。

Kotlin 中的 UUID 现在是 `Comparable` 的。从 Kotlin %kotlinEapVersion% 开始，你可以直接比较和排序 `Uuid` 类型的值。这使你可以使用 `<` 和 `>` 运算符，标准库扩展仅适用于 `Comparable` 类型或其集合（例如 `sorted()`），并允许将 UUID 传递给任何需要 `Comparable` 接口的函数或 API。

请记住，标准库中的 UUID 支持仍处于 [Experimental](components-stability#stability-levels-explained) 阶段。要选择加入，请使用 `@OptIn(ExperimentalUuidApi::class)` 注解或编译器选项 `-opt-in=kotlin.uuid.ExperimentalUuidApi`：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

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

```

### 新的时间跟踪功能

从 Kotlin %kotlinEapVersion% 开始，标准库提供了表示时间点的功能。此功能以前仅在官方 Kotlin 库 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 中可用。

[kotlinx.datetime.Clock](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/) 接口作为 `kotlin.time.Clock` 引入到标准库中，并且 [`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/) 类作为 `kotlin.time.Instant` 引入到标准库中。这些概念自然与标准库中的 `time` 包对齐，因为它们仅关注时间点，而与保留在 `kotlinx-datetime` 中的更复杂的日历和时区功能相比。

当需要精确的时间跟踪而不考虑时区或日期时，`Instant` 和 `Clock` 非常有用。
例如，你可以使用它们来记录带有时间戳的事件、测量两个时间点之间的持续时间以及获取系统进程的当前时间。

为了提供与其他语言的互操作性，还提供了其他转换器函数：

* `.toKotlinInstant()` 将时间值转换为 `kotlin.time.Instant` 实例。
* `.toJavaInstant()` 将 `kotlin.time.Instant` 值转换为 `java.time.Instant` 值。
* `Instant.toJSDate()` 将 `kotlin.time.Instant` 值转换为 JS `Date` 类的实例。此转换并不精确，JS 使用毫秒精度来表示日期，而 Kotlin 允许纳秒分辨率。

标准库的新时间功能仍处于 [Experimental](components-stability#stability-levels-explained) 阶段。
要选择加入，请使用 `@OptIn(ExperimentalTime::class)` 注解：

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

有关实现的更多信息，请参阅此 [KEEP 提案](https://github.com/Kotlin/KEEP/pull/387/files)。

## Compose 编译器：默认包含源信息

Compose 编译器 Gradle 插件默认启用在所有平台上 [包含源信息](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html)。`includeSourceInformation` 选项已为 Android 启用，此更改使插件行为在各个平台上保持一致，并允许支持新的运行时功能。

请记住检查是否使用 `freeCompilerArgs` 设置了此选项：当与插件一起使用时，由于选项被设置了两次，因此可能会导致构建失败。

## 破坏性更改和弃用

为了使 Kotlin Multiplatform 与 Gradle 中即将发生的更改保持一致，我们正在逐步淘汰 `withJava()` 函数。
[默认情况下，现在会创建 Java 源集](multiplatform-compatibility-guide#java-source-sets-created-by-default)。

## 如何更新到 Kotlin %kotlinEapVersion%

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件作为捆绑插件分发，该插件包含在你的 IDE 中。这意味着你无法再从 JetBrains Marketplace 安装该插件。捆绑插件支持即将发布的 Kotlin EAP 版本。

要更新到新的 Kotlin EAP 版本，请在构建脚本中将 [Kotlin 版本更改](configure-build-for-eap#adjust-the-kotlin-version) 为 %kotlinEapVersion%。