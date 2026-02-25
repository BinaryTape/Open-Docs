[//]: # (title: Kotlin 1.9.20 最新变化)

<web-summary>阅读 Kotlin 1.9.20 版本说明，涵盖新的语言功能、Kotlin Multiplatform、JVM、Native、JS 和 Wasm 的更新，以及 Gradle 和 Maven 的构建工具支持。</web-summary>

_[发布日期：2023 年 11 月 1 日](releases.md#release-history)_

Kotlin 1.9.20 版本现已发布，[适用于所有目标的 K2 编译器现已进入 Beta 阶段](#new-kotlin-k2-compiler-updates)，[Kotlin Multiplatform 现在已进入稳定阶段](#kotlin-multiplatform-is-stable)。此外，以下是一些主要亮点：

* [用于设置多平台项目的新默认层次结构模板](#template-for-configuring-multiplatform-projects)
* [在 Kotlin Multiplatform 中完全支持 Gradle 配置缓存](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Kotlin/Native 中默认启用自定义内存分配器](#custom-memory-allocator-enabled-by-default)
* [Kotlin/Native 垃圾回收器的性能改进](#performance-improvements-for-the-garbage-collector)
* [Kotlin/Wasm 中新增和重命名的目标](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [Kotlin/Wasm 标准库支持 WASI API](#support-for-the-wasi-api-in-the-standard-library)

你也可以在此视频中找到更新的简短概述：

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="Kotlin 1.9.20 最新变化"/>

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布过程](releases.md)。
>
{style="tip"}

## IDE 支持

支持 1.9.20 的 Kotlin 插件适用于：

| IDE            | 支持的版本                                |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |

> 从 IntelliJ IDEA 2023.3.x 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件会被自动包含并更新。你只需要更新项目中使用的 Kotlin 版本即可。
>
{style="note"}

## 新的 Kotlin K2 编译器更新

JetBrains 的 Kotlin 团队正在继续稳定新的 K2 编译器，它将带来重大的性能改进，加快新语言功能的开发速度，统一 Kotlin 支持的所有平台，并为多平台项目提供更好的架构。

K2 目前在所有目标上都处于 **Beta** 阶段。[在发布博客文章中阅读更多内容](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### 支持 Kotlin/Wasm

自此版本起，Kotlin/Wasm 开始支持新的 K2 编译器。[了解如何在你的项目中启用它](#how-to-enable-the-kotlin-k2-compiler)。

### 预览支持 K2 的 kapt 编译器插件

> kapt 编译器插件对 K2 的支持是 [实验性的](components-stability.md)。需要显式开启（详见下文），且仅应将其用于评估目的。
>
{style="warning"}

在 1.9.20 中，你可以尝试在 K2 编译器中使用 [kapt 编译器插件](kapt.md)。要在项目中使用 K2 编译器，请将以下选项添加到你的 `gradle.properties` 文件中：

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

或者，你也可以通过以下步骤为 kapt 启用 K2：
1. 在你的 `build.gradle.kts` 文件中，[将语言版本设置](gradle-compiler-options.md#example-of-setting-languageversion) 为 `2.0`。
2. 在你的 `gradle.properties` 文件中，添加 `kapt.use.k2=true`。

如果你在 K2 编译器中使用 kapt 时遇到任何问题，请报告到我们的 [问题跟踪器](http://kotl.in/issue)。

### 如何启用 Kotlin K2 编译器

#### 在 Gradle 中启用 K2

要启用并测试 Kotlin K2 编译器，请使用以下编译器选项指定新的语言版本：

```bash
-language-version 2.0
```

你可以在 `build.gradle.kts` 文件中指定它：

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

### 留下你对新 K2 编译器的反馈

我们非常感谢你能提供任何反馈！

* 在 Kotlin Slack 上直接向 K2 开发者提供反馈 —— [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
* 在 [我们的问题跟踪器](https://kotl.in/issue) 上报告你使用新 K2 编译器时遇到的任何问题。
* [启用发送使用统计数据选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，允许 JetBrains 收集有关 K2 使用情况的匿名数据。

## Kotlin/JVM

从 1.9.20 版本开始，编译器可以生成包含 Java 21 字节码的类。

## Kotlin/Native

Kotlin 1.9.20 包含了一个稳定的内存管理器，默认启用了新的内存分配器，改进了垃圾回收器的性能，并进行了其他更新：

* [默认启用自定义内存分配器](#custom-memory-allocator-enabled-by-default)
* [垃圾回收器的性能改进](#performance-improvements-for-the-garbage-collector)
* [`klib` 构件的增量编译](#incremental-compilation-of-klib-artifacts)
* [管理库链接问题](#managing-library-linkage-issues)
* [在调用类构造函数时初始化伴生对象](#companion-object-initialization-on-class-constructor-calls)
* [所有 cinterop 声明均需显式开启](#opt-in-requirement-for-all-cinterop-declarations)
* [链接器错误的自定义消息](#custom-message-for-linker-errors)
* [移除旧版内存管理器](#removal-of-the-legacy-memory-manager)
* [更改目标层级策略](#change-to-our-target-tiers-policy)

### 默认启用自定义内存分配器

Kotlin 1.9.20 默认启用了新的内存分配器。它旨在取代之前的默认分配器 `mimalloc`，以使垃圾回收更加高效，并提高 [Kotlin/Native 内存管理器](native-memory-manager.md) 的运行时性能。

新的自定义分配器将系统内存划分为页，允许按连续顺序进行独立扫描。每次分配都会成为页内的一个内存块，并且页会跟踪块的大小。不同的页类型针对各种分配大小进行了优化。内存块的连续安排确保了能高效地遍历所有已分配的块。

当线程分配内存时，它会根据分配大小寻找合适的页。线程维护着一组针对不同大小类别的页。通常，给定大小的当前页可以容纳该分配。如果不行，线程会从共享分配空间请求一个不同的页。这个页可能已经存在、需要扫描清理，或者必须先创建。

新的分配器允许同时存在多个独立的分配空间，这将使 Kotlin 团队能够尝试不同的页布局，以进一步提高性能。

#### 如何启用自定义内存分配器

从 Kotlin 1.9.20 开始，新的内存分配器是默认设置。无需额外配置。

如果你遇到内存消耗过高的情况，可以在 Gradle 构建脚本中使用 `-Xallocator=mimalloc` 或 `-Xallocator=std` 切换回 `mimalloc` 或系统分配器。请在 [YouTrack](https://kotl.in/issue) 中报告此类问题，以帮助我们改进新的内存分配器。

有关新分配器设计的技术细节，请参阅此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。

### 垃圾回收器的性能改进

Kotlin 团队继续改进新 Kotlin/Native 内存管理器的性能和稳定性。此版本对垃圾回收器 (GC) 进行了许多重大更改，包括以下 1.9.20 亮点：

* [](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### 全并行标记以减少 GC 暂停时间

此前，默认的垃圾回收器仅执行部分并行标记。当赋值器线程（mutator thread）暂停时，它会从自己的根（roots，如线程本地变量和调用堆栈）开始标记 GC。与此同时，一个独立的 GC 线程负责从全局根以及所有正在积极运行原生代码（因此未暂停）的赋值器根开始标记。

在全局对象数量有限且赋值器线程花费大量时间在可运行状态下执行 Kotlin 代码的情况下，这种方法效果很好。然而，典型的 iOS 应用程序并非如此。

现在，GC 使用全并行标记，结合了已暂停的赋值器、GC 线程和可选的标记线程来处理标记队列。默认情况下，标记过程由以下部分执行：

* 已暂停的赋值器。它们不再只是处理自己的根然后在不执行代码时闲置，而是参与整个标记过程。
* GC 线程。这确保了至少有一个线程在执行标记。

这种新方法使标记过程更加高效，减少了 GC 的暂停时间。

#### 以大块跟踪内存以提高分配性能

此前，GC 调度程序会单独跟踪每个对象的分配。然而，无论是新的默认自定义分配器还是 `mimalloc` 内存分配器都不会为每个对象分配单独的存储空间；它们会一次性为多个对象分配大块区域。

在 Kotlin 1.9.20 中，GC 跟踪区域而不是单个对象。这通过减少每次分配时执行的任务数量来加快小对象的分配，从而有助于最大程度地减少垃圾回收器的内存使用。

### klib 构件的增量编译

> 此功能是 [实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。需要显式开启（详见下文）。请仅将其用于评估目的。我们欢迎你在 [YouTrack](https://kotl.in/issue) 上提供相关反馈。
>
{style="warning"}

Kotlin 1.9.20 为 Kotlin/Native 引入了一种新的编译时间优化。将 `klib` 构件编译为原生代码现在实现了部分增量化。

在调试模式下将 Kotlin 源代码编译为原生二进制文件时，编译会经历两个阶段：

1. 源代码被编译成 `klib` 构件。
2. `klib` 构件连同依赖项一起被编译成二进制文件。

为了优化第二阶段的编译时间，团队已经实现了依赖项的编译器缓存。它们只会被编译为原生代码一次，结果在每次编译二进制文件时重用。但是从项目源代码构建的 `klib` 构件在每次项目更改时总是会被完整地重新编译为原生代码。

通过新的增量编译，如果项目模块的更改仅导致源代码部分重新编译为 `klib` 构件，那么只有 `klib` 的一部分会进一步重新编译为二进制文件。

要启用增量编译，请将以下选项添加到你的 `gradle.properties` 文件中：

```none
kotlin.incremental.native=true
```

如果你遇到任何问题，请将此类情况报告至 [YouTrack](https://kotl.in/issue)。

### 管理库链接问题

此版本改进了 Kotlin/Native 编译器处理 Kotlin 库中链接问题的方式。错误消息现在包含更具可读性的声明，因为它们使用签名名称而不是哈希值，从而帮助你更轻松地找到并修复问题。以下是一个示例：

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Native 编译器会检测第三方 Kotlin 库之间的链接问题，并在运行时报告错误。如果一个第三方 Kotlin 库的作者在另一个第三方 Kotlin 库使用的实验性 API 中进行了不兼容的更改，你可能会遇到此类问题。

从 Kotlin 1.9.20 开始，编译器默认在静默模式下检测链接问题。你可以在项目中调整此设置：

* 如果你想在编译日志中记录这些问题，请使用 `-Xpartial-linkage-loglevel=WARNING` 编译器选项启用警告。
* 也可以通过 `-Xpartial-linkage-loglevel=ERROR` 将报告的警告严重级别提升为编译错误。在这种情况下，编译会失败，你会在编译日志中获得所有错误。使用此选项可以更仔细地检查链接问题。

```kotlin
// 在 Gradle 构建文件中传递编译器选项的示例：
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 将链接问题作为警告报告：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // 将链接警告提升为错误：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

如果你在使用此功能时遇到意外问题，可以随时通过 `-Xpartial-linkage=disable` 编译器选项退出。请随时向 [我们的问题跟踪器](https://kotl.in/issue) 报告此类情况。

### 在调用类构造函数时初始化伴生对象

从 Kotlin 1.9.20 开始，Kotlin/Native 后端在类构造函数中调用伴生对象的静态初始值设定项：

```kotlin
class Greeting {
    companion object {
        init {
            print("Hello, Kotlin!") 
        }
    }
}

fun main() {
    val start = Greeting() // 输出 "Hello, Kotlin!"
}
```

现在的行为与 Kotlin/JVM 统一，在 Kotlin/JVM 中，当加载（解析）与 Java 静态初始值设定项语义匹配的相应类时，会初始化伴生对象。

既然此功能的实现在不同平台之间更加一致，那么在 Kotlin 多平台项目中共享代码就会更容易。

### 所有 cinterop 声明均需显式开启

从 Kotlin 1.9.20 开始，所有由 `cinterop` 工具从 C 和 Objective-C 库（如 libcurl 和 libxml）生成的 Kotlin 声明都被标记为 `@ExperimentalForeignApi`。如果缺少显式开启注解，你的代码将无法编译。

这一要求反映了导入 C 和 Objective-C 库的 [实验性](components-stability.md#stability-levels-explained) 状态。我们建议你将其使用限制在项目中的特定区域。一旦我们开始稳定导入功能，这将使你的迁移更加容易。

> 至于随 Kotlin/Native 提供的原生平台库（如 Foundation、UIKit 和 POSIX），只有它们的某些 API 需要通过 `@ExperimentalForeignApi` 显式开启。在这种情况下，你会收到一个带有显式开启要求的警告。
>
{style="note"}

### 链接器错误的自定义消息

如果你是库作者，现在可以通过自定义消息帮助用户解决链接器错误。

如果你的 Kotlin 库依赖于 C 或 Objective-C 库（例如，使用 [CocoaPods 集成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)），其用户需要在本地机器上拥有这些依赖库，或在项目构建脚本中显式配置它们。如果不是这种情况，用户以前会收到一条令人困惑的 "Framework not found" 消息。

你现在可以在编译失败消息中提供具体的说明或链接。为此，请将 `-Xuser-setup-hint` 编译器选项传递给 `cinterop` 或在 `.def` 文件中添加 `userSetupHint=message` 属性。

### 移除旧版内存管理器

[新的内存管理器](native-memory-manager.md) 在 Kotlin 1.6.20 中引入，并在 1.7.20 中成为默认设置。自那时起，它一直在接受进一步的更新和性能改进，并已进入稳定阶段。

现在是时候完成弃用周期并移除旧版内存管理器了。如果你仍在使用它，请从 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=strict` 选项，并按照我们的 [迁移指南](native-migration-guide.md) 进行必要的更改。

### 更改目标层级策略

我们决定升级 [1 级支持](native-target-support.md#tier-1) 的要求。Kotlin 团队现在致力于为符合 1 级标准的目标在编译器版本之间提供源代码和二进制兼容性。它们还必须定期使用 CI 工具进行测试，以便能够编译和运行。目前，1 级包括 macOS 主机的以下目标：

* `macosX64`
* `macosArm64`
* `iosSimulatorArm64`
* `iosX64`

在 Kotlin 1.9.20 中，我们还移除了一些之前弃用的目标，即：

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxMips32`
* `linuxMipsel32`

查看当前 [支持的目标](native-target-support.md) 的完整列表。

## Kotlin Multiplatform

Kotlin 1.9.20 专注于 Kotlin Multiplatform 的稳定化，并在通过新的项目向导和其他显著功能改善开发者体验方面迈出了新步伐：

* [Kotlin Multiplatform 现在已进入稳定阶段](#kotlin-multiplatform-is-stable)
* [用于配置多平台项目的模板](#template-for-configuring-multiplatform-projects)
* [新项目向导](#new-project-wizard)
* [完全支持 Gradle 配置缓存](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [在 Gradle 中更轻松地配置新标准库版本](#easier-configuration-of-new-standard-library-versions-in-gradle)
* [默认支持第三方 cinterop 库](#default-support-for-third-party-cinterop-libraries)
* [支持 Compose Multiplatform 项目中的 Kotlin/Native 编译缓存](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
* [兼容性指南](#compatibility-guidelines)

### Kotlin Multiplatform 现在已进入稳定阶段

1.9.20 版本的发布标志着 Kotlin 演进过程中的一个重要里程碑：[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html) 终于进入了稳定阶段。这意味着该技术可以安全地用于你的项目，并已 100% 为生产环境做好准备。这也意味着 Kotlin Multiplatform 的进一步开发将遵循我们严格的 [向后兼容性规则](https://kotlinfoundation.org/language-committee-guidelines/)。

请注意，Kotlin Multiplatform 的一些高级功能仍在演进中。在使用它们时，你会收到一条警告，描述你所使用的功能的当前稳定性状态。在 IntelliJ IDEA 中使用任何实验性功能之前，你需要前往 **Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform** 中显式启用它。

* 访问 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，详细了解 Kotlin Multiplatform 的稳定化和未来计划。
* 查看 [多平台兼容性指南](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html)，了解在稳定化过程中做出的重大更改。
* 了解 [expect 和 actual 声明机制](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)，这是 Kotlin Multiplatform 的重要组成部分，在此版本中也得到了部分稳定。

### 用于配置多平台项目的模板

从 Kotlin 1.9.20 开始，Kotlin Gradle 插件会自动为流行的多平台场景创建共享源集。如果你的项目设置是其中之一，则无需手动配置源集层次结构。只需显式指定项目所需的目标即可。

得益于默认层次结构模板（Kotlin Gradle 插件的一项新功能），设置现在变得更加容易。它是内置在插件中的预定义源集层次结构模板。它包含了 Kotlin 为你声明的目标自动创建的中间源集。[查看完整模板](#see-the-full-hierarchy-template)。

#### 更轻松地创建你的项目

考虑一个同时针对 Android 和 iPhone 设备并在 Apple 芯片 MacBook 上开发的多平台项目。对比一下该项目在不同 Kotlin 版本之间的设置方式：

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

    // 会自动创建 iosMain 源集
}
```

</td>
</tr>
</table>

请注意，使用默认层次结构模板显著减少了设置项目所需的模板代码量。

当你在代码中声明 `androidTarget`、`iosArm64` 和 `iosSimulatorArm64` 目标时，Kotlin Gradle 插件会从模板中找到合适的共享源集并为你创建它们。生成的层次结构如下所示：

![默认目标层次结构使用示例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

绿色的源集是实际创建并包含在项目中的，而默认模板中灰色的源集则被忽略。

#### 对源集使用补全

为了更轻松地处理所创建的项目结构，IntelliJ IDEA 现在为使用默认层次结构模板创建的源集提供补全：

<img src="multiplatform-hierarchy-completion.animated.gif" alt="源集名称的 IDE 补全" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

如果你尝试访问由于未声明相应目标而导致不存在的源集，Kotlin 也会向你发出警告。在下面的示例中，没有 JVM 目标（只有 `androidTarget`，两者并不相同）。但让我们尝试使用 `jvmMain` 源集，看看会发生什么：

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

#### 设置目标层次结构

从 Kotlin 1.9.20 开始，默认层次结构模板会自动启用。在大多数情况下，无需额外配置。

但是，如果你正在迁移 1.9.20 之前创建的现有项目，并且之前曾通过 `dependsOn()` 调用手动引入了中间源集，则可能会遇到警告。要解决此问题，请执行以下操作：

* 如果你目前的中间源集已被默认层次结构模板覆盖，请移除所有手动的 `dependsOn()` 调用以及通过 `by creating` 结构创建的源集。

  要查看所有默认源集的列表，请参阅 [完整层次结构模板](#see-the-full-hierarchy-template)。

* 如果你想拥有默认层次结构模板不提供的额外源集，例如在 macOS 和 JVM 目标之间共享代码的源集，请通过 `applyDefaultHierarchyTemplate()` 显式重新应用模板来调整层次结构，并像往常一样使用 `dependsOn()` 手动配置额外的源集：

  ```kotlin
  kotlin {
      jvm()
      macosArm64()
      iosArm64()
      iosSimulatorArm64()

      // 显式应用默认层次结构。它将创建诸如 iosMain 之类的源集：
      applyDefaultHierarchyTemplate()

      sourceSets {
          // 创建一个额外的 jvmAndMacos 源集
          val jvmAndMacos by creating {
              dependsOn(commonMain.get())
          }

          macosArm64Main.get().dependsOn(jvmAndMacos)
          jvmMain.get().dependsOn(jvmAndMacos)
      }
  }
  ```

* 如果你的项目中已经存在与模板生成的名称完全相同的源集，但它们在不同的目标集之间共享，那么目前无法修改模板源集之间默认的 `dependsOn` 关系。

  你可以在这里选择为你的目的寻找不同的源集，可以是在默认层次结构模板中，也可以是手动创建的。另一种选择是完全退出模板。

  要退出，请在你的 `gradle.properties` 中添加 `kotlin.mpp.applyDefaultHierarchyTemplate=false`，并手动配置所有其他源集。

  我们目前正在开发用于创建自定义层次结构模板的 API，以简化此类情况下的设置过程。

#### 查看完整层次结构模板 {initial-collapse-state="collapsed" collapsible="true"}

当你声明项目编译的目标时，插件会相应地从模板中挑选共享源集并在你的项目中创建它们。

![默认层次结构模板](full-template-hierarchy.svg)

> 此示例仅显示项目的生产部分，省略了 `Main` 后缀（例如，使用 `common` 而不是 `commonMain`）。但是，`*Test` 源集的情况也是一样的。
>
{style="tip"}

### 新项目向导

JetBrains 团队正在引入一种创建跨平台项目的新方式 —— [Kotlin Multiplatform 网页向导](https://kmp.jetbrains.com)。

这个新 Kotlin Multiplatform 向导的第一个实现涵盖了最流行的 Kotlin Multiplatform 用例。它整合了有关先前项目模板的所有反馈，并使架构尽可能稳健和可靠。

新向导采用了分布式架构，允许我们拥有统一的后端和不同的前端，网页版是第一步。我们正在考虑在未来实现 IDE 版本并创建命令行工具。在网页上，你始终能获得最新版本的向导，而在 IDE 中，你需要等待下一次发布。

通过新向导，项目设置比以往任何时候都更容易。你可以通过为移动、服务器和桌面开发选择目标平台来根据你的需求量身定制项目。我们还计划在未来的版本中添加网页开发。

<img src="multiplatform-web-wizard.png" alt="Multiplatform 网页向导" width="400"/>

新项目向导现在是使用 Kotlin 创建跨平台项目的首选方式。自 1.9.20 起，Kotlin 插件不再在 IntelliJ IDEA 中提供 **Kotlin Multiplatform** 项目向导。

新向导将轻松引导你完成初始设置，使入门过程更加顺畅。如果你遇到任何问题，请将其报告给 [YouTrack](https://kotl.in/issue)，以帮助我们改进你对向导的使用体验。

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="创建项目" style="block"/>
</a>

### 在 Kotlin Multiplatform 中完全支持 Gradle 配置缓存

此前，我们引入了 Gradle 配置缓存的 [预览版](whatsnew19.md#preview-of-the-gradle-configuration-cache)，该预览版可用于 Kotlin 多平台库。在 1.9.20 中，Kotlin Multiplatform 插件更进了一步。

它现在在 [Kotlin CocoaPods Gradle 插件](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html) 以及 Xcode 构建所需的集成任务（如 `embedAndSignAppleFrameworkForXcode`）中支持 Gradle 配置缓存。

现在，所有多平台项目都可以利用改进后的构建时间。Gradle 配置缓存通过重用后续构建的配置阶段结果来加速构建过程。有关更多详情和设置说明，请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)。

### 在 Gradle 中更轻松地配置新标准库版本

当你创建一个多平台项目时，标准库 (`stdlib`) 的依赖项会自动添加到每个源集中。这是开始多平台项目最简单的方法。

此前，如果你想手动配置对标准库的依赖，你需要为每个源集单独配置。从 `kotlin-stdlib:1.9.20` 开始，你只需要在 `commonMain` 根源集中配置 **一次** 依赖项：

<table>
   <tr>
       <td>标准库 1.9.10 及更早版本</td>
       <td>标准库 1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    sourceSets {
        // 对于 common 源集
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-common:1.9.10")
            }
        }

        // 对于 JVM 源集
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // 对于 JS 源集
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

这一变化之所以能够实现，是因为在标准库的 Gradle 元数据中包含了新信息。这使得 Gradle 能够自动为其他源集解析正确的标准库构件。

### 默认支持第三方 cinterop 库

Kotlin 1.9.20 为应用了 [Kotlin CocoaPods Gradle](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) 插件的项目中的所有 cinterop 依赖项添加了默认支持（而不是通过显式开启支持）。

这意味着你现在可以共享更多原生代码，而不受平台特定依赖项的限制。例如，你可以向 `iosMain` 共享源集添加 [对 Pod 库的依赖](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html)。

此前，这仅适用于随 Kotlin/Native 发行版提供的 [平台特定库](native-platform-libs.md)（如 Foundation、UIKit 和 POSIX）。现在，所有第三方 Pod 库默认在共享源集中可用。你不再需要指定单独的 Gradle 属性来支持它们。

### 支持 Compose Multiplatform 项目中的 Kotlin/Native 编译缓存

此版本解决了与 Compose Multiplatform 编译器插件的兼容性问题，该问题主要影响 iOS 的 Compose Multiplatform 项目。

为了解决这个问题，你以前必须通过使用 `kotlin.native.cacheKind=none` Gradle 属性来禁用缓存。然而，这种变通方法是以性能为代价的：由于缓存无法在 Kotlin/Native 编译器中工作，它降低了编译速度。

现在该问题已修复，你可以从 `gradle.properties` 文件中移除 `kotlin.native.cacheKind=none`，并在 Compose Multiplatform 项目中享受缩短后的编译时间。

有关提高编译时间的更多技巧，请参阅 [Kotlin/Native 文档](native-improving-compilation-time.md)。

### 兼容性指南

在配置项目时，请检查 Kotlin Multiplatform Gradle 插件与可用的 Gradle、Xcode 和 Android Gradle 插件 (AGP) 版本的兼容性：

| Kotlin Multiplatform Gradle 插件 | Gradle | Android Gradle 插件 | Xcode |
|---------------------------|------|----|----|
| 1.9.20        | 7.5 及更高版本 | 7.4.2–8.2 | 15.0。详见下文 |

截至此版本，推荐的 Xcode 版本为 15.0。Xcode 15.0 提供的库已得到完全支持，你可以从 Kotlin 代码中的任何位置访问它们。

不过，Xcode 14.3 在大多数情况下仍可使用。请记住，如果你在本地机器上使用 14.3 版本，Xcode 15 提供的库将可见但不可访问。

## Kotlin/Wasm

在 1.9.20 中，Kotlin Wasm 达到了 [Alpha 级别](components-stability.md) 的稳定性。

* [与 Wasm GC 第 4 阶段和最终操作码的兼容性](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
* [新增 `wasm-wasi` 目标，以及将 `wasm` 目标重命名为 `wasm-js`](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [标准库支持 WASI API](#support-for-the-wasi-api-in-the-standard-library)
* [Kotlin/Wasm API 改进](#kotlin-wasm-api-improvements)

> Kotlin Wasm 处于 [Alpha](components-stability.md) 阶段。
> 它随时可能发生变化。请仅将其用于评估目的。
>
> 我们欢迎你在 [YouTrack](https://kotl.in/issue) 上提供相关反馈。
>
{style="note"}

### 与 Wasm GC 第 4 阶段和最终操作码的兼容性

Wasm GC 进入最终阶段，它需要更新操作码 —— 二进制表示中使用的常量数字。Kotlin 1.9.20 支持最新的操作码，因此我们强烈建议你将 Wasm 项目更新到最新版本的 Kotlin。我们还建议使用带有 Wasm 环境的最新版本的浏览器：
* Chrome 和基于 Chromium 的浏览器为 119 或更新版本。
* Firefox 为 119 或更新版本。请注意，在 Firefox 119 中，你需要 [手动开启 Wasm GC](wasm-configuration.md)。

### 新增 wasm-wasi 目标，以及将 wasm 目标重命名为 wasm-js

在此版本中，我们为 Kotlin/Wasm 引入了一个新目标 —— `wasm-wasi`。我们还将 `wasm` 目标重命名为 `wasm-js`。在 Gradle DSL 中，这些目标分别可用作 `wasmWasi {}` 和 `wasmJs {}`。

要在项目中使用这些目标，请更新 `build.gradle.kts` 文件：

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

之前引入的 `wasm {}` 块已被弃用，取而代之的是 `wasmJs {}`。

要迁移现有的 Kotlin/Wasm 项目，请执行以下操作：
* 在 `build.gradle.kts` 文件中，将 `wasm {}` 块重命名为 `wasmJs {}`。
* 在你的项目结构中，将 `wasmMain` 目录重命名为 `wasmJsMain`。

### 标准库中对 WASI API 的支持

在此版本中，我们包含了对 [WASI](https://github.com/WebAssembly/WASI)（Wasm 平台的系统接口）的支持。WASI 支持通过提供一组用于访问系统资源的标准化 API，使你更容易在浏览器之外（例如在服务器端应用程序中）使用 Kotlin/Wasm。此外，WASI 还提供了基于能力的安全性 —— 这是在访问外部资源时的另一层安全保护。

要运行 Kotlin/Wasm 应用程序，你需要一个支持 Wasm 垃圾回收 (GC) 的虚拟机，例如 Node.js 或 Deno。Wasmtime、WasmEdge 等仍在努力实现完整的 Wasm GC 支持。

要导入 WASI 函数，请使用 `@WasmImport` 注解：

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[你可以在我们的 GitHub 仓库中找到完整示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)。

> 在针对 `wasmWasi` 时，无法使用 [与 JavaScript 的互操作性](wasm-js-interop.md)。
>
{style="note"}

### Kotlin/Wasm API 改进

此版本为 Kotlin/Wasm API 带来了几项易用性改进。例如，你不再需要为 DOM 事件监听器返回值：

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

Kotlin 1.9.20 与 Gradle 6.8.3 到 8.1 完全兼容。你也可以使用直到最新 Gradle 发行版的版本，但如果这样做，请记住你可能会遇到弃用警告，或者某些新的 Gradle 功能可能无法工作。

此版本带来了以下变化：
* [支持测试装置访问 internal 声明](#support-for-test-fixtures-to-access-internal-declarations)
* [用于配置 Konan 目录路径的新属性](#new-property-to-configure-paths-to-konan-directories)
* [Kotlin/Native 任务的新构建报告指标](#new-build-report-metrics-for-kotlin-native-tasks)

### 支持测试装置访问 internal 声明

在 Kotlin 1.9.20 中，如果你使用 Gradle 的 `java-test-fixtures` 插件，那么你的 [测试装置 (test fixtures)](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) 现在可以访问主源集类中的 `internal` 声明。此外，任何测试源集也可以看到测试装置类中的任何 `internal` 声明。

### 用于配置 Konan 目录路径的新属性

在 Kotlin 1.9.20 中，`konan.data.dir` Gradle 属性可用于自定义 `~/.konan` 目录的路径，这样你就不必通过环境变量 `KONAN_DATA_DIR` 来配置它了。

或者，你可以使用 `-Xkonan-data-dir` 编译器选项，通过 `cinterop` 和 `konanc` 工具配置 `~/.konan` 目录的自定义路径。

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

> 如果你使用 Gradle 8.0，在构建报告中可能会遇到一些问题，特别是当启用 Gradle 配置缓存时。这是一个已知问题，已在 Gradle 8.1 及更高版本中修复。
>
{style="note"}

## 标准库

在 Kotlin 1.9.20 中，[Kotlin/Native 标准库进入稳定阶段](#the-kotlin-native-standard-library-becomes-stable)，并有一些新功能：
* [Enum 类 values 泛型函数的替代方案](#replacement-of-the-enum-class-values-generic-function)
* [改进了 Kotlin/JS 中 HashMap 操作的性能](#improved-performance-of-hashmap-operations-in-kotlin-js)

### Enum 类 values 泛型函数的替代方案

> 此功能是 [实验性的](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。需要显式开启（详见下文）。请仅将其用于评估目的。我们欢迎你在 [YouTrack](https://kotl.in/issue) 上提供相关反馈。
>
{style="warning"}

在 Kotlin 1.9.0 中，枚举类的 `entries` 属性进入稳定阶段。`entries` 属性是合成函数 `values()` 的现代化且高性能的替代方案。作为 Kotlin 1.9.20 的一部分，泛型函数 `enumValues<T>()` 也有了替代方案：`enumEntries<T>()`。

> `enumValues<T>()` 函数仍受支持，但我们建议你改用 `enumEntries<T>()` 函数，因为它的性能开销较小。每次调用 `enumValues<T>()` 时都会创建一个新数组，而每次调用 `enumEntries<T>()` 时都会返回同一个列表，这要高效得多。
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

要尝试此功能，请使用 `@OptIn(ExperimentalStdlibApi)` 进行显式开启，并使用语言版本 1.9 或更高版本。如果你使用的是最新版本的 Kotlin Gradle 插件，则无需指定语言版本即可测试该功能。

### Kotlin/Native 标准库进入稳定阶段

在 Kotlin 1.9.0 中，我们 [阐述了](whatsnew19.md#the-kotlin-native-standard-library-s-journey-towards-stabilization) 为使 Kotlin/Native 标准库更接近稳定化目标而采取的行动。在 Kotlin 1.9.20 中，我们终于完成了这项工作，使 Kotlin/Native 标准库进入了稳定阶段。以下是此版本的一些亮点：

* [`Vector128`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-vector128/) 类从 `kotlin.native` 软件包移动到了 `kotlinx.cinterop` 软件包。
* 对 `ExperimentalNativeApi` 和 `NativeRuntimeApi` 注解（在 Kotlin 1.9.0 中引入）的显式开启要求级别已从 `WARNING` 提升为 `ERROR`。
* Kotlin/Native 集合现在会检测并发修改，例如在 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/) 和 [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/) 集合中。
* `Throwable` 类中的 [`printStackTrace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/print-stack-trace.html) 函数现在打印到 `STDERR` 而不是 `STDOUT`。
  > `printStackTrace()` 的输出格式不是稳定的，且随时可能发生变化。
  >
  {style="warning"}

#### Atomics API 的改进

在 Kotlin 1.9.0 中，我们提到当 Kotlin/Native 标准库进入稳定阶段时，Atomics API 也将准备好进入稳定阶段。Kotlin 1.9.20 包含了以下额外更改：

* 引入了实验性的 `AtomicIntArray`、`AtomicLongArray` 和 `AtomicArray<T>` 类。这些新类专门设计为与 Java 的原子数组保持一致，以便将来可以包含在通用标准库中。
  > `AtomicIntArray`、`AtomicLongArray` 和 `AtomicArray<T>` 类是 [实验性的](components-stability.md#stability-levels-explained)。它们可能随时被删除或更改。要尝试它们，请使用 `@OptIn(ExperimentalStdlibApi)` 进行显式开启。请仅将其用于评估目的。我们欢迎你在 [YouTrack](https://kotl.in/issue) 上提供相关反馈。
  >
  {style="warning"}
* 在 `kotlin.native.concurrent` 软件包中，在 Kotlin 1.9.0 中被弃用且弃用级别为 `WARNING` 的 Atomics API，其弃用级别已提升为 `ERROR`。
* 在 `kotlin.concurrent` 软件包中，[`AtomicInt`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-int/index.html) 和 [`AtomicLong`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-long/index.html) 类中弃用级别为 `ERROR` 的成员函数已被移除。
* `AtomicReference` 类的所有 [成员函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions) 现在都使用原子内联函数。

有关 Kotlin 1.9.20 中所有更改的更多信息，请参阅我们的 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-61028/Behavioural-changes-to-the-Native-stdlib-API)。

### 改进了 Kotlin/JS 中 HashMap 操作的性能

Kotlin 1.9.20 提高了 `HashMap` 操作的性能，并减少了它们在 Kotlin/JS 中的内存占用。在内部，Kotlin/JS 已将其内部实现更改为开放寻址。这意味着你在以下操作中应该能看到性能提升：
* 向 `HashMap` 中插入新元素。
* 在 `HashMap` 中搜索现有元素。
* 遍历 `HashMap` 中的键或值。

## 文档更新

Kotlin 文档收到了一些显著的变化：
* [JVM Metadata](https://kotlinlang.org/api/kotlinx-metadata-jvm/) API 参考 —— 探索如何使用 Kotlin/JVM 解析元数据。
* [时间测量指南](time-measurement.md) —— 了解如何在 Kotlin 中计算和测量时间。
* 改进了 [Kotlin 之旅](kotlin-tour-welcome.md) 中的集合章节 —— 通过包含理论和实践的章节学习 Kotlin 编程语言的基础知识。
* [绝对不可为空类型](generics.md#definitely-non-nullable-types) —— 了解绝对不可为空的泛型类型。
* 改进了 [数组页面](arrays.md) —— 了解数组以及何时使用它们。
* [Kotlin Multiplatform 中的 expect 和 actual 声明](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) —— 了解 Kotlin Multiplatform 中 expect 和 actual 声明的 Kotlin 机制。

## 安装 Kotlin 1.9.20

### 检查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.x 和 2023.2.x 会自动建议将 Kotlin 插件更新到 1.9.20 版本。IntelliJ IDEA 2023.3 将包含 Kotlin 1.9.20 插件。

Android Studio Hedgehog (231) 和 Iguana (232) 将在即将发布的版本中支持 Kotlin 1.9.20。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20) 下载。

### 配置 Gradle 设置

要下载 Kotlin 构件和依赖项，请更新你的 `settings.gradle(.kts)` 文件以使用 Maven Central 仓库：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

如果未指定该仓库，Gradle 将使用已停用的 JCenter 仓库，这可能会导致 Kotlin 构件出现问题。