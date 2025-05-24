---
title: "Kotlin 2.1.20 中的新增功能"
---
_[发布时间：2025 年 3 月 20 日](releases#release-details)_

Kotlin 2.1.20 版本发布啦！以下是主要亮点：

* **K2 编译器更新**：[新 kapt 和 Lombok 插件的更新](#kotlin-k2-compiler)
* **Kotlin Multiplatform (KMP)**：[用于替代 Gradle Application 插件的新 DSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* **Kotlin/Native**: [新的内联优化](#kotlin-native-new-inlining-optimization)
* **Kotlin/Wasm**: [默认自定义格式化器、DWARF 支持以及迁移到 Provider API](#kotlin-wasm)
* **Gradle 支持**: [与 Gradle 的 Isolated Projects (隔离项目) 兼容以及自定义发布变体](#gradle)
* **标准库**: [通用原子类型、改进的 UUID 支持以及新的时间跟踪功能](#standard-library)
* **Compose 编译器**: [放宽了对 `@Composable` 函数的限制以及其他更新](#compose-compiler)
* **文档**: [Kotlin 文档的显著改进](#documentation-updates)。

## IDE 支持

支持 2.1.20 的 Kotlin 插件已捆绑在最新的 IntelliJ IDEA 和 Android Studio 中。您无需在 IDE 中更新 Kotlin 插件。您只需在构建脚本中将 Kotlin 版本更改为 2.1.20 即可。

有关详细信息，请参阅[更新到新版本](releases#update-to-a-new-kotlin-version)。

### 下载具有 OSGi 支持的项目的 Kotlin 工件的源码

`kotlin-osgi-bundle` 库的所有依赖项的源码现在都包含在其发行版中。这允许 IntelliJ IDEA 下载这些源码，从而为 Kotlin 符号提供文档并改善调试体验。

## Kotlin K2 编译器

我们正在不断改进对新 Kotlin K2 编译器的插件支持。此版本为新的 kapt 和 Lombok 插件带来了更新。

### 新的默认 kapt 插件

从 Kotlin 2.1.20 开始，kapt 编译器插件的 K2 实现默认对所有项目启用。

JetBrains 团队早在 Kotlin 1.9.20 中就推出了 kapt 插件的 K2 新实现。从那时起，我们进一步开发了 K2 kapt 的内部实现，使其行为与 K1 版本相似，同时也显著提高了其性能。

如果在 K2 编译器中使用 kapt 时遇到任何问题，您可以暂时恢复到之前的插件实现。

为此，请将以下选项添加到项目的 `gradle.properties` 文件中：

```kotlin
kapt.use.k2=false
```

请将任何问题报告给我们的 [issue tracker](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback)。

### Lombok 编译器插件：支持 `@SuperBuilder` 以及 `@Builder` 的更新

[Kotlin Lombok 编译器插件](lombok) 现在支持 `@SuperBuilder` 注解，从而可以更轻松地为类层次结构创建 builder。以前，在 Kotlin 中使用 Lombok 的开发人员在处理继承时必须手动定义 builder。使用 `@SuperBuilder`，builder 会自动继承超类字段，从而允许您在构造对象时初始化它们。

此外，此更新还包括多项改进和错误修复：

* `@Builder` 注解现在可以在构造函数上使用，从而实现更灵活的对象创建。有关更多详细信息，请参阅相应的 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-71547)。
* 解决了 Kotlin 中与 Lombok 代码生成相关的多个问题，从而提高了整体兼容性。有关更多详细信息，请参阅 [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)。

有关 `@SuperBuilder` 注解的更多信息，请参阅官方 [Lombok documentation](https://projectlombok.org/features/experimental/SuperBuilder)。

## Kotlin Multiplatform (KMP)：用于替代 Gradle Application 插件的新 DSL

从 Gradle 8.7 开始，[Application](https://docs.gradle.org/current/userguide/application_plugin.html) 插件不再与 Kotlin Multiplatform (KMP) Gradle 插件兼容。Kotlin 2.1.20 引入了一个 Experimental DSL 来实现类似的功能。新的 `executable {}` 块配置了 JVM 目标的执行任务和 Gradle [distributions](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin)。

在构建脚本中的 `executable {}` 块之前，添加以下 `@OptIn` 注解：

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

在此示例中，Gradle 的 [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) 插件应用于第一个 `executable {}` 块。

如果您遇到任何问题，请在我们的 [issue tracker](https://kotl.in/issue) 中报告，或者在我们的 [public Slack channel](https://kotlinlang.slack.com/archives/C19FD9681) 中告知我们。

## Kotlin/Native: 新的内联优化

Kotlin 2.1.20 引入了一个新的内联优化 pass (过程)，它在实际代码生成阶段之前进行。

Kotlin/Native 编译器中的新内联 pass (过程) 应该比标准的 LLVM inliner (内联器) 表现更好，并提高生成的代码的运行时性能。

新的内联 pass (过程) 目前是 [Experimental](components-stability#stability-levels-explained)。要试用它，请使用以下编译器选项：

```none
-Xbinary=preCodegenInlineThreshold=40
```

我们的实验表明，将阈值设置为 40 个 token（由编译器解析的代码单元）可以为编译优化提供合理的折衷方案。根据我们的基准测试，这可以带来 9.5% 的整体性能提升。当然，您也可以尝试其他值。

如果您遇到二进制文件大小或编译时间增加的情况，请通过 [YouTrack](https://kotl.in/issue) 报告此类问题。

## Kotlin/Wasm

此版本改进了 Kotlin/Wasm 调试和属性使用。自定义格式化器现在可以在开发版本中直接使用，而 DWARF 调试有助于代码检查。此外，Provider API 简化了 Kotlin/Wasm 和 Kotlin/JS 中的属性使用。

### 默认启用自定义格式化器

之前，您必须[手动配置](whatsnew21#improved-debugging-experience-for-kotlin-wasm)自定义格式化器，以在使用 Kotlin/Wasm 代码时改进 Web 浏览器中的调试。

在此版本中，自定义格式化器默认在开发版本中启用，因此您不需要额外的 Gradle 配置。

要使用此功能，您只需确保在浏览器的开发者工具中启用自定义格式化器即可：

* 在 Chrome DevTools 中，在**Settings | Preferences | Console**中找到自定义格式化器复选框：

  <img src="/img/wasm-custom-formatters-chrome.png" alt="Enable custom formatters in Chrome" width="400" style={{verticalAlign: 'middle'}}/>

* 在 Firefox DevTools 中，在**Settings | Advanced settings**中找到自定义格式化器复选框：

  <img src="/img/wasm-custom-formatters-firefox.png" alt="Enable custom formatters in Firefox" width="400" style={{verticalAlign: 'middle'}}/>

此更改主要影响 Kotlin/Wasm 开发版本。如果您对生产版本有特定要求，则需要相应地调整 Gradle 配置。为此，请将以下编译器选项添加到 `wasmJs {}` 块：

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

Kotlin 2.1.20 引入了对 Kotlin/Wasm 中 DWARF (debugging with arbitrary record format，使用任意记录格式进行调试) 的支持。

通过此更改，Kotlin/Wasm 编译器能够将 DWARF 数据嵌入到生成的 WebAssembly (Wasm) 二进制文件中。许多调试器和虚拟机可以读取此数据，以提供对已编译代码的深入了解。

DWARF 主要用于在独立的 Wasm 虚拟机 (VM) 中调试 Kotlin/Wasm 应用程序。要使用此功能，Wasm VM 和调试器必须支持 DWARF。

通过 DWARF 支持，您可以单步执行 Kotlin/Wasm 应用程序、检查变量并获得代码见解。要启用此功能，请使用以下编译器选项：

```bash
-Xwasm-generate-dwarf
```
### 迁移到 Kotlin/Wasm 和 Kotlin/JS 属性的 Provider API

以前，Kotlin/Wasm 和 Kotlin/JS 扩展中的属性是可变的 (`var`)，并且直接在构建脚本中分配：

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

现在，属性通过 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) 公开，您必须使用 `.set()` 函数来赋值：

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API 确保延迟计算值并将其与任务依赖项正确集成，从而提高构建性能。

通过此更改，直接属性分配已弃用，而支持 `*EnvSpec` 类，例如 `NodeJsEnvSpec` 和 `YarnRootEnvSpec`。

此外，为了避免混淆，已删除多个别名任务：

| 弃用的任务              | 替换                                            |
|----------------------|-------------------------------------------------|
| `wasmJsRun`          | `wasmJsBrowserDevelopmentRun`                     |
| `wasmJsBrowserRun`   | `wasmJsBrowserDevelopmentRun`                     |
| `wasmJsNodeRun`      | `wasmJsNodeDevelopmentRun`                        |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` or `wasmJsBrowserDistribution` |
| `jsRun`              | `jsBrowserDevelopmentRun`                        |
| `jsBrowserRun`       | `jsBrowserDevelopmentRun`                        |
| `jsNodeRun`          | `jsNodeDevelopmentRun`                           |
| `jsBrowserWebpack`   | `jsBrowserProductionWebpack` or `jsBrowserDistribution`  |

如果您仅在构建脚本中使用 Kotlin/JS 或 Kotlin/Wasm，则无需执行任何操作，因为 Gradle 会自动处理分配。

但是，如果您维护基于 Kotlin Gradle 插件的插件，并且您的插件未应用 `kotlin-dsl`，则必须更新属性分配以使用 `.set()` 函数。

## Gradle

Kotlin 2.1.20 完全兼容 Gradle 7.6.3 到 8.11。您还可以使用 Gradle 版本直到最新的 Gradle 版本。但是，请注意，这样做可能会导致弃用警告，并且某些新的 Gradle 功能可能无法正常工作。

此版本的 Kotlin 包括 Kotlin Gradle 插件与 Gradle 的 Isolated Projects (隔离项目) 的兼容性，以及对自定义 Gradle 发布变体的支持。

### Kotlin Gradle 插件与 Gradle 的 Isolated Projects (隔离项目) 兼容

:::note
此功能目前在 Gradle 中处于 pre-Alpha 状态。目前不支持 JS 和 Wasm 目标。仅将其与 Gradle 8.10 或更高版本一起使用，并且仅用于评估目的。
:::

自从 Kotlin 2.1.0 以来，您已经能够在项目中[预览 Gradle 的 Isolated Projects (隔离项目) 功能](whatsnew21#preview-gradle-s-isolated-projects-in-kotlin-multiplatform)。

以前，您必须配置 Kotlin Gradle 插件以使您的项目与 Isolated Projects (隔离项目) 功能兼容，然后才能试用它。在 Kotlin 2.1.20 中，不再需要此附加步骤。

现在，要启用 Isolated Projects (隔离项目) 功能，您只需[设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)即可。

Gradle 的 Isolated Projects (隔离项目) 功能在 Kotlin Gradle 插件中受多平台项目和仅包含 JVM 或 Android 目标的项目支持。

具体来说，对于多平台项目，如果在升级后发现 Gradle 构建存在问题，您可以通过添加以下内容来选择退出新的 Kotlin Gradle 插件行为：

```none
kotlin.kmp.isolated-projects.support=disable
```

但是，如果您在多平台项目中使用此 Gradle 属性，则无法使用 Isolated Projects (隔离项目) 功能。

请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中告诉我们您对此功能的体验。

### 支持添加自定义 Gradle 发布变体

Kotlin 2.1.20 引入了对添加自定义 [Gradle 发布变体](https://docs.gradle.org/current/userguide/variant_attributes.html) 的支持。此功能适用于多平台项目和以 JVM 为目标的项目。

您无法使用此功能修改现有的 Gradle 变体。

:::

此功能是 [Experimental](components-stability#stability-levels-explained)。要选择加入，请使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 注解。

要添加自定义 Gradle 发布变体，请调用 `adhocSoftwareComponent()` 函数，该函数返回一个 [`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) 的实例，您可以在 Kotlin DSL 中对其进行配置：

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
有关变体的更多信息，请参阅 Gradle 的 [Customizing publishing guide](https://docs.gradle.org/current/userguide/publishing_customization.html)。
:::

## 标准库

此版本为标准库带来了新的 Experimental 功能：通用原子类型、改进的 UUID 支持以及新的时间跟踪功能。

### 通用原子类型

在 Kotlin 2.1.20 中，我们正在标准库的 `kotlin.concurrent.atomics` 包中引入通用原子类型，从而为线程安全操作启用共享的、平台无关的代码。通过消除跨源集复制原子相关逻辑的需要，这简化了 Kotlin Multiplatform (KMP) 项目的开发。

`kotlin.concurrent.atomics` 包及其属性是 [Experimental](components-stability#stability-levels-explained)。要选择加入，请使用 `@OptIn(ExperimentalAtomicApi::class)` 注解或编译器选项 `-opt-in=kotlin.ExperimentalAtomicApi`。

以下示例显示了如何使用 `AtomicInt` 安全地计算跨多个线程处理的项目：

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

为了实现 Kotlin 的原子类型和 Java 的 [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html) 原子类型之间的无缝互操作性，API 提供了 `.asJavaAtomic()` 和 `.asKotlinAtomic()` 扩展函数。在 JVM 上，Kotlin 原子类型和 Java 原子类型在运行时是相同的类型，因此您可以将 Java 原子类型转换为 Kotlin 原子类型，反之亦然，而无需任何开销。

以下示例显示了 Kotlin 和 Java 原子类型如何协同工作：

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

JetBrains 团队继续改进对 UUID 的支持，UUID 在 [2.0.20 版本中引入了标准库](whatsnew2020#support-for-uuids-in-the-common-kotlin-standard-library)。

以前，`parse()` 函数仅接受十六进制和破折号格式的 UUID。使用 Kotlin 2.1.20，您可以将 `parse()` 用于_十六进制和破折号格式_以及纯十六进制格式（不带破折号）。

我们还在此版本中引入了特定于十六进制和破折号格式的操作的函数：

* `parseHexDash()` 从十六进制和破折号格式解析 UUID。
* `toHexDashString()` 将 `Uuid` 转换为十六进制和破折号格式的 `String`（镜像 `toString()` 的功能）。

这些函数的工作方式与 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) 和 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) 类似，后者是早期为十六进制格式引入的。用于解析和格式化功能的显式命名应该可以提高代码清晰度以及您使用 UUID 的总体体验。

Kotlin 中的 UUID 现在是 `Comparable`。从 Kotlin 2.1.20 开始，您可以直接比较和排序 `Uuid` 类型的值。这支持使用 `<` 和 `>` 运算符以及专门为 `Comparable` 类型或其集合（例如 `sorted()`）提供的标准库扩展，并且还允许将 UUID 传递给任何需要 `Comparable` 接口的函数或 API。

请记住，标准库中的 UUID 支持仍然是 [Experimental](components-stability#stability-levels-explained)。要选择加入，请使用 `@OptIn(ExperimentalUuidApi::class)` 注解或编译器选项 `-opt-in=kotlin.uuid.ExperimentalUuidApi`：

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

从 Kotlin 2.1.20 开始，标准库提供了表示时间点的能力。此功能以前仅在 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/)（一个官方 Kotlin 库）中可用。

[`kotlinx.datetime.Clock`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/) 接口作为 `kotlin.time.Clock` 引入到标准库中，[`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/) 类作为 `kotlin.time.Instant` 引入到标准库中。这些概念自然与标准库中的 `time` 包对齐，因为它们仅关注与更复杂的日历和时区功能相比的时间点，而这些功能仍然保留在 `kotlinx-datetime` 中。

当您需要精确的时间跟踪而不考虑时区或日期时，`Instant` 和 `Clock` 非常有用。例如，您可以使用它们来记录带有时间戳的事件、测量两个时间点之间的持续时间以及获取系统进程的当前时间。

为了提供与其他语言的互操作性，还提供了其他转换器函数：

* `.toKotlinInstant()` 将时间值转换为 `kotlin.time.Instant` 实例。
* `.toJavaInstant()` 将 `kotlin.time.Instant` 值转换为 `java.time.Instant` 值。
* `Instant.toJSDate()` 将 `kotlin.time.Instant` 值转换为 JS `Date` 类的实例。此转换不精确；JS 使用毫秒精度来表示日期，而 Kotlin 允许纳秒分辨率。

标准库的新时间功能仍然是 [Experimental](components-stability#stability-levels-explained)。要选择加入，请使用 `@OptIn(ExperimentalTime::class)` 注解：

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

有关实现的更多信息，请参阅此 [KEEP proposal](https://github.com/Kotlin/KEEP/pull/387/files)。

## Compose 编译器

在 2.1.20 中，Compose 编译器放宽了先前版本中引入的对 `@Composable` 函数的一些限制。此外，Compose 编译器 Gradle 插件设置为默认包含源信息，从而使所有平台上的行为与 Android 保持一致。

### 支持在 open `@Composable` 函数中使用默认参数

由于不正确的编译器输出，编译器以前限制了在 open `@Composable` 函数中使用默认参数，这会导致运行时崩溃。现在已解决根本问题，并且在使用 Kotlin 2.1.20 或更高版本时完全支持默认参数。

Compose 编译器在 [1.5.8 版本](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8) 之前允许在 open 函数中使用默认参数，因此支持取决于项目配置：

* 如果使用 Kotlin 2.1.20 或更高版本编译 open 可组合函数，则编译器会为默认参数生成正确的包装器。这包括与 1.5.8 之前的二进制文件兼容的包装器，这意味着下游库也将能够使用此 open 函数。
* 如果使用低于 2.1.20 的 Kotlin 版本编译 open 可组合函数，则 Compose 使用兼容模式，这可能会导致运行时崩溃。使用兼容模式时，编译器会发出警告以突出显示潜在问题。

### 允许最终覆盖函数是可重启的

虚拟函数（`open` 和 `abstract` 的覆盖，包括接口）[在 2.1.0 版本中被强制设为不可重启](whatsnew21#changes-to-open-and-overridden-composable-functions)。现在，对于作为 final 类的成员或本身是 `final` 的函数，此限制已放宽 – 它们将像往常一样重启或跳过。

升级到 Kotlin 2.1.20 后，您可能会观察到受影响函数中的一些行为更改。要强制执行先前版本中的不可重启逻辑，请将 `@NonRestartableComposable` 注解应用于该函数。

### 从公共 API 中删除 `ComposableSingletons`

`ComposableSingletons` 是 Compose 编译器在优化 `@Composable` lambdas 时创建的类。不捕获任何参数的 Lambdas 被分配一次并缓存在类的属性中，从而节省运行时期间的分配。该类以内部可见性生成，仅用于优化编译单元（通常是文件）内的 lambdas。

但是，此优化也应用于 `inline` 函数体，这导致单例 lambda 实例泄漏到公共 API 中。为了解决此问题，从 2.1.20 开始，`@Composable` lambdas 不再优化为内联函数内的单例。同时，Compose 编译器将继续为内联函数生成单例类和 lambdas，以支持在先前模型下编译的模块的二进制兼容性。

### 默认包含源信息

Compose 编译器 Gradle 插件已经在 Android 上默认启用了 [包括源信息](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html) 功能。从 Kotlin 2.1.20 开始，此功能将在所有平台上默认启用。

请记住检查您是否使用 `freeCompilerArgs` 设置了此选项。如果与插件一起使用，此方法可能会导致构建失败，因为选项实际上设置了两次。

## 破坏性更改和弃用

* 为了使 Kotlin Multiplatform (KMP) 与 Gradle 中即将发生的更改保持一致，我们正在逐步淘汰 `withJava()` 函数。[Java 源集现在默认创建](multiplatform-compatibility-guide#java-source-sets-created-by-default)。

* JetBrains 团队正在继续弃用 `kotlin-android-extensions` 插件。如果您尝试在项目中使用它，现在会收到配置错误，并且不会执行任何插件代码。

* 传统的 `kotlin.incremental.classpath.snapshot.enabled` 属性已从 Kotlin Gradle 插件中删除。该属性过去提供了一个机会，可以回退到 JVM 上的内置 ABI 快照。该插件现在使用其他方法来检测和避免不必要的重新编译，从而使该属性过时。

## 文档更新

Kotlin 文档进行了一些值得注意的更改：

### 改造和新页面

* [Kotlin roadmap](roadmap) – 查看 Kotlin 在语言和生态系统演进方面的优先事项的更新列表。
* [Gradle best practices](gradle-best-practices) 页面 – 学习优化 Gradle 构建和提高性能的基本最佳实践。
* [Compose Multiplatform and Jetpack Compose](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-and-jetpack-compose.html) – 两个 UI 框架之间关系的概述。
* [Kotlin Multiplatform and Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) – 查看两个流行的跨平台框架的比较。
* [Interoperability with C](native-c-interop) – 探索 Kotlin 与 C 互操作性的详细信息。
* [Numbers](numbers) – 了解用于表示数字的不同 Kotlin 类型。

### 新的和更新的教程

* [Publish your library to Maven Central](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html) – 了解如何将 KMP 库工件发布到最受欢迎的 Maven 存储库。
* [Kotlin/Native as a dynamic library](native-dynamic-libraries) – 创建一个动态 Kotlin 库。
* [Kotlin/Native as an Apple framework](apple-framework) – 创建您自己的框架并在 macOS 和 iOS 上的 Swift/Objective-C 应用程序中使用 Kotlin/Native 代码。

## 如何更新到 Kotlin 2.1.20

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件作为捆绑插件分发，包含在您的 IDE 中。这意味着您无法再从 JetBrains Marketplace 安装该插件。

要更新到新的 Kotlin 版本，请在您的构建脚本中[将 Kotlin 版本更改为 2.1.20](releases#update-to-a-new-kotlin-version)。