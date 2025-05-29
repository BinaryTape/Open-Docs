[//]: # (title: Kotlin 1.9.20 新特性)

_[发布日期：2023 年 11 月 1 日](releases.md#release-details)_

Kotlin 1.9.20 版本已发布，[适用于所有目标的 K2 编译器现已进入 Beta 阶段](#new-kotlin-k2-compiler-updates)，
并且 [Kotlin Multiplatform 现已稳定 (Stable)](#kotlin-multiplatform-is-stable)。此外，以下是主要亮点：

* [设置多平台项目的新默认层级模板](#template-for-configuring-multiplatform-projects)
* [Kotlin Multiplatform 全面支持 Gradle 配置缓存](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Kotlin/Native 中默认启用自定义内存分配器](#custom-memory-allocator-enabled-by-default)
* [Kotlin/Native 垃圾回收器性能改进](#performance-improvements-for-the-garbage-collector)
* [Kotlin/Wasm 中的新目标和重命名目标](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [Kotlin/Wasm 标准库对 WASI API 的支持](#support-for-the-wasi-api-in-the-standard-library)

您还可以在此视频中找到更新的简要概述：

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

## IDE 支持

支持 1.9.20 的 Kotlin 插件适用于：

| IDE            | 支持版本                     |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |

> 从 IntelliJ IDEA 2023.3.x 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件将自动包含并更新。您只需更新项目中的 Kotlin 版本即可。
>
{style="note"}

## Kotlin K2 编译器更新

JetBrains 的 Kotlin 团队正在继续稳定新的 K2 编译器，这将带来重大的性能改进，加速新语言特性的开发，统一 Kotlin 支持的所有平台，并为多平台项目提供更好的架构。

K2 目前已对所有目标进入 **Beta** 阶段。[在发布博客文章中阅读更多内容](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### 支持 Kotlin/Wasm

自此版本起，Kotlin/Wasm 支持新的 K2 编译器。[了解如何在您的项目中启用它](#how-to-enable-the-kotlin-k2-compiler)。

### K2 的 kapt 编译器插件预览

> kapt 编译器插件中对 K2 的支持是 [实验性的 (Experimental)](components-stability.md)。需要选择启用 (详见下文)，且您应仅将其用于评估目的。
>
{style="warning"}

在 1.9.20 中，您可以尝试将 [kapt 编译器插件](kapt.md) 与 K2 编译器一起使用。要在项目中使用 K2 编译器，请将以下选项添加到您的 `gradle.properties` 文件中：

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

或者，您可以通过完成以下步骤为 kapt 启用 K2：
1. 在 `build.gradle.kts` 文件中，将[语言版本](gradle-compiler-options.md#example-of-setting-languageversion)设置为 `2.0`。
2. 在 `gradle.properties` 文件中，添加 `kapt.use.k2=true`。

如果您在使用 kapt 和 K2 编译器时遇到任何问题，请向我们的[问题跟踪器](http://kotl.in/issue)报告。

### 如何启用 Kotlin K2 编译器

#### 在 Gradle 中启用 K2

要启用并测试 Kotlin K2 编译器，请使用新语言版本和以下编译器选项：

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

要启用并测试 Kotlin K2 编译器，请更新 `pom.xml` 文件的 `<project/>` 部分：

```xml
<properties>
    <kotlin.compiler.languageVersion>2.0</kotlin.compiler.languageVersion>
</properties>
```

#### 在 IntelliJ IDEA 中启用 K2

要在 IntelliJ IDEA 中启用并测试 Kotlin K2 编译器，请转到 **Settings** | **Build, Execution, Deployment** | **Compiler** | **Kotlin Compiler**，并将 **Language Version** 字段更新为 `2.0 (experimental)`。

### 提供关于新 K2 编译器的反馈

我们非常感谢您的任何反馈！

* 直接通过 Kotlin Slack 向 K2 开发者提供反馈 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
* 在我们的[问题跟踪器](https://kotl.in/issue)上报告您使用新 K2 编译器遇到的任何问题。
* [启用发送使用情况统计信息选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，以允许 JetBrains 收集关于 K2 使用情况的匿名数据。

## Kotlin/JVM

从 1.9.20 版本开始，编译器可以生成包含 Java 21 字节码的类。

## Kotlin/Native

Kotlin 1.9.20 包含一个稳定的内存管理器，默认启用新的内存分配器，以及垃圾回收器性能改进和其他更新：

* [默认启用自定义内存分配器](#custom-memory-allocator-enabled-by-default)
* [垃圾回收器性能改进](#performance-improvements-for-the-garbage-collector)
* [`klib` 工件的增量编译](#incremental-compilation-of-klib-artifacts)
* [管理库链接问题](#managing-library-linkage-issues)
* [类构造函数调用时的伴生对象初始化](#companion-object-initialization-on-class-constructor-calls)
* [所有 cinterop 声明都需要选择启用](#opt-in-requirement-for-all-cinterop-declarations)
* [链接器错误自定义消息](#custom-message-for-linker-errors)
* [移除旧版内存管理器](#removal-of-the-legacy-memory-manager)
* [目标层级策略变更](#change-to-our-target-tiers-policy)

### 默认启用自定义内存分配器

Kotlin 1.9.20 默认启用了新的内存分配器。它旨在取代之前的默认分配器 `mimalloc`，以提高垃圾回收效率并改善 [Kotlin/Native 内存管理器](native-memory-manager.md)的运行时性能。

新的自定义分配器将系统内存划分为页面 (pages)，允许以连续顺序独立清理。每个分配都成为页面内的内存块，页面会跟踪块大小。不同的页面类型针对各种分配大小进行了优化。内存块的连续排列确保了对所有已分配块的有效迭代。

当线程分配内存时，它会根据分配大小搜索合适的页面。线程会为不同大小类别维护一组页面。通常，给定大小的当前页面可以容纳该分配。如果不能，线程会从共享分配空间请求不同的页面。此页面可能已经可用、需要清理或必须首先创建。

新的分配器允许同时存在多个独立的分配空间，这将使 Kotlin 团队能够尝试不同的页面布局以进一步提高性能。

#### 如何启用自定义内存分配器

从 Kotlin 1.9.20 开始，新的内存分配器是默认选项。无需额外设置。

如果您遇到高内存消耗，可以在 Gradle 构建脚本中使用 `-Xallocator=mimalloc` 或 `-Xallocator=std` 切换回 `mimalloc` 或系统分配器。请在 [YouTrack](https://kotl.in/issue) 中报告此类问题，以帮助我们改进新的内存分配器。

有关新分配器设计的技术细节，请参阅此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。

### 垃圾回收器性能改进

Kotlin 团队继续改进新的 Kotlin/Native 内存管理器的性能和稳定性。此版本对垃圾回收器 (GC) 进行了一些重大更改，包括以下 1.9.20 亮点：

* [减少 GC 暂停时间的完全并行标记](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [以大块跟踪内存以提高分配性能](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### 减少 GC 暂停时间的完全并行标记

以前，默认的垃圾回收器只执行部分并行标记。当变异器线程暂停时，它会从自己的根（例如线程局部变量和调用栈）开始标记 GC。同时，一个单独的 GC 线程负责从全局根以及所有正在主动运行原生代码且未暂停的变异器的根开始标记。

这种方法在全局对象数量有限且变异器线程在可运行状态下执行 Kotlin 代码花费大量时间的情况下效果很好。然而，对于典型的 iOS 应用程序来说，情况并非如此。

现在，GC 使用完全并行标记，结合暂停的变异器、GC 线程和可选的标记器线程来处理标记队列。默认情况下，标记过程由以下组件执行：

* 暂停的变异器。它们不再处理自己的根，然后在不主动执行代码时处于空闲状态，而是为整个标记过程做出贡献。
* GC 线程。这确保至少有一个线程会执行标记。

这种新方法使标记过程更高效，减少了 GC 的暂停时间。

#### 以大块跟踪内存以提高分配性能

以前，GC 调度器单独跟踪每个对象的分配。然而，无论是新的默认自定义分配器还是 `mimalloc` 内存分配器，都不会为每个对象单独分配存储空间；它们会一次性为多个对象分配大区域。

在 Kotlin 1.9.20 中，GC 跟踪区域而不是单个对象。这通过减少每次分配执行的任务数量来加速小对象的分配，从而有助于最大程度地减少垃圾回收器的内存使用。

### `klib` 工件的增量编译

> 此功能是[实验性的 (Experimental)](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。需要选择启用 (详见下文)。仅将其用于评估目的。我们非常感谢您在 [YouTrack](https://kotl.in/issue) 上提供的反馈。
>
{style="warning"}

Kotlin 1.9.20 为 Kotlin/Native 引入了一项新的编译时间优化。现在，`klib` 工件到原生代码的编译是部分增量的。

在调试模式下将 Kotlin 源代码编译为原生二进制文件时，编译会经历两个阶段：

1. 源代码编译为 `klib` 工件。
2. `klib` 工件连同依赖项编译为二进制文件。

为了优化第二阶段的编译时间，团队已经为依赖项实现了编译器缓存。它们只编译成原生代码一次，结果在每次编译二进制文件时都会被重用。但是，从项目源构建的 `klib` 工件在每次项目更改时都会完全重新编译成原生代码。

通过新的增量编译，如果项目模块更改只导致源代码部分重新编译为 `klib` 工件，那么 `klib` 的一部分将进一步重新编译为二进制文件。

要启用增量编译，请将以下选项添加到 `gradle.properties` 文件中：

```none
kotlin.incremental.native=true
```

如果您遇到任何问题，请向 [YouTrack](https://kotl.in/issue) 报告此类情况。

### 管理库链接问题

此版本改进了 Kotlin/Native 编译器处理 Kotlin 库中链接问题的方式。现在错误消息包含更易读的声明，因为它们使用签名名称而不是哈希，这有助于您更轻松地找到并修复问题。例如：

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Native 编译器检测第三方 Kotlin 库之间的链接问题并在运行时报告错误。如果某个第三方 Kotlin 库的作者对另一个第三方 Kotlin 库使用的实验性 API 进行了不兼容的更改，您可能会遇到此类问题。

从 Kotlin 1.9.20 开始，编译器默认在静默模式下检测链接问题。您可以在项目中调整此设置：

* 如果您想在编译日志中记录这些问题，请使用 `-Xpartial-linkage-loglevel=WARNING` 编译器选项启用警告。
* 还可以使用 `-Xpartial-linkage-loglevel=ERROR` 将报告警告的严重性提升为编译错误。在这种情况下，编译将失败，您将在编译日志中看到所有错误。使用此选项可以更仔细地检查链接问题。

```kotlin
// An example of passing compiler options in a Gradle build file:
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // To report linkage issues as warnings:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // To raise linkage warnings to errors:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

如果您遇到此功能的意外问题，可以随时使用 `-Xpartial-linkage=disable` 编译器选项选择退出。请不要犹豫向我们的[问题跟踪器](https://kotl.in/issue)报告此类情况。

### 类构造函数调用时的伴生对象初始化

从 Kotlin 1.9.20 开始，Kotlin/Native 后端在类构造函数中调用伴生对象的静态初始化器：

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

现在，此行为与 Kotlin/JVM 统一，在 Kotlin/JVM 中，当加载（解析）与 Java 静态初始化器语义匹配的相应类时，伴生对象会被初始化。

现在，此功能的实现跨平台更加一致，在 Kotlin Multiplatform 项目中共享代码变得更加容易。

### 所有 cinterop 声明都需要选择启用

从 Kotlin 1.9.20 开始，所有由 `cinterop` 工具从 C 和 Objective-C 库（如 libcurl 和 libxml）生成的 Kotlin 声明都标记为 `@ExperimentalForeignApi`。如果缺少选择启用注解，您的代码将无法编译。

此要求反映了导入 C 和 Objective-C 库的[实验性 (Experimental)](components-stability.md#stability-levels-explained) 状态。我们建议您将其使用限制在项目中的特定区域。一旦我们开始稳定导入，这将使您的迁移更容易。

> 至于 Kotlin/Native 附带的原生平台库（如 Foundation、UIKit 和 POSIX），只有部分 API 需要 `@ExperimentalForeignApi` 选择启用。在这种情况下，您会收到带有选择启用要求的警告。
>
{style="note"}

### 链接器错误自定义消息

如果您是库作者，现在可以使用自定义消息帮助用户解决链接器错误。

如果您的 Kotlin 库依赖于 C 或 Objective-C 库（例如，使用 [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)），其用户需要在机器上本地安装这些依赖库或在项目构建脚本中明确配置它们。如果不是这种情况，用户以前会收到令人困惑的“找不到框架”消息。

您现在可以在编译失败消息中提供特定说明或链接。为此，请将 `-Xuser-setup-hint` 编译器选项传递给 `cinterop` 或将 `userSetupHint=message` 属性添加到您的 `.def` 文件中。

### 移除旧版内存管理器

[新内存管理器](native-memory-manager.md)于 Kotlin 1.6.20 中引入，并在 1.7.20 中成为默认选项。此后，它不断获得更新和性能改进，并已变得稳定 (Stable)。

现在是时候完成弃用周期并移除旧版内存管理器了。如果您仍在使用它，请从 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=strict` 选项，并遵循我们的[迁移指南](native-migration-guide.md)进行必要的更改。

### 目标层级策略变更

我们决定升级 [Tier 1 支持](native-target-support.md#tier-1)的要求。Kotlin 团队现在致力于为符合 Tier 1 条件的目标提供编译器版本之间的源代码和二进制兼容性。它们还必须定期通过 CI 工具进行测试，以便能够编译和运行。目前，Tier 1 包括 macOS 主机上的以下目标：

* `macosX64`
* `macosArm64`
* `iosSimulatorArm64`
* `iosX64`

在 Kotlin 1.9.20 中，我们还移除了许多先前已弃用的目标，即：

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxMips32`
* `linuxMipsel32`

查看当前[支持的目标](native-target-support.md)的完整列表。

## Kotlin Multiplatform

Kotlin 1.9.20 专注于 Kotlin Multiplatform 的稳定化，并通过新的项目向导和其他显著功能在改善开发者体验方面迈出了新的一步：

* [Kotlin Multiplatform 已稳定 (Stable)](#kotlin-multiplatform-is-stable)
* [配置多平台项目的模板](#template-for-configuring-multiplatform-projects)
* [新项目向导](#new-project-wizard)
* [全面支持 Gradle 配置缓存](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Gradle 中更容易配置新标准库版本](#easier-configuration-of-new-standard-library-versions-in-gradle)
* [默认支持第三方 cinterop 库](#default-support-for-third-party-cinterop-libraries)
* [Compose Multiplatform 项目中支持 Kotlin/Native 编译缓存](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
* [兼容性指南](#compatibility-guidelines)

### Kotlin Multiplatform 已稳定 (Stable)

1.9.20 版本标志着 Kotlin 发展的一个重要里程碑：[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 最终达到了稳定 (Stable) 状态。这意味着该技术在您的项目中可以安全使用，并且 100% 准备好投入生产。这也意味着 Kotlin Multiplatform 的进一步开发将继续遵循我们严格的[向后兼容性规则](https://kotlinfoundation.org/language-committee-guidelines/)。

请注意，Kotlin Multiplatform 的一些高级功能仍在发展中。使用它们时，您会收到一条警告，描述您正在使用的功能的当前稳定性状态。在 IntelliJ IDEA 中使用任何实验性功能之前，您需要明确地在 **Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform** 中启用它。

* 访问 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，了解有关 Kotlin Multiplatform 稳定化和未来计划的更多信息。
* 查阅[多平台兼容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html)，了解在稳定化过程中进行了哪些重大更改。
* 阅读有关 [expected 和 actual 声明机制](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)的信息，这是 Kotlin Multiplatform 的一个重要组成部分，在此版本中也部分稳定。

### 配置多平台项目的模板

从 Kotlin 1.9.20 开始，Kotlin Gradle 插件会自动为常见的多平台场景创建共享源集。如果您的项目设置属于其中一种，则无需手动配置源集层级。只需明确指定项目所需的目标即可。

现在，得益于默认层级模板（Kotlin Gradle 插件的一项新功能），设置变得更加容易。它是一个内置于插件中的预定义源集层级模板。它包括 Kotlin 为您声明的目标自动创建的中间源集。[查看完整模板](#see-the-full-hierarchy-template)。

#### 更轻松地创建项目

考虑一个同时针对 Android 和 iPhone 设备并在 Apple 芯片 MacBook 上开发的多平台项目。比较 Kotlin 不同版本中该项目的设置方式：

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

    // The iosMain source set is created automatically
}
```

</td>
</tr>
</table>

请注意，使用默认层级模板如何显著减少设置项目所需的样板代码量。

当您在代码中声明 `androidTarget`、`iosArm64` 和 `iosSimulatorArm64` 目标时，Kotlin Gradle 插件会从模板中找到合适的共享源集并为您创建它们。生成的层级结构如下所示：

![An example of the default target hierarchy in use](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

绿色的源集是实际创建并包含在项目中的，而默认模板中灰色的源集则被忽略。

#### 使用源集完成功能

为了更轻松地使用已创建的项目结构，IntelliJ IDEA 现在为使用默认层级模板创建的源集提供完成功能：

<img src="multiplatform-hierarchy-completion.animated.gif" alt="IDE completion for source set names" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

如果您尝试访问不存在的源集（因为您尚未声明相应的目标），Kotlin 也会发出警告。在以下示例中，没有 JVM 目标（只有 `androidTarget`，这不同）。但让我们尝试使用 `jvmMain` 源集，看看会发生什么：

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

在这种情况下，Kotlin 会在构建日志中报告警告：

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* <- register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### 设置目标层级

从 Kotlin 1.9.20 开始，默认层级模板会自动启用。在大多数情况下，无需额外设置。

但是，如果您正在迁移在 1.9.20 之前创建的现有项目，如果您以前手动使用 `dependsOn()` 调用引入了中间源，则可能会遇到警告。要解决此问题，请执行以下操作：

* 如果您的中间源集当前由默认层级模板覆盖，请移除所有手动 `dependsOn()` 调用和使用 `by creating` 构造创建的源集。

  要查看所有默认源集的列表，请参阅[完整层级模板](#see-the-full-hierarchy-template)。

* 如果您想拥有默认层级模板未提供的额外源集，例如，一个在 macOS 和 JVM 目标之间共享代码的源集，请通过使用 `applyDefaultHierarchyTemplate()` 明确地重新应用模板并像往常一样使用 `dependsOn()` 手动配置额外源集来调整层级：

  ```kotlin
  kotlin {
      jvm()
      macosArm64()
      iosArm64()
      iosSimulatorArm64()

      // Apply the default hierarchy explicitly. It'll create, for example, the iosMain source set:
      applyDefaultHierarchyTemplate()

      sourceSets {
          // Create an additional jvmAndMacos source set
          val jvmAndMacos by creating {
              dependsOn(commonMain.get())
          }

          macosArm64Main.get().dependsOn(jvmAndMacos)
          jvmMain.get().dependsOn(jvmAndMacos)
      }
  }
  ```

* 如果您的项目中已经存在与模板生成源集名称完全相同但共享于不同目标集之间的源集，目前无法修改模板源集之间的默认 `dependsOn` 关系。

  您在此处的一个选项是找到适合您目的的不同源集，无论是默认层级模板中的还是手动创建的。另一个是完全选择退出模板。

  要选择退出，请将 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 添加到您的 `gradle.properties` 中，并手动配置所有其他源集。

  我们目前正在开发一个 API，用于创建您自己的层级模板，以简化此类情况下的设置过程。

#### 查看完整层级模板 {initial-collapse-state="collapsed" collapsible="true"}

当您声明项目编译到的目标时，
插件会相应地从模板中选择共享源集并在您的项目中创建它们。

![Default hierarchy template](full-template-hierarchy.svg)

> 此示例仅显示项目的生产部分，省略了 `Main` 后缀（例如，使用 `common` 而不是 `commonMain`）。然而，对于 `*Test` 源来说，所有内容都是相同的。
>
{style="tip"}

### 新项目向导

JetBrains 团队正在引入一种创建跨平台项目的新方式——[Kotlin Multiplatform Web 向导](https://kmp.jetbrains.com)。

新的 Kotlin Multiplatform 向导的首次实现涵盖了最流行的 Kotlin Multiplatform 用例。它整合了所有关于先前项目模板的反馈，并使架构尽可能健壮和可靠。

新向导采用分布式架构，允许我们拥有统一的后端和不同的前端，其中 Web 版本是第一步。我们正在考虑未来实现 IDE 版本并创建命令行工具。在 Web 上，您始终可以获得最新版本的向导，而在 IDE 中，您需要等待下一个版本。

有了新向导，项目设置比以往任何时候都更容易。您可以通过选择移动、服务器和桌面开发的目标平台来根据您的需求定制项目。我们还计划在未来的版本中增加 Web 开发。

<img src="multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

新的项目向导现在是使用 Kotlin 创建跨平台项目的首选方式。从 1.9.20 开始，Kotlin 插件不再在 IntelliJ IDEA 中提供 **Kotlin Multiplatform** 项目向导。

新向导将轻松引导您完成初始设置，使入门过程更加顺畅。如果您遇到任何问题，请向 [YouTrack](https://kotl.in/issue) 报告，以帮助我们改进您的向导使用体验。

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="Create a project" style="block"/>
</a>

### Kotlin Multiplatform 全面支持 Gradle 配置缓存

此前，我们为 Kotlin 多平台库引入了 Gradle 配置缓存的[预览版](whatsnew19.md#preview-of-the-gradle-configuration-cache)。通过 1.9.20 版本，Kotlin Multiplatform 插件更进一步。

它现在支持 [Kotlin CocoaPods Gradle 插件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)中的 Gradle 配置缓存，以及 Xcode 构建所需的集成任务，例如 `embedAndSignAppleFrameworkForXcode`。

现在所有多平台项目都可以利用改进的构建时间。Gradle 配置缓存通过重用配置阶段的结果来加速后续构建的构建过程。有关更多详细信息和设置说明，请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)。

### Gradle 中更容易配置新标准库版本

当您创建多平台项目时，标准库 (`stdlib`) 的依赖项会自动添加到每个源集。这是开始使用多平台项目最简单的方式。

以前，如果您想手动配置对标准库的依赖项，则需要为每个源集单独配置。从 `kotlin-stdlib:1.9.20` 开始，您只需在 `commonMain` 根源集中**一次性**配置依赖项即可：

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
        // For the common source set
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-common:1.9.10")
            }
        }

        // For the JVM source set
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // For the JS source set
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

这项更改是通过在标准库的 Gradle 元数据中包含新信息实现的。这使得 Gradle 能够自动为其他源集解析正确的标准库工件。

### 默认支持第三方 cinterop 库

Kotlin 1.9.20 为应用了 [Kotlin CocoaPods Gradle](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) 插件的项目中的所有 cinterop 依赖项添加了默认支持（而不是选择启用支持）。

这意味着您现在可以共享更多原生代码，而不受平台特定依赖项的限制。例如，您可以将 [Pod 库的依赖项](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html)添加到 `iosMain` 共享源集中。

以前，这只适用于 Kotlin/Native 发行版附带的[平台特定库](native-platform-libs.md)（如 Foundation、UIKit 和 POSIX）。现在所有第三方 Pod 库默认在共享源集中可用。您不再需要指定单独的 Gradle 属性来支持它们。

### Compose Multiplatform 项目中支持 Kotlin/Native 编译缓存

此版本解决了 Compose Multiplatform 编译器插件的兼容性问题，该问题主要影响 iOS 的 Compose Multiplatform 项目。

为了解决此问题，您必须通过使用 `kotlin.native.cacheKind=none` Gradle 属性来禁用缓存。然而，此解决方法会带来性能成本：由于 Kotlin/Native 编译器中缓存不起作用，这会减慢编译时间。

现在该问题已修复，您可以从 `gradle.properties` 文件中移除 `kotlin.native.cacheKind=none`，并在您的 Compose Multiplatform 项目中享受改进的编译时间。

有关改进编译时间的更多提示，请参阅 [Kotlin/Native 文档](native-improving-compilation-time.md)。

### 兼容性指南

配置项目时，请检查 Kotlin Multiplatform Gradle 插件与可用 Gradle、Xcode 和 Android Gradle 插件 (AGP) 版本的兼容性：

| Kotlin Multiplatform Gradle 插件 | Gradle | Android Gradle 插件 | Xcode |
|---------------------------|------|----|----|
| 1.9.20        | 7.5 及更高 | 7.4.2–8.2 | 15.0。详见下文 |

截至此版本，推荐的 Xcode 版本是 15.0。Xcode 15.0 随附的库已完全支持，您可以从 Kotlin 代码的任何位置访问它们。

然而，Xcode 14.3 在大多数情况下仍然可以工作。请记住，如果您在本地机器上使用 14.3 版本，Xcode 15 随附的库将可见但不可访问。

## Kotlin/Wasm

在 1.9.20 中，Kotlin Wasm 达到了稳定性的 [Alpha 级别](components-stability.md)。

* [与 Wasm GC 阶段 4 和最终操作码的兼容性](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
* [新的 `wasm-wasi` 目标，以及 `wasm` 目标重命名为 `wasm-js`](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [标准库对 WASI API 的支持](#support-for-the-wasi-api-in-the-standard-library)
* [Kotlin/Wasm API 改进](#kotlin-wasm-api-improvements)

> Kotlin Wasm 是 [Alpha](components-stability.md) 级别的。它可能随时更改。仅将其用于评估目的。
>
> 我们非常感谢您在 [YouTrack](https://kotl.in/issue) 上提供的反馈。
>
{style="note"}

### 与 Wasm GC 阶段 4 和最终操作码的兼容性

Wasm GC 进入最终阶段，需要更新操作码（二进制表示中使用的常量数字）。Kotlin 1.9.20 支持最新的操作码，因此我们强烈建议您将 Wasm 项目更新到最新版本的 Kotlin。我们还建议使用支持 Wasm 环境的最新版本浏览器：
* Chrome 和基于 Chromium 的浏览器版本 119 或更高。
* Firefox 版本 119 或更高。请注意，在 Firefox 119 中，您需要[手动打开 Wasm GC](wasm-troubleshooting.md)。

### 新的 wasm-wasi 目标，以及 wasm 目标重命名为 wasm-js

在此版本中，我们为 Kotlin/Wasm 引入了一个新目标——`wasm-wasi`。我们还将 `wasm` 目标重命名为 `wasm-js`。在 Gradle DSL 中，这些目标分别以 `wasmWasi {}` 和 `wasmJs {}` 的形式可用。

要在您的项目中使用这些目标，请更新 `build.gradle.kts` 文件：

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

先前引入的 `wasm {}` 块已弃用，取而代之的是 `wasmJs {}`。

要迁移您现有的 Kotlin/Wasm 项目，请执行以下操作：
* 在 `build.gradle.kts` 文件中，将 `wasm {}` 块重命名为 `wasmJs {}`。
* 在您的项目结构中，将 `wasmMain` 目录重命名为 `wasmJsMain`。

### 标准库对 WASI API 的支持

在此版本中，我们包含了对 [WASI](https://github.com/WebAssembly/WASI) 的支持，WASI 是 Wasm 平台的系统接口。WASI 支持使您更容易在浏览器之外使用 Kotlin/Wasm，例如在服务器端应用程序中，它通过提供一组标准化的 API 来访问系统资源。此外，WASI 还提供基于能力的安全性——访问外部资源时的另一层安全性。

要运行 Kotlin/Wasm 应用程序，您需要一个支持 Wasm 垃圾回收 (GC) 的 VM，例如 Node.js 或 Deno。Wasmtime、WasmEdge 等仍在努力实现完整的 Wasm GC 支持。

要导入 WASI 函数，请使用 `@WasmImport` 注解：

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[您可以在我们的 GitHub 仓库中找到一个完整示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)。

> 针对 `wasmWasi` 时，无法使用[与 JavaScript 的互操作性](wasm-js-interop.md)。
>
{style="note"}

### Kotlin/Wasm API 改进

此版本为 Kotlin/Wasm API 带来了一些生活质量改进。例如，您不再需要为 DOM 事件监听器返回一个值：

<table>
   <tr>
       <td>1.9.20 之前</td>
       <td>1.9.20 中</td>
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

Kotlin 1.9.20 完全兼容 Gradle 6.8.3 到 8.1 版本。您也可以使用最新的 Gradle 版本，但请记住，您可能会遇到弃用警告或某些新的 Gradle 功能可能无法正常工作。

此版本带来以下更改：
* [支持测试 fixture 访问内部声明](#support-for-test-fixtures-to-access-internal-declarations)
* [配置 Konan 目录路径的新属性](#new-property-to-configure-paths-to-konan-directories)
* [Kotlin/Native 任务的新构建报告指标](#new-build-report-metrics-for-kotlin-native-tasks)

### 支持测试 fixture 访问内部声明

在 Kotlin 1.9.20 中，如果您使用 Gradle 的 `java-test-fixtures` 插件，那么您的[测试 fixture](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) 现在可以访问主源集类中的 `internal` 声明。此外，任何测试源也可以查看测试 fixture 类中的任何 `internal` 声明。

### 配置 Konan 目录路径的新属性

在 Kotlin 1.9.20 中，`kotlin.data.dir` Gradle 属性可用于自定义您的 `~/.konan` 目录路径，这样您就不必通过环境变量 `KONAN_DATA_DIR` 进行配置了。

或者，您可以使用 `-Xkonan-data-dir` 编译器选项，通过 `cinterop` 和 `konanc` 工具配置您的 `~/.konan` 目录的自定义路径。

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

此外，`kotlin.experimental.tryK2` 构建报告现在包含所有已编译的 Kotlin/Native 任务，并列出所使用的语言版本：

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

> 如果您使用 Gradle 8.0，可能会遇到构建报告方面的一些问题，尤其是在启用 Gradle 配置缓存时。这是一个已知问题，已在 Gradle 8.1 及更高版本中修复。
>
{style="note"}

## 标准库

在 Kotlin 1.9.20 中，[Kotlin/Native 标准库变得稳定 (Stable)](#the-kotlin-native-standard-library-becomes-stable)，并有一些新功能：
* [Enum 类 values 泛型函数的替换](#replacement-of-the-enum-class-values-generic-function)
* [Kotlin/JS 中 HashMap 操作的性能改进](#improved-performance-of-hashmap-operations-in-kotlin-js)

### Enum 类 values 泛型函数的替换

> 此功能是[实验性的 (Experimental)](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。需要选择启用 (详见下文)。仅将其用于评估目的。我们非常感谢您在 [YouTrack](https://kotl.in/issue) 上提供的反馈。
>
{style="warning"}

在 Kotlin 1.9.0 中，枚举类的 `entries` 属性已变为稳定 (Stable)。`entries` 属性是合成函数 `values()` 的现代化且高性能的替代品。作为 Kotlin 1.9.20 的一部分，泛型函数 `enumValues<T>()` 有了一个替代品：`enumEntries<T>()`。

> 仍支持 `enumValues<T>()` 函数，但我们建议您改用 `enumEntries<T>()` 函数，因为它对性能影响较小。每次调用 `enumValues<T>()` 都会创建一个新数组，而每次调用 `enumEntries<T>()` 都会返回相同的列表，效率更高。
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

#### 如何启用 enumEntries 函数

要尝试此功能，请使用 `@OptIn(ExperimentalStdlibApi)` 选择启用，并使用语言版本 1.9 或更高。如果您使用最新版本的 Kotlin Gradle 插件，则无需指定语言版本即可测试该功能。

### Kotlin/Native 标准库变得稳定 (Stable)

在 Kotlin 1.9.0 中，我们[解释了](whatsnew19.md#the-kotlin-native-standard-library-s-journey-towards-stabilization)我们为使 Kotlin/Native 标准库更接近稳定化目标所采取的行动。在 Kotlin 1.9.20 中，我们最终完成了这项工作，并使 Kotlin/Native 标准库变得稳定 (Stable)。以下是此版本的一些亮点：

* [`Vector128`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-vector128/) 类已从 `kotlin.native` 包移动到 `kotlinx.cinterop` 包。
* 在 Kotlin 1.9.0 中引入的 `ExperimentalNativeApi` 和 `NativeRuntimeApi` 注解的选择启用要求级别已从 `WARNING` 提高到 `ERROR`。
* Kotlin/Native 集合现在可以检测并发修改，例如在 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/) 和 [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/) 集合中。
* `Throwable` 类中的 [`printStackTrace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/print-stack-trace.html) 函数现在打印到 `STDERR` 而不是 `STDOUT`。
  > `printStackTrace()` 的输出格式不稳定 (Stable)，可能会发生变化。
  >
  {style="warning"}

#### Atomics API 改进

在 Kotlin 1.9.0 中，我们提到 Atomics API 将在 Kotlin/Native 标准库变得稳定 (Stable) 时达到稳定。Kotlin 1.9.20 包含以下额外更改：

* 引入了实验性的 `AtomicIntArray`、`AtomicLongArray` 和 `AtomicArray<T>` 类。这些新类旨在与 Java 的原子数组保持一致，以便将来可以将它们包含在通用标准库中。
  > `AtomicIntArray`、`AtomicLongArray` 和 `AtomicArray<T>` 类是[实验性的 (Experimental)](components-stability.md#stability-levels-explained)。它们可能随时被删除或更改。要尝试它们，请使用 `@OptIn(ExperimentalStdlibApi)` 选择启用。仅将其用于评估目的。我们非常感谢您在 [YouTrack](https://kotl.in/issue) 上提供的反馈。
  >
  {style="warning"}
* 在 `kotlin.native.concurrent` 包中，Kotlin 1.9.0 中弃用级别为 `WARNING` 的 Atomics API 的弃用级别已提高到 `ERROR`。
* 在 `kotlin.concurrent` 包中，[`AtomicInt`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-int/index.html) 和 [`AtomicLong`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-long/index.html) 类中弃用级别为 `ERROR` 的成员函数已被移除。
* `AtomicReference` 类的所有[成员函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions)现在都使用原子内在函数。

有关 Kotlin 1.9.20 中所有更改的更多信息，请参阅我们的 [YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-61028/Behavioural-changes-to-the-Native-stdlib-API)。

### Kotlin/JS 中 HashMap 操作的性能改进

Kotlin 1.9.20 提高了 Kotlin/JS 中 `HashMap` 操作的性能并减少了它们的内存占用。在内部，Kotlin/JS 已将其内部实现更改为开放寻址。这意味着您在以下情况下应该会看到性能改进：
* 将新元素插入到 `HashMap` 中。
* 在 `HashMap` 中搜索现有元素。
* 迭代 `HashMap` 中的键或值。

## 文档更新

Kotlin 文档进行了一些显著更改：
* [JVM 元数据](https://kotlinlang.org/api/kotlinx-metadata-jvm/) API 参考 – 探索如何使用 Kotlin/JVM 解析元数据。
* [时间测量指南](time-measurement.md) – 了解如何在 Kotlin 中计算和测量时间。
* [Kotlin 之旅](kotlin-tour-welcome.md)中改进的集合章节 – 通过包含理论和实践的章节学习 Kotlin 编程语言的基础知识。
* [确定非空类型](generics.md#definitely-non-nullable-types) – 了解确定非空的泛型类型。
* 改进的[数组页面](arrays.md) – 了解数组及其使用时机。
* [Kotlin Multiplatform 中的 expected 和 actual 声明](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) – 了解 Kotlin Multiplatform 中 expected 和 actual 声明的 Kotlin 机制。

## 安装 Kotlin 1.9.20

### 检查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.x 和 2023.2.x 会自动建议将 Kotlin 插件更新到 1.9.20 版本。IntelliJ IDEA 2023.3 将包含 Kotlin 1.9.20 插件。

Android Studio Hedgehog (231) 和 Iguana (232) 将在其即将发布的版本中支持 Kotlin 1.9.20。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20)下载。

### 配置 Gradle 设置

要下载 Kotlin 工件和依赖项，请更新您的 `settings.gradle(.kts)` 文件以使用 Maven Central 仓库：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

如果未指定仓库，Gradle 将使用已废弃的 JCenter 仓库，这可能导致 Kotlin 工件出现问题。