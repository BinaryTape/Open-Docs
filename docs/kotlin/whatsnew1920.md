[//]: # (title: Kotlin 1.9.20 新特性)

_[发布日期：2023 年 11 月 1 日](releases.md#release-details)_

Kotlin 1.9.20 版本已发布，[适用于所有目标平台的 K2 编译器现已进入 Beta 阶段](#new-kotlin-k2-compiler-updates)，
且 [Kotlin Multiplatform 现已 Stable](#kotlin-multiplatform-is-stable)。此外，以下是一些主要亮点：

*   [配置多平台项目的新默认层级模板](#template-for-configuring-multiplatform-projects)
*   [Kotlin Multiplatform 全面支持 Gradle 配置缓存](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
*   [Kotlin/Native 中默认启用自定义内存分配器](#custom-memory-allocator-enabled-by-default)
*   [Kotlin/Native 垃圾回收器的性能改进](#performance-improvements-for-the-garbage-collector)
*   [Kotlin/Wasm 中的新目标平台和重命名目标平台](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
*   [Kotlin/Wasm 标准库对 WASI API 的支持](#support-for-the-wasi-api-in-the-standard-library)

您也可以通过此视频了解更新的简短概览：

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

## IDE 支持

支持 1.9.20 版本的 Kotlin 插件适用于：

| IDE            | 支持的版本                     |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |

> 从 IntelliJ IDEA 2023.3.x 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件将自动包含并更新。
> 您只需更新项目中 Kotlin 的版本。
>
{style="note"}

## 新的 Kotlin K2 编译器更新

JetBrains 的 Kotlin 团队正在继续稳定化新的 K2 编译器，它将带来重大的性能改进，
加速新语言特性开发，统一 Kotlin 支持的所有平台，并为多平台项目提供更好的架构。

K2 目前适用于所有目标平台，处于 **Beta** 阶段。[在发布博客文章中阅读更多内容](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### 对 Kotlin/Wasm 的支持

自此版本起，Kotlin/Wasm 支持新的 K2 编译器。
[了解如何在您的项目中启用它](#how-to-enable-the-kotlin-k2-compiler)。

### K2 的 kapt 编译器插件预览版

> kapt 编译器插件中对 K2 的支持是[实验性的](components-stability.md)。
> 需要选择启用（详情见下文），且仅应将其用于求值目的。
>
{style="warning"}

在 1.9.20 中，您可以尝试将 [kapt 编译器插件](kapt.md)与 K2 编译器一起使用。
要在您的项目中使用 K2 编译器，请将以下选项添加到您的 `gradle.properties` 文件中：

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

或者，您可以通过完成以下步骤来为 kapt 启用 K2：
1.  在您的 `build.gradle.kts` 文件中，将[语言版本](gradle-compiler-options.md#example-of-setting-languageversion)设置为 `2.0`。
2.  在您的 `gradle.properties` 文件中，添加 `kapt.use.k2=true`。

如果您在使用 kapt 和 K2 编译器时遇到任何问题，请将其报告到我们的[问题跟踪器](http://kotl.in/issue)。

### 如何启用 Kotlin K2 编译器

#### 在 Gradle 中启用 K2

要启用和测试 Kotlin K2 编译器，请使用带有以下编译器选项的新语言版本：

```bash
-language-version 2.0
```

您可以在 `build.gradle.kts` 文件中指定它：

```kotlin
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = "2.0"
        }
    }
}
```

#### 在 Maven 中启用 K2

要启用和测试 Kotlin K2 编译器，请更新您的 `pom.xml` 文件的 `<project/>` 部分：

```xml
<properties>
    <kotlin.compiler.languageVersion>2.0</kotlin.compiler.languageVersion>
</properties>
```

#### 在 IntelliJ IDEA 中启用 K2

要在 IntelliJ IDEA 中启用和测试 Kotlin K2 编译器，请转到 **Settings** | **Build, Execution, Deployment** |
**Compiler** | **Kotlin Compiler** 并将 **Language Version** 字段更新为 `2.0 (experimental)`。

### 留下您对新 K2 编译器的反馈

我们非常感谢您可能提供的任何反馈！

*   直接在 Kotlin Slack 上向 K2 开发者提供您的反馈 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
*   将您在使用新 K2 编译器时遇到的任何问题报告到[我们的问题跟踪器](https://kotl.in/issue)。
*   [启用“发送使用情况统计信息”选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，以允许 JetBrains 收集关于 K2 使用的匿名数据。

## Kotlin/JVM

从 1.9.20 版本开始，编译器可以生成包含 Java 21 字节码的类。

## Kotlin/Native

Kotlin 1.9.20 包含一个 Stable 内存管理器，默认启用新的内存分配器，垃圾回收器性能改进，以及其他更新：

*   [默认启用自定义内存分配器](#custom-memory-allocator-enabled-by-default)
*   [垃圾回收器的性能改进](#performance-improvements-for-the-garbage-collector)
*   [`klib` 构件的增量编译](#incremental-compilation-of-klib-artifacts)
*   [管理库链接问题](#managing-library-linkage-issues)
*   [类构造函数调用时的伴生对象初始化](#companion-object-initialization-on-class-constructor-calls)
*   [所有 cinterop 声明的选择启用要求](#opt-in-requirement-for-all-cinterop-declarations)
*   [链接器错误的自定义消息](#custom-message-for-linker-errors)
*   [移除旧版内存管理器](#removal-of-the-legacy-memory-manager)
*   [我们的目标平台层级策略变更](#change-to-our-target-tiers-policy)

### 默认启用自定义内存分配器

Kotlin 1.9.20 默认启用了新的内存分配器。它旨在取代之前的默认分配器 `mimalloc`，
以使垃圾回收更高效并改进 [Kotlin/Native 内存管理器](native-memory-manager.md)的运行时性能。

新的自定义分配器将系统内存划分为页面，允许按连续顺序独立清除。
每个分配都成为页面内的一个内存块，页面会跟踪块大小。
不同页面类型针对各种分配大小进行了优化。
内存块的连续排列确保了对所有已分配块的高效迭代。

当线程分配内存时，它会根据分配大小搜索合适的页面。
线程维护一组用于不同大小类别的页面。
通常，给定大小的当前页面可以容纳该分配。
如果不能，线程会从共享分配空间请求不同的页面。
该页面可能已经可用、需要清除，或者必须先创建。

新的分配器允许同时存在多个独立的分配空间，
这将使 Kotlin 团队能够尝试不同的页面布局，以进一步提升性能。

#### 如何启用自定义内存分配器

从 Kotlin 1.9.20 开始，新的内存分配器是默认设置。无需额外设置。

如果您遇到高内存占用，可以在 Gradle 构建脚本中，通过 `-Xallocator=mimalloc` 或 `-Xallocator=std` 切换回 `mimalloc` 或系统分配器。请在 [YouTrack](https://kotl.in/issue) 中报告此类问题，以帮助我们改进新的内存分配器。

有关新分配器设计的技术细节，请参阅此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。

### 垃圾回收器的性能改进

Kotlin 团队继续改进新 Kotlin/Native 内存管理器的性能和稳定性。
此版本为垃圾回收器（GC）带来了许多重大更改，包括以下 1.9.20 亮点：

*   [全并行标记以减少 GC 的暂停时间](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
*   [以大块跟踪内存以改进分配性能](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### 全并行标记以减少 GC 的暂停时间

之前，默认垃圾回收器只执行部分并行标记。当变异器线程暂停时，
它会从自己的根（例如线程局部变量和调用栈）标记 GC 的开始。
同时，一个独立的 GC 线程负责从全局根以及所有正在主动运行原生代码因而未暂停的变异器的根开始标记。

这种方法在全局对象数量有限且变异器线程在可运行状态下执行 Kotlin 代码花费大量时间的情况下效果良好。然而，对于典型的 iOS 应用程序来说并非如此。

现在，GC 使用全并行标记，结合暂停的变异器、GC 线程和可选的标记器线程来处理标记队列。默认情况下，标记过程由以下部分执行：

*   暂停的变异器。它们不再处理自己的根并在不主动执行代码时处于空闲状态，而是为整个标记过程贡献力量。
*   GC 线程。这确保至少有一个线程将执行标记。

这种新方法使标记过程更加高效，减少了 GC 的暂停时间。

#### 以大块跟踪内存以改进分配性能

之前，GC 调度器单独跟踪每个对象的分配。然而，无论是新的默认自定义分配器还是 `mimalloc` 内存分配器，都不会为每个对象单独分配存储；它们会一次性为多个对象分配大片区域。

在 Kotlin 1.9.20 中，GC 跟踪的是区域而非单个对象。这通过减少每次分配时执行的任务数量来加速小对象的分配，因此有助于最大程度地减少垃圾回收器的内存使用。

### `klib` 构件的增量编译

> 此特性是[实验性的](components-stability.md#stability-levels-explained)。
> 它可能随时被移除或更改。需要选择启用（详情见下文）。
> 仅将其用于求值目的。我们非常感谢您在 [YouTrack](https://kotl.in/issue) 中提供反馈。
>
{style="warning"}

Kotlin 1.9.20 引入了一项新的 Kotlin/Native 编译期优化。
将 `klib` 构件编译为原生代码现在部分支持增量编译。

在调试模式下将 Kotlin 源代码编译为原生二进制文件时，编译会经历两个阶段：

1.  源代码编译为 `klib` 构件。
2.  `klib` 构件连同依赖项一起编译为二进制文件。

为了优化第二阶段的编译期，团队已经为依赖项实现了编译器缓存。
它们只编译为原生代码一次，结果在每次二进制文件编译时都会被重用。
但从项目源代码构建的 `klib` 构件总是在每次项目更改时完全重新编译为原生代码。

借助新的增量编译，如果项目模块更改仅导致源代码部分重新编译为 `klib` 构件，则 `klib` 的一部分会进一步重新编译为二进制文件。

要启用增量编译，请将以下选项添加到您的 `gradle.properties` 文件中：

```none
kotlin.incremental.native=true
```

如果您遇到任何问题，请向 [YouTrack](https://kotl.in/issue) 报告此类情况。

### 管理库链接问题

此版本改进了 Kotlin/Native 编译器处理 Kotlin 库中链接问题的方式。错误消息现在包含更具可读性的声明，
因为它们使用签名名称而不是哈希值，这有助于您更轻松地找到并修复问题。以下是一个示例：

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```

Kotlin/Native 编译器检测第三方 Kotlin 库之间的链接问题，并在运行时报告错误。
如果某个第三方 Kotlin 库的作者在另一个第三方 Kotlin 库使用的实验性的 API 中进行了不兼容的更改，您可能会遇到此类问题。

从 Kotlin 1.9.20 开始，编译器默认在静默模式下检测链接问题。您可以在项目中调整此设置：

*   如果您想在编译日志中记录这些问题，请使用 `-Xpartial-linkage-loglevel=WARNING` 编译器选项启用警告。
*   也可以使用 `-Xpartial-linkage-loglevel=ERROR` 将报告警告的严重性提升为编译错误。
    在这种情况下，编译失败，您会在编译日志中获取所有错误。使用此选项可以更仔细地探查链接问题。

```kotlin
// 在 Gradle 构建文件中传递编译器选项的示例：
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 将链接问题报告为警告：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // 将链接警告提升为错误：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

如果您在使用此特性时遇到意外问题，您始终可以通过 `-Xpartial-linkage=disable` 编译器选项选择停用。请随时向[我们的问题跟踪器](https://kotl.in/issue)报告此类情况。

### 类构造函数调用时的伴生对象初始化

从 Kotlin 1.9.20 开始，Kotlin/Native 后端会在类构造函数中为伴生对象调用静态初始化器：

```kotlin
class Greeting {
    companion object {
        init {
            print("Hello, Kotlin!") 
        }
    }
}

fun main() {
    val start = Greeting() // Prints "Hello, Kotlin!"
}
```

现在，此行为已与 Kotlin/JVM 统一，在 Kotlin/JVM 中，当加载（解析）符合 Java 静态初始化器语义的相应类时，伴生对象会初始化。

既然此特性的实现在平台之间更加一致，在 Kotlin Multiplatform 项目中共享代码就更容易了。

### 所有 cinterop 声明的选择启用要求

从 Kotlin 1.9.20 开始，所有由 `cinterop` 工具从 C 和 Objective-C 库（例如 `libcurl` 和 `libxml`）生成的 Kotlin 声明都标记有 `@ExperimentalForeignApi`。如果缺少选择启用注解，您的代码将无法编译。

此要求反映了导入 C 和 Objective-C 库的[实验性](components-stability.md#stability-levels-explained)状态。我们建议您将其使用限制在项目的特定区域。一旦我们开始稳定化导入，这将使您的迁移更容易。

> 至于随 Kotlin/Native 提供的原生平台库（例如 Foundation、UIKit 和 POSIX），只有其中一些 API 需要通过 `@ExperimentalForeignApi` 选择启用。在这种情况下，您会收到带有选择启用要求的警告。
>
{style="note"}

### 链接器错误的自定义消息

如果您是库作者，您现在可以通过自定义消息帮助您的用户解决链接器错误。

如果您的 Kotlin 库依赖于 C 或 Objective-C 库（例如，使用 [CocoaPods 集成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)），
其用户需要将这些依赖库本地化到机器上，或者在项目构建脚本中显式配置它们。
如果不这样做，用户过去会收到一条令人困惑的“Framework not found”消息。

您现在可以在编译失败消息中提供特定说明或链接。为此，将 `-Xuser-setup-hint` 编译器选项传递给 `cinterop`，或将 `userSetupHint=message` 属性添加到您的 `.def` 文件。

### 移除旧版内存管理器

[新的内存管理器](native-memory-manager.md)在 Kotlin 1.6.20 中引入，并在 1.7.20 中成为默认设置。
从那时起，它不断收到进一步的更新和性能改进，并已变得 Stable。

现在是时候完成弃用周期并移除旧版内存管理器了。如果您仍在使用它，请从您的 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=strict` 选项，并遵循我们的[迁移指南](native-migration-guide.md)进行必要的更改。

### 我们的目标平台层级策略变更

我们已决定升级对[一级支持](native-target-support.md#tier-1)的要求。Kotlin 团队现在致力于为符合一级目标平台的编译器版本之间提供源代码和二进制兼容性。它们还必须使用 CI 工具定期检测，才能编译和运行。目前，一级目标平台包括 macOS 主机的以下目标平台：

*   `macosX64`
*   `macosArm64`
*   `iosSimulatorArm64`
*   `iosX64`

在 Kotlin 1.9.20 中，我们还移除了许多先前弃用的目标平台，即：

*   `iosArm32`
*   `watchosX86`
*   `wasm32`
*   `mingwX86`
*   `linuxMips32`
*   `linuxMipsel32`

查看当前[支持的目标平台](native-target-support.md)的完整列表。

## Kotlin Multiplatform

Kotlin 1.9.20 侧重于 Kotlin Multiplatform 的稳定化，并在通过新的项目向导和其他值得注意的特性来改进开发者体验方面迈出了新步伐：

*   [Kotlin Multiplatform 现已 Stable](#kotlin-multiplatform-is-stable)
*   [配置多平台项目的模板](#template-for-configuring-multiplatform-projects)
*   [新项目向导](#new-project-wizard)
*   [全面支持 Gradle 配置缓存](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
*   [在 Gradle 中更轻松地配置新标准库版本](#easier-configuration-of-new-standard-library-versions-in-gradle)
*   [默认支持第三方 cinterop 库](#default-support-for-third-party-cinterop-libraries)
*   [Compose Multiplatform 项目中对 Kotlin/Native 编译缓存的支持](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
*   [兼容性指南](#compatibility-guidelines)

### Kotlin Multiplatform 现已 Stable

1.9.20 版本标志着 Kotlin 演进中的一个重要里程碑：[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 终于成为 Stable。这意味着该技术在您的项目中可以安全使用，并且 100% 可用于生产。这也意味着 Kotlin Multiplatform 的未来开发将继续遵循我们严格的[向后兼容性规则](https://kotlinfoundation.org/language-committee-guidelines/)。

请注意，Kotlin Multiplatform 的一些高级特性仍在演进中。使用它们时，您会收到一个警告，说明您正在使用的特性的当前稳定状态。在 IntelliJ IDEA 中使用任何实验性的功能之前，您需要通过 **Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform** 显式启用它。

*   访问 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)以了解有关 Kotlin Multiplatform 稳定化和未来计划的更多信息。
*   查看[多平台兼容性指南](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html)，了解在稳定化过程中进行的重大更改。
*   阅读[预期和实际声明的机制](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)，这是 Kotlin Multiplatform 的重要组成部分，在此版本中也部分稳定化。

### 配置多平台项目的模板

从 Kotlin 1.9.20 开始，Kotlin Gradle 插件会自动为流行的多平台场景创建共享源代码集。
如果您的项目设置是其中之一，您无需手动配置源代码集层级。
只需显式指定项目所需的目标平台。

设置现在变得更容易，这要归功于默认层级模板（Kotlin Gradle 插件的一个新特性）。
它是内置于插件中的源代码集层级的预定义模板。
它包括 Kotlin 为您声明的目标平台自动创建的中间源代码集。
[查看完整层级模板](#see-the-full-hierarchy-template)。

#### 更轻松地创建您的项目

考虑一个同时面向 Android 和 iPhone 设备并在 Apple silicon MacBook 上开发的多平台项目。
比较此项目在不同 Kotlin 版本之间是如何设置的：

<table>
   <tr>
       <td>Kotlin 1.9.0 及更早版本（标准设置）</td>
       <td>Kotlin 1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting

        val iosMain by creating {
            dependsOn(commonMain)
        }

        val iosArm64Main by getting {
            dependsOn(iosMain)
        }

        val iosSimulatorArm64Main by getting {
            dependsOn(iosMain)
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    // iosMain 源代码集是自动创建的
}
```

</td>
</tr>
</table>

请注意，默认层级模板的使用如何显著减少设置项目所需的样板代码量。

当您在代码中声明 `androidTarget`、`iosArm64` 和 `iosSimulatorArm64` 目标平台时，Kotlin Gradle 插件会从模板中找到合适的共享源代码集并为您创建它们。结果层级如下所示：

![An example of the default target hierarchy in use](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

绿色源代码集是实际创建并包含在项目中的，而默认模板中灰色的则被忽略。

#### 为源代码集使用代码补全

为了更轻松地使用已创建的项目结构，IntelliJ IDEA 现在为使用默认层级模板创建的源代码集提供代码补全功能：

<img src="multiplatform-hierarchy-completion.animated.gif" alt="IDE completion for source set names" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

如果您尝试访问一个不存在的源代码集（因为您尚未声明相应的目标平台），Kotlin 也会警告您。
在下面的示例中，没有 JVM 目标平台（只有 `androidTarget`，它不相同）。但让我们尝试使用 `jvmMain` 源代码集，看看会发生什么：

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        jvmMain {
        }
    }
}
```

在这种情况下，Kotlin 会在构建日志中报告一个警告：

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* <- register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### 设置目标平台层级

从 Kotlin 1.9.20 开始，默认层级模板会自动启用。在大多数情况下，无需额外设置。

然而，如果您正在迁移 1.9.20 之前创建的现有项目，如果您之前手动通过 `dependsOn()` 调用引入了中间源代码，您可能会遇到警告。要解决此问题，请执行以下操作：

*   如果您的中间源代码集当前被默认层级模板覆盖，请移除所有手动 `dependsOn()` 调用和使用 `by creating` 构造创建的源代码集。

    要查看所有默认源代码集的列表，请参阅[完整层级模板](#see-the-full-hierarchy-template)。

*   如果您想拥有默认层级模板未提供的额外源代码集（例如，在 macOS 和 JVM 目标平台之间共享代码的源代码集），请通过 `applyDefaultHierarchyTemplate()` 显式重新应用模板并像往常一样使用 `dependsOn()` 手动配置额外的源代码集。

  ```kotlin
  kotlin {
      jvm()
      macosArm64()
      iosArm64()
      iosSimulatorArm64()

      // 显式应用默认层级。例如，它将创建 iosMain 源代码集：
      applyDefaultHierarchyTemplate()

      sourceSets {
          // 创建一个额外的 jvmAndMacos 源代码集
          val jvmAndMacos by creating {
              dependsOn(commonMain.get())
          }

          macosArm64Main.get().dependsOn(jvmAndMacos)
          jvmMain.get().dependsOn(jvmAndMacos)
      }
  }
  ```

*   如果您的项目中已经存在与模板生成的源代码集名称完全相同但 在不同目标平台集之间共享的源代码集，目前无法修改模板源代码集之间的默认 `dependsOn` 关系。

    您在这里的选择之一是为您的目的找到不同的源代码集，无论是默认层级模板中的还是手动创建的。另一个是完全选择停用该模板。

    要选择停用，请将 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 添加到您的 `gradle.properties` 中，并手动配置所有其他源代码集。

    我们目前正在开发一个 API，用于创建您自己的层级模板，以简化此类情况下的设置过程。

#### 查看完整层级模板 {initial-collapse-state="collapsed" collapsible="true"}

当您声明项目编译到的目标平台时，
插件会相应地从模板中选取共享源代码集并在您的项目中创建它们。

![Default hierarchy template](full-template-hierarchy.svg)

> 此示例仅显示项目的生产部分，省略了 `Main` 后缀
> （例如，使用 `common` 而不是 `commonMain`）。然而，对于 `*Test` 源代码集，一切也是一样的。
>
{style="tip"}

### 新项目向导

JetBrains 团队正在引入一种创建跨平台项目的新方式 – [Kotlin Multiplatform Web 向导](https://kmp.jetbrains.com)。

新 Kotlin Multiplatform 向导的首次实现涵盖了最流行的 Kotlin Multiplatform 用例。
它整合了关于先前项目模板的所有反馈，并使架构尽可能健壮和可靠。

新向导具有分布式架构，使我们能够拥有统一的后端和不同的前端，其中 Web 版本是第一步。我们正在考虑未来实现一个 IDE 版本并创建一个命令行工具。在 Web 端，您总是能获取向导的最新版本，而在 IDE 中，您需要等待下一个版本。

使用新向导，项目设置比以往任何时候都更容易。您可以通过选择用于移动、服务器和桌面开发的目标平台，根据您的需求定制项目。我们还计划在未来的版本中添加 Web 开发。

<img src="multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

新项目向导现在是使用 Kotlin 创建跨平台项目的首选方式。自 1.9.20 起，Kotlin 插件不再在 IntelliJ IDEA 中提供 **Kotlin Multiplatform** 项目向导。

新向导将轻松引导您完成初始设置，使新用户入门过程更加顺畅。
如果您遇到任何问题，请将其报告到 [YouTrack](https://kotl.in/issue) 以帮助我们改善您使用向导的体验。

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="Create a project" style="block"/>
</a>

### Kotlin Multiplatform 全面支持 Gradle 配置缓存

之前，我们引入了 [Gradle 配置缓存的预览版](whatsnew19.md#preview-of-the-gradle-configuration-cache)，该缓存可用于 Kotlin 多平台库。随着 1.9.20 的发布，Kotlin Multiplatform 插件更进一步。

它现在支持 [Kotlin CocoaPods Gradle 插件](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html)中的 Gradle 配置缓存，
以及 Xcode 构建所需的集成任务中，例如 `embedAndSignAppleFrameworkForXcode`。

现在所有多平台项目都可以利用改进的构建期。
Gradle 配置缓存通过重用配置阶段的结果进行后续构建，从而加速构建过程。
有关更多详细信息和设置说明，请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)。

### 在 Gradle 中更轻松地配置新标准库版本

当您创建多平台项目时，标准库 (`stdlib`) 的依赖项会自动添加到每个源代码集。这是开始使用多平台项目最简单的方法。

之前，如果您想手动配置对标准库的依赖项，您需要为每个源代码集单独配置。从 `kotlin-stdlib:1.9.20` 开始，您只需在 `commonMain` 根源代码集中配置依赖项**一次**：

<table>
   <tr>
       <td>标准库版本 1.9.10 及更早版本</td>
       <td>标准库版本 1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    sourceSets {
        // 对于公共源代码集
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-common:1.9.10")
            }
        }

        // 对于 JVM 源代码集
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // 对于 JS 源代码集
        val jsMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-js:1.9.10")
            }
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.20")
            }
        }
    }
}
```

</td>
</tr>
</table>

此更改是通过在标准库的 Gradle 元数据中包含新信息而实现的。这允许 Gradle 自动解析其他源代码集的正确标准库构件。

### 默认支持第三方 cinterop 库

Kotlin 1.9.20 添加了对应用了 [Kotlin CocoaPods Gradle](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) 插件的项目中所有 cinterop 依赖项的默认支持（而非通过选择启用支持）。

这意味着您现在可以共享更多原生代码，而不受平台特有的依赖项限制。例如，您可以向 `iosMain` 共享源代码集添加对 [Pod 库的依赖项](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html)。

之前，这只适用于随 Kotlin/Native 分发版提供的[平台特有的库](native-platform-libs.md)（例如 Foundation、UIKit 和 POSIX）。所有第三方 Pod 库现在默认在共享源代码集中可用。您不再需要指定单独的 Gradle 属性来支持它们。

### Compose Multiplatform 项目中对 Kotlin/Native 编译缓存的支持

此版本解决了 Compose Multiplatform 编译器插件的兼容性问题，该问题主要影响适用于 iOS 的 Compose Multiplatform 项目。

为了解决此问题，您必须使用 `kotlin.native.cacheKind=none` Gradle 属性来禁用缓存。然而，这种变通方法以性能为代价：它降低了编译期，因为缓存在 Kotlin/Native 编译器中不起作用。

现在，问题已修复，您可以从 `gradle.properties` 文件中移除 `kotlin.native.cacheKind=none`，并在 Compose Multiplatform 项目中享受改进的编译期。

有关改进编译期的更多提示，请参阅 [Kotlin/Native 文档](native-improving-compilation-time.md)。

### 兼容性指南

配置项目时，请检测 Kotlin Multiplatform Gradle 插件与可用 Gradle、Xcode 和 Android Gradle 插件（AGP）版本之间的兼容性：

| Kotlin Multiplatform Gradle 插件 | Gradle | Android Gradle 插件 | Xcode |
|---------------------------|------|----|----|
| 1.9.20        | 7.5 及更高 | 7.4.2–8.2 | 15.0。详情见下文 |

截至此版本，推荐的 Xcode 版本是 15.0。随 Xcode 15.0 提供的库得到全面支持，您可以从 Kotlin 代码中的任何位置访问它们。

然而，Xcode 14.3 在大多数情况下应该仍然有效。请记住，如果您在本地机器上使用 14.3 版本，随 Xcode 15 提供的库将可见但不可访问。

## Kotlin/Wasm

在 1.9.20 中，Kotlin Wasm 达到了[Alpha 稳定级别](components-stability.md)。

*   [与 Wasm GC 第 4 阶段和最终操作码的兼容性](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
*   [新的 `wasm-wasi` 目标平台，以及将 `wasm` 目标平台重命名为 `wasm-js`](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
*   [标准库对 WASI API 的支持](#support-for-the-wasi-api-in-the-standard-library)
*   [Kotlin/Wasm API 改进](#kotlin-wasm-api-improvements)

> Kotlin Wasm 是 [Alpha](components-stability.md)。
> 它可能随时被移除或更改。仅将其用于求值目的。
>
> 我们非常感谢您在 [YouTrack](https://kotl.in/issue) 中提供反馈。
>
{style="note"}

### 与 Wasm GC 第 4 阶段和最终操作码的兼容性

Wasm GC 进入最后阶段，需要更新操作码——二进制表示中使用的常量数字。
Kotlin 1.9.20 支持最新的操作码，因此我们强烈建议您将您的 Wasm 项目更新到最新版本的 Kotlin。
我们还建议使用带有 Wasm 环境的最新版本浏览器：
*   Chrome 和基于 Chromium 的浏览器版本 119 或更高。
*   Firefox 版本 119 或更高。请注意，在 Firefox 119 中，您需要[手动开启 Wasm GC](wasm-configuration.md)。

### 新的 wasm-wasi 目标平台，以及将 wasm 目标平台重命名为 wasm-js

在此版本中，我们引入了 Kotlin/Wasm 的新目标平台 – `wasm-wasi`。我们还将 `wasm` 目标平台重命名为 `wasm-js`。
在 Gradle DSL 中，这些目标平台分别作为 `wasmWasi {}` 和 `wasmJs {}` 可用。

要在您的项目中使用这些目标平台，请更新 `build.gradle.kts` 文件：

```kotlin
kotlin {
    wasmWasi {
        // ...
    }
    wasmJs {
        // ...
    }
}
```

先前引入的 `wasm {}` 代码块已弃用，转而使用 `wasmJs {}`。

要迁移您现有的 Kotlin/Wasm 项目，请执行以下操作：
*   在 `build.gradle.kts` 文件中，将 `wasm {}` 代码块重命名为 `wasmJs {}`。
*   在您的项目结构中，将 `wasmMain` 目录重命名为 `wasmJsMain`。

### 标准库对 WASI API 的支持

在此版本中，我们包含了对 [WASI](https://github.com/WebAssembly/WASI) 的支持，它是 Wasm 平台的系统接口。
WASI 支持使您更容易在浏览器之外使用 Kotlin/Wasm，例如在服务器端应用程序中，通过提供一组标准化的 API 来访问系统资源。此外，WASI 提供基于能力的安全——访问外部资源时的另一层安全。

要运行 Kotlin/Wasm 应用程序，您需要一个支持 Wasm 垃圾回收（GC）的 VM，例如 Node.js 或 Deno。
Wasmtime、WasmEdge 和其他工具仍在努力实现对 Wasm GC 的全面支持。

要导入 WASI 函数，请使用 `@WasmImport` 注解：

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[您可以在我们的 GitHub 版本库中找到完整示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)。

> 当面向 `wasmWasi` 目标平台时，无法使用[与 JavaScript 的互操作性](wasm-js-interop.md)。
>
{style="note"}

### Kotlin/Wasm API 改进

此版本为 Kotlin/Wasm API 带来了多项实用性改进。
例如，您不再需要为 DOM 事件监听器返回值：

<table>
   <tr>
       <td>1.9.20 之前</td>
       <td>在 1.9.20 中</td>
   </tr>
   <tr>
<td>

```kotlin
fun main() {
    window.onload = {
        document.body?.sayHello()
        null
    }
}
```

</td>
<td>

```kotlin
fun main() {
    window.onload = { document.body?.sayHello() }
}
```

</td>
</tr>
</table>

## Gradle

Kotlin 1.9.20 完全兼容 Gradle 6.8.3 到 8.1。您也可以使用最新 Gradle 版本之前的 Gradle 版本，但如果您这样做，请记住您可能会遇到弃用警告或某些新的 Gradle 特性可能不起作用。

此版本带来了以下更改：
*   [支持测试夹具访问 `internal` 声明](#support-for-test-fixtures-to-access-internal-declarations)
*   [配置 Konan 目录路径的新属性](#new-property-to-configure-paths-to-konan-directories)
*   [Kotlin/Native 任务的新构建报告指标](#new-build-report-metrics-for-kotlin-native-tasks)

### 支持测试夹具访问 `internal` 声明

在 Kotlin 1.9.20 中，如果您使用 Gradle 的 `java-test-fixtures` 插件，那么您的[测试夹具](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)
现在可以访问主源代码集类中的 `internal` 声明。此外，任何测试源代码也可以查看测试夹具类中的任何 `internal` 声明。

### 配置 Konan 目录路径的新属性

在 Kotlin 1.9.20 中，`konan.data.dir` Gradle 属性可用于自定义您的 `~/.konan` 目录路径，
这样您就不必通过环境变量 `KONAN_DATA_DIR` 来配置它。

或者，您可以使用 `-Xkonan-data-dir` 编译器选项通过 `cinterop` 和 `konanc` 工具配置您的 `~/.konan` 目录的自定义路径。

### Kotlin/Native 任务的新构建报告指标

在 Kotlin 1.9.20 中，Gradle 构建报告现在包含 Kotlin/Native 任务的指标。以下是包含这些指标的构建报告示例：

```none
Total time for Kotlin tasks: 20.81 s (93.1 % of all tasks time)
Time   |% of Kotlin time|Task                            
15.24 s|73.2 %          |:compileCommonMainKotlinMetadata
5.57 s |26.8 %          |:compileNativeMainKotlinMetadata

Task ':compileCommonMainKotlinMetadata' finished in 15.24 s
Task info:
  Kotlin language version: 2.0
Time metrics:
  Total Gradle task time: 15.24 s
  Spent time before task action: 0.16 s
  Task action before worker execution: 0.21 s
  Run native in process: 2.70 s
    Run entry point: 2.64 s
Size metrics:
  Start time of task action: 2023-07-27T11:04:17

Task ':compileNativeMainKotlinMetadata' finished in 5.57 s
Task info:
  Kotlin language version: 2.0
Time metrics:
  Total Gradle task time: 5.57 s
  Spent time before task action: 0.04 s
  Task action before worker execution: 0.02 s
  Run native in process: 1.48 s
    Run entry point: 1.47 s
Size metrics:
  Start time of task action: 2023-07-27T11:04:32
```

此外，`kotlin.experimental.tryK2` 构建报告现在包含任何已编译的 Kotlin/Native 任务，并列出了所使用的语言版本：

```none
##### 'kotlin.experimental.tryK2' results #####
:lib:compileCommonMainKotlinMetadata: 2.0 language version
:lib:compileKotlinJvm: 2.0 language version
:lib:compileKotlinIosArm64: 2.0 language version
:lib:compileKotlinIosSimulatorArm64: 2.0 language version
:lib:compileKotlinLinuxX64: 2.0 language version
:lib:compileTestKotlinJvm: 2.0 language version
:lib:compileTestKotlinIosSimulatorArm64: 2.0 language version
:lib:compileTestKotlinLinuxX64: 2.0 language version
##### 100% (8/8) tasks have been compiled with Kotlin 2.0 #####
```

> 如果您使用 Gradle 8.0，您可能会遇到一些构建报告问题，尤其是在启用 Gradle 配置缓存时。这是一个已知问题，已在 Gradle 8.1 及更高版本中修复。
>
{style="note"}

## 标准库

在 Kotlin 1.9.20 中，[Kotlin/Native 标准库成为 Stable](#the-kotlin-native-standard-library-becomes-stable)，
并且有一些新特性：
*   [Enum 类 `values` 泛型函数的替换](#replacement-of-the-enum-class-values-generic-function)
*   [Kotlin/JS 中 `HashMap` 操作的性能改进](#improved-performance-of-hashmap-operations-in-kotlin-js)

### Enum 类 `values` 泛型函数的替换

> 此特性是[实验性的](components-stability.md#stability-levels-explained)。它可能随时被移除或更改。
> 需要选择启用（详情见下文）。仅将其用于求值目的。我们非常感谢您在 [YouTrack](https://kotl.in/issue) 中提供反馈。
>
{style="warning"}

在 Kotlin 1.9.0 中，枚举类的 `entries` 属性成为 Stable。`entries` 属性是合成 `values()` 函数的现代且高性能的替换。作为 Kotlin 1.9.20 的一部分，有一个泛型函数 `enumValues<T>()` 的替换：`enumEntries<T>()`。

> `enumValues<T>()` 函数仍然受支持，但我们建议您使用 `enumEntries<T>()` 函数，因为它对性能影响较小。每次调用 `enumValues<T>()` 时，都会创建一个新数组，而每次调用 `enumEntries<T>()` 时，都会返回相同的 list，效率要高得多。
>
{style="tip"}

例如：

```kotlin
enum class RGB { RED, GREEN, BLUE }

@OptIn(ExperimentalStdlibApi::class)
inline fun <reified T : Enum<T>> printAllValues() {
    print(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// RED, GREEN, BLUE
```

#### 如何启用 `enumEntries` 函数

要尝试此特性，请使用 `@OptIn(ExperimentalStdlibApi)` 选择启用，并使用语言版本 1.9 或更高版本。如果您使用最新版本的 Kotlin Gradle 插件，则无需指定语言版本即可测试该特性。

### Kotlin/Native 标准库成为 Stable

在 Kotlin 1.9.0 中，我们[解释了](whatsnew19.md#the-kotlin-native-standard-library-s-journey-towards-stabilization)为使 Kotlin/Native 标准库更接近稳定化目标而采取的行动。在 Kotlin 1.9.20 中，我们最终完成了这项工作，使 Kotlin/Native 标准库成为 Stable。以下是此版本的一些亮点：

*   [`Vector128`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-vector128/) 类已从 `kotlin.native` 包移至 `kotlinx.cinterop` 包。
*   作为 Kotlin 1.9.0 的一部分引入的 `ExperimentalNativeApi` 和 `NativeRuntimeApi` 注解的选择启用要求级别已从 `WARNING` 提升到 `ERROR`。
*   Kotlin/Native 集合现在可以检测并发修改，例如在 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/) 和 [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/) 集合中。
*   `Throwable` 类中的 [`printStackTrace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/print-stack-trace.html) 函数现在打印到 `STDERR` 而不是 `STDOUT`。
  > `printStackTrace()` 的输出格式不是 Stable，并且可能更改。
  >
  {style="warning"}

#### Atomics API 的改进

在 Kotlin 1.9.0 中，我们曾表示，当 Kotlin/Native 标准库成为 Stable 时，Atomics API 将准备好成为 Stable。Kotlin 1.9.20 包含以下额外更改：

*   引入了实验性的 `AtomicIntArray`、`AtomicLongArray` 和 `AtomicArray<T>` 类。这些新类专门设计用于与 Java 的原子数组保持一致，以便将来可以将它们包含在公共标准库中。
  > `AtomicIntArray`、`AtomicLongArray` 和 `AtomicArray<T>` 类是
  > [实验性的](components-stability.md#stability-levels-explained)。它们可能随时被移除或更改。要
  > 尝试它们，请使用 `@OptIn(ExperimentalStdlibApi)` 选择启用。仅将其用于求值目的。我们非常
  > 感谢您在 [YouTrack](https://kotl.in/issue) 中提供反馈。
  >
  {style="warning"}
*   在 `kotlin.native.concurrent` 包中，Atomics API 在 Kotlin 1.9.0 中以弃用级别 `WARNING` 弃用的成员函数已将其弃用级别提升到 `ERROR`。
*   在 `kotlin.concurrent` 包中，弃用级别为 `ERROR` 的 [`AtomicInt`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-int/index.html) 和 [`AtomicLong`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-long/index.html) 类的成员函数已被移除。
*   `AtomicReference` 类的所有[成员函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions)现在都使用原子内建函数。

有关 Kotlin 1.9.20 中所有更改的更多信息，请参阅我们的 [YouTrack 问题单](https://youtrack.jetbrains.com/issue/KT-61028/Behavioural-changes-to-the-Native-stdlib-API)。

### Kotlin/JS 中 `HashMap` 操作的性能改进

Kotlin 1.9.20 改进了 Kotlin/JS 中 `HashMap` 操作的性能并减少了其内存占用。在内部，
Kotlin/JS 已将其内部实现更改为开放寻址。这意味着当您执行以下操作时，您应该会看到性能改进：
*   向 `HashMap` 插入新元素。
*   在 `HashMap` 中搜索现有元素。
*   在 `HashMap` 中迭代键或值。

## 文档更新

Kotlin 文档收到了一些值得注意的更改：
*   [JVM 元数据](https://kotlinlang.org/api/kotlinx-metadata-jvm/) API 参考 – 探查如何使用 Kotlin/JVM 解析元数据。
*   [时间测量指南](time-measurement.md) – 了解如何在 Kotlin 中计算和测量时间。
*   [Kotlin 之旅](kotlin-tour-welcome.md)中改进的集合章节 – 通过包含理论和实践的章节，了解 Kotlin 编程语言的基础知识。
*   [确定非空类型](generics.md#definitely-non-nullable-types) – 了解确定非空泛型类型。
*   改进的[数组页面](arrays.md) – 了解数组以及何时使用它们。
*   [Kotlin Multiplatform 中的预期和实际声明](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) – 了解 Kotlin Multiplatform 中预期和实际声明的 Kotlin 机制。

## 安装 Kotlin 1.9.20

### 检测 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.x 和 2023.2.x 会自动建议将 Kotlin 插件更新到 1.9.20 版本。IntelliJ IDEA 2023.3 将包含 Kotlin 1.9.20 插件。

Android Studio Hedgehog (231) 和 Iguana (232) 将在其即将发布的版本中支持 Kotlin 1.9.20。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20)下载。

### 配置 Gradle 设置

要下载 Kotlin 构件和依赖项，请更新您的 `settings.gradle(.kts)` 文件以使用 Maven Central 版本库：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

如果未指定版本库，Gradle 将使用已停止维护的 JCenter 版本库，这可能导致 Kotlin 构件出现问题。