---
title: "Kotlin 1.9.20 中的新特性"
---
_[发布日期：2023 年 11 月 1 日](releases#release-details)_

Kotlin 1.9.20 版本已发布，适用于所有目标的 [K2 编译器现在处于 Beta 阶段](#new-kotlin-k2-compiler-updates)，并且 [Kotlin Multiplatform 现在已稳定](#kotlin-multiplatform-is-stable)。此外，以下是一些主要亮点：

* [用于设置多平台项目的新默认层级结构模板](#template-for-configuring-multiplatform-projects)
* [Kotlin Multiplatform 中对 Gradle 配置缓存的完全支持](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [默认在 Kotlin/Native 中启用的自定义内存分配器](#custom-memory-allocator-enabled-by-default)
* [Kotlin/Native 中垃圾回收器的性能改进](#performance-improvements-for-the-garbage-collector)
* [Kotlin/Wasm 中的新增和重命名的目标](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [Kotlin/Wasm 标准库中对 WASI API 的支持](#support-for-the-wasi-api-in-the-standard-library)

您还可以在此视频中找到更新的简短概述：

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

## IDE 支持

支持 1.9.20 的 Kotlin 插件可用于：

| IDE            | 支持的版本                     |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |
:::note
从 IntelliJ IDEA 2023.3.x 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件会自动包含并更新。您只需更新项目中的 Kotlin 版本即可。

:::

## 新的 Kotlin K2 编译器更新

JetBrains 的 Kotlin 团队正在继续稳定新的 K2 编译器，这将带来重大的性能改进，加速新语言功能的开发，统一 Kotlin 支持的所有平台，并为多平台项目提供更好的架构。

K2 目前处于所有目标的 **Beta** 阶段。[在发布博文中阅读更多信息](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### Kotlin/Wasm 支持

自此版本起，Kotlin/Wasm 支持新的 K2 编译器。[了解如何在您的项目中启用它](#how-to-enable-the-kotlin-k2-compiler)。

### 预览带有 K2 的 kapt 编译器插件

:::note
kapt 编译器插件中对 K2 的支持是 [实验性的](components-stability)。
需要选择启用（请参阅下面的详细信息），您应该仅将其用于评估目的。

在 1.9.20 中，您可以尝试将 [kapt 编译器插件](kapt) 与 K2 编译器一起使用。
要在您的项目中使用 K2 编译器，请将以下选项添加到您的 `gradle.properties` 文件中：

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

或者，您可以通过完成以下步骤来为 kapt 启用 K2：
1. 在您的 `build.gradle.kts` 文件中，[将语言版本设置为](gradle-compiler-options#example-of-setting-languageversion)`2.0`。
2. 在您的 `gradle.properties` 文件中，添加 `kapt.use.k2=true`。

如果您在使用 kapt 和 K2 编译器时遇到任何问题，请将其报告给我们的 [issue tracker](http://kotl.in/issue)。

### 如何启用 Kotlin K2 编译器

#### 在 Gradle 中启用 K2

要启用和测试 Kotlin K2 编译器，请使用带有以下编译器选项的新语言版本：

```bash
-language-version 2.0
```

您可以在您的 `build.gradle.kts` 文件中指定它：

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

我们将不胜感激您的任何反馈！

* 在 Kotlin Slack 上直接向 K2 开发人员提供您的反馈 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
* 在 [我们的 issue tracker](https://kotl.in/issue) 上报告您使用新 K2 编译器时遇到的任何问题。
* [启用 Send usage statistics 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以允许 JetBrains 收集有关 K2 使用情况的匿名数据。

## Kotlin/JVM

从 1.9.20 版本开始，编译器可以生成包含 Java 21 字节码的类。

## Kotlin/Native

Kotlin 1.9.20 包括一个稳定的内存管理器，默认启用了新的内存分配器，垃圾回收器的性能改进以及其他更新：

* [默认启用自定义内存分配器](#custom-memory-allocator-enabled-by-default)
* [垃圾回收器的性能改进](#performance-improvements-for-the-garbage-collector)
* [`klib` 工件的增量编译](#incremental-compilation-of-klib-artifacts)
* [管理库链接问题](#managing-library-linkage-issues)
* [在类构造函数调用中初始化伴生对象](#companion-object-initialization-on-class-constructor-calls)
* [所有 cinterop 声明的 opt-in 要求](#opt-in-requirement-for-all-cinterop-declarations)
* [链接器错误的自定义消息](#custom-message-for-linker-errors)
* [删除旧的内存管理器](#removal-of-the-legacy-memory-manager)
* [更改我们的目标层级策略](#change-to-our-target-tiers-policy)

### 默认启用自定义内存分配器

Kotlin 1.9.20 默认启用了新的内存分配器。它旨在替换以前的默认分配器 `mimaloc`，以使垃圾回收更加高效，并提高 [Kotlin/Native 内存管理器](native-memory-manager) 的运行时性能。

新的自定义分配器将系统内存划分为页面，从而允许以连续顺序进行独立的扫描。
每个分配都成为页面内的内存块，并且该页面会跟踪块大小。
不同的页面类型针对各种分配大小进行了优化。
内存块的连续排列可确保高效地迭代所有已分配的块。

当线程分配内存时，它会根据分配大小搜索合适的页面。
线程维护一组用于不同大小类别的页面。
通常，给定大小的当前页面可以容纳分配。
如果不是，则线程从共享分配空间请求不同的页面。
该页面可能已经可用，需要扫描或必须首先创建。

新的分配器允许同时进行多个独立的分配空间，这将使 Kotlin 团队能够试验不同的页面布局，以进一步提高性能。

#### 如何启用自定义内存分配器

从 Kotlin 1.9.20 开始，新的内存分配器是默认设置。无需其他设置。

如果您遇到高内存消耗，则可以使用 Gradle 构建脚本中的 `-Xallocator=mimalloc` 或 `-Xallocator=std` 切换回 `mimaloc` 或系统分配器。请在 [YouTrack](https://kotl.in/issue) 中报告此类问题，以帮助我们改进新的内存分配器。

有关新分配器设计的技术细节，请参见此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README)。

### 垃圾回收器的性能改进

Kotlin 团队不断提高新的 Kotlin/Native 内存管理器的性能和稳定性。
此版本对垃圾回收器（GC）进行了一些重大更改，包括以下 1.9.20 的亮点：

* [](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### 完全并行标记以减少 GC 的暂停时间

以前，默认垃圾回收器仅执行部分并行标记。当 mutator 线程暂停时，它将从其自身的根目录（例如线程本地变量和调用堆栈）开始标记 GC。同时，单独的 GC 线程负责从全局根目录以及所有正在运行本机代码因此未暂停的 mutator 的根目录开始标记。

这种方法在全局对象的数量有限并且 mutator 线程花费大量时间处于可运行状态执行 Kotlin 代码的情况下效果很好。但是，对于典型的 iOS 应用程序而言，情况并非如此。

现在，GC 使用完全并行标记，该标记结合了已暂停的 mutator，GC 线程和可选的标记线程来处理标记队列。默认情况下，标记过程由以下各项执行：

* 已暂停的 mutator。它们不会处理自己的根目录，然后在不主动执行代码时处于空闲状态，而是为整个标记过程做出贡献。
* GC 线程。这确保至少有一个线程将执行标记。

这种新方法使标记过程更加有效，从而减少了 GC 的暂停时间。

#### 以大块跟踪内存以提高分配性能

以前，GC 调度程序会单独跟踪每个对象的分配。但是，新的默认自定义分配器和 `mimalloc` 内存分配器都不会为每个对象分配单独的存储；它们会一次为多个对象分配较大的区域。

在 Kotlin 1.9.20 中，GC 跟踪区域而不是单个对象。这通过减少在每次分配时执行的任务数量来加速小对象的分配，因此有助于最小化垃圾回收器的内存使用量。

### klib 工件的增量编译

此功能是 [实验性的](components-stability#stability-levels-explained)。
它可能随时被删除或更改。需要选择启用（请参阅下面的详细信息）。
仅将其用于评估目的。我们将在 [YouTrack](https://kotl.in/issue) 中感谢您的反馈。

Kotlin 1.9.20 为 Kotlin/Native 引入了一种新的编译时间优化。
现在可以部分增量地将 `klib` 工件编译为本机代码。

在调试模式下将 Kotlin 源代码编译为本机二进制文件时，编译将经过两个阶段：

1. 源代码被编译为 `klib` 工件。
2. `klib` 工件及其依赖项被编译为二进制文件。

为了优化第二阶段的编译时间，该团队已经为依赖项实现了编译器缓存。
它们仅被编译为本机代码一次，并且每次编译二进制文件时都会重用该结果。
但是，从项目源构建的 `klib` 工件始终在每次项目更改时都完全重新编译为本机代码。

使用新的增量编译，如果项目模块更改仅导致将源代码部分重新编译为 `klib` 工件，则仅将 `klib` 的一部分进一步重新编译为二进制文件。

要启用增量编译，请将以下选项添加到您的 `gradle.properties` 文件中：

```none
kotlin.incremental.native=true
```

如果您遇到任何问题，请将此类案例报告给 [YouTrack](https://kotl.in/issue)。

### 管理库链接问题

此版本改进了 Kotlin/Native 编译器处理 Kotlin 库中的链接问题的方式。错误消息现在
包括更具可读性的声明，因为它们使用签名名称而不是哈希值，从而帮助您更轻松地查找和修复问题。这是一个示例：

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Native 编译器检测第三方 Kotlin 库之间的链接问题，并在运行时报告错误。
如果一个第三方 Kotlin 库的作者对另一个第三方 Kotlin 库使用的实验性
API 进行了不兼容的更改，则可能会遇到此类问题。

从 Kotlin 1.9.20 开始，编译器默认以静默模式检测链接问题。您可以在您的项目中调整此设置：

* 如果您想在编译日志中记录这些问题，请使用 `-Xpartial-linkage-loglevel=WARNING` 编译器选项启用警告。
* 也可以使用 `-Xpartial-linkage-loglevel=ERROR` 将报告的警告的严重性提高到编译错误。
在这种情况下，编译将失败，并且您将在编译日志中获得所有错误。使用此选项可以更仔细地检查链接问题。

```kotlin
// 在 Gradle 构建文件中传递编译器选项的示例：
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 要将链接问题报告为警告：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // 要将链接警告提高到错误：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

如果您遇到此功能的意外问题，则始终可以使用
`-Xpartial-linkage=disable` 编译器选项选择退出。请随时将此类案例报告给 [我们的 issue
tracker](https://kotl.in/issue)。

### 在类构造函数调用中初始化伴生对象

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

该行为现在与 Kotlin/JVM 统一，在 Kotlin/JVM 中，当加载（解析）与 Java 静态初始化器的语义匹配的相应类时，会初始化伴生对象。

现在，此功能的实现方式在平台之间更加一致，因此在 Kotlin
Multiplatform 项目中共享代码更加容易。

### 所有 cinterop 声明的 opt-in 要求

从 Kotlin 1.9.20 开始，所有由 `cinterop` 工具从 C 和 Objective-C 库（例如
libcurl 和 libxml）生成的 Kotlin 声明都标有 `@ExperimentalForeignApi`。如果缺少 opt-in 注释，您的代码将无法编译。

此要求反映了导入 C
和 Objective-C 库的 [实验性](components-stability#stability-levels-explained) 状态。我们建议您将其使用限制在项目中的特定区域。这将使
我们在开始稳定导入后，更轻松地进行迁移。

对于 Kotlin/Native 附带的本机平台库（例如 Foundation，UIKit 和 POSIX），只有它们的某些
API 需要使用 `@ExperimentalForeignApi` 进行 opt-in。在这种情况下，您将收到带有 opt-in 要求的警告。

:::

### 链接器错误的自定义消息

如果您是库作者，您现在可以使用自定义消息来帮助您的用户解决链接器错误。

如果您的 Kotlin 库依赖于 C 或 Objective-C 库，例如，使用 [CocoaPods 集成](native-cocoapods)，
则其用户需要在本地计算机上拥有这些依赖库，或者在项目构建脚本中显式配置它们。
如果不是这种情况，用户过去会收到令人困惑的“找不到框架”消息。

您现在可以在编译失败消息中提供特定的说明或链接。为此，请将 `-Xuser-setup-hint`
编译器选项传递给 `cinterop` 或将 `userSetupHint=message` 属性添加到您的 `.def` 文件中。

### 删除旧的内存管理器

[新的内存管理器](native-memory-manager) 在 Kotlin 1.6.20 中引入，并在 1.7.20 中成为默认设置。
从那时起，它一直在接收进一步的更新和性能改进，并已变得稳定。

是时候完成弃用周期并删除旧的内存管理器了。如果您仍在使用它，请从您的 `gradle.properties` 中删除
`kotlin.native.binary.memoryModel=strict` 选项，并按照我们的 [迁移指南](native-migration-guide) 进行必要的更改。

### 更改我们的目标层级策略

我们已决定升级 [第 1 层支持](native-target-support#tier-1) 的要求。Kotlin 团队现在
致力于为符合第 1 层资格的目标提供编译器版本之间的源代码和二进制文件兼容性。它们
还必须定期使用 CI 工具进行测试，以便能够编译和运行。目前，第 1 层包括以下 macOS 主机目标：

* `macosX64`
* `macosArm64`
* `iosSimulatorArm64`
* `iosX64`

在 Kotlin 1.9.20 中，我们还删除了许多以前已弃用的目标，即：

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxMips32`
* `linuxMipsel32`

请参阅当前 [支持的目标](native-target-support) 的完整列表。

## Kotlin Multiplatform

Kotlin 1.9.20 专注于 Kotlin Multiplatform 的稳定，并通过新的项目向导和其他值得注意的功能，在改善开发者体验方面迈出了新的步伐：

* [Kotlin Multiplatform 已稳定](#kotlin-multiplatform-is-stable)
* [用于配置多平台项目的模板](#template-for-configuring-multiplatform-projects)
* [新的项目向导](#new-project-wizard)
* [对 Gradle 配置缓存的完全支持](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [更轻松地在 Gradle 中配置新的标准库版本](#easier-configuration-of-new-standard-library-versions-in-gradle)
* [对第三方 cinterop 库的默认支持](#default-support-for-third-party-cinterop-libraries)
* [Compose Multiplatform 项目中对 Kotlin/Native 编译缓存的支持](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
* [兼容性指南](#compatibility-guidelines)

### Kotlin Multiplatform 已稳定

1.9.20 版本标志着 Kotlin 发展中的一个重要里程碑：[Kotlin Multiplatform](multiplatform-intro) 终于
变得稳定。这意味着该技术可以安全地在您的项目中使用，并且 100％ 可以用于生产。这也
意味着 Kotlin Multiplatform 的进一步开发将继续按照我们严格的 [向后兼容性规则](https://kotlinfoundation.org/language-committee-guidelines/) 进行。

请注意，Kotlin Multiplatform 的某些高级功能仍在发展中。使用它们时，您将收到一条警告，描述
您正在使用的功能的当前稳定性状态。在 IntelliJ IDEA 中使用任何实验性功能之前，
您需要在 **Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform** 中显式启用它。

* 访问 [Kotlin 博客](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，以了解有关 Kotlin Multiplatform 稳定和未来计划的更多信息。
* 查看 [Multiplatform 兼容性指南](multiplatform-compatibility-guide)，以查看在稳定过程中所做的重大更改。
* 阅读有关 [预期和实际声明的机制](multiplatform-expect-actual)，这是 Kotlin Multiplatform 的重要组成部分，也在此版本中得到了部分稳定。

### 用于配置多平台项目的模板

从 Kotlin 1.9.20 开始，Kotlin Gradle 插件会自动为流行的多平台方案创建共享源代码集。
如果您的项目设置是其中之一，则无需手动配置源代码集层次结构。
只需显式指定项目所需的目标即可。

现在，由于默认层次结构模板（Kotlin Gradle 插件的一项新功能），设置变得更加容易。
它是内置于插件中的源代码集层次结构的预定义模板。
它包括 Kotlin 自动为您声明的目标创建的中间源代码集。
[查看完整的模板](#see-the-full-hierarchy-template)。

#### 更轻松地创建您的项目

考虑一个面向 Android 和 iPhone 设备并在 Apple Silicon MacBook 上开发的多平台项目。
比较 Kotlin 的不同版本之间如何设置此项目：
<table>
<tr>
<td>
Kotlin 1.9.0 及更早版本（标准设置）
</td>
<td>
Kotlin 1.9.20
</td>
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

    // iosMain 源代码集会自动创建
}
```
</td>
</tr>
</table>

请注意，使用默认层次结构模板如何大大减少设置项目所需的样板代码量。

当您在代码中声明 `androidTarget`，`iosArm64` 和 `iosSimulatorArm64` 目标时，Kotlin Gradle 插件会从模板中查找
合适的共享源代码集，并为您创建它们。生成的层次结构如下所示：

<img src="/img/default-hierarchy-example.svg" alt="使用中的默认目标层次结构的示例" width="350" style={{verticalAlign: 'middle'}}/>

绿色的源代码集实际上是在项目中创建和包含的，而默认模板中的灰色源代码集则被忽略。

#### 使用源代码集的完成

为了更容易地使用创建的项目结构，IntelliJ IDEA 现在为使用默认层次结构模板创建的源代码集提供完成：

<img src="/img/multiplatform-hierarchy-completion.animated.gif" alt="IDE 完成源代码集名称" width="350" preview-src="multiplatform-hierarchy-completion.png"/>

如果您尝试访问不存在的源代码集，因为您尚未声明相应的目标，Kotlin 也会警告您。
在下面的示例中，没有 JVM 目标（只有 `androidTarget`，这与 JVM 目标不同）。但是，让我们尝试使用 `jvmMain` 源代码集
，看看会发生什么：

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

在这种情况下，Kotlin 在构建日志中报告警告：

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* `<-` register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### 设置目标层次结构

从 Kotlin 1.9.20 开始，默认层次结构模板会自动启用。在大多数情况下，不需要其他设置。

但是，如果您要迁移在 1.9.20 之前创建的现有项目，如果您之前手动引入了带有 `dependsOn()` 调用的中间源，则可能会遇到警告。
要解决此问题，请执行以下操作：

* 如果您的中间源代码集当前已包含在默认层次结构模板中，请删除所有手动 `dependsOn()`
调用和使用 `by creating` 构造创建的源代码集。

  要检查所有默认源代码集的列表，请参见 [完整的层次结构模板](#see-the-full-hierarchy-template)。

* 如果您想拥有默认层次结构模板不提供的其他源代码集，例如，一个
在 macOS 和 JVM 目标之间共享代码的源代码集，请通过显式使用 `applyDefaultHierarchyTemplate()` 重新应用该模板来调整层次结构
并像往常一样使用 `dependsOn()` 手动配置其他源代码集：

  ```kotlin
  kotlin {
      jvm()
      macosArm64()
      iosArm64()
      iosSimulatorArm64()

      // 显式应用默认层次结构。例如，它将创建 iosMain 源代码集：
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

* 如果您的项目中已经存在与模板生成的源代码集具有完全相同的名称的源代码集，
但这些源代码集在不同的目标集之间共享，则目前无法修改
模板源代码集之间的默认 `dependsOn` 关系。

  您可以在默认层次结构模板中或手动创建的模板中找到适合您目的的其他源代码集。另一种方法是完全退出模板。

  要退出，请将 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 添加到您的 `gradle.properties` 并手动配置所有其他
源代码集。

  我们目前正在开发一个用于创建您自己的层次结构模板的 API，以简化这种情况下的设置过程。

#### 查看完整的层次结构模板

当您声明您的项目要编译到的目标时，
插件会从模板中选择相应的共享源代码集，并在您的项目中创建它们。

<img src="/img/full-template-hierarchy.svg" alt="默认层次结构模板" style={{verticalAlign: 'middle'}}/>
:::note
此示例仅显示项目的生产部分，省略了 `Main` 后缀
（例如，使用 `common` 而不是 `commonMain`）。但是，对于 `*Test` 源代码也是如此。

### 新的项目向导

JetBrains 团队正在引入一种创建跨平台项目的新方法 - [Kotlin Multiplatform Web 向导](https://kmp.jetbrains.com)。

新 Kotlin Multiplatform 向导的第一个实现涵盖了最流行的 Kotlin Multiplatform
用例。它整合了有关先前项目模板的所有反馈，并使架构尽可能健壮和
可靠。

新向导具有分布式架构，使我们能够拥有统一的后端和
不同的前端，其中 Web 版本是第一步。我们正在考虑实施 IDE 版本和
将来创建命令行工具。在 Web 上，您始终可以获得最新版本的向导，而在
IDE 中，您需要等待下一个版本。

借助新向导，项目设置比以往任何时候都容易。您可以通过
选择移动，服务器和桌面开发的目标平台来根据您的需求定制您的项目。我们还计划在以后的版本中添加 Web 开发。

<img src="/img/multiplatform-web-wizard.png" alt="Multiplatform Web 向导" width="400"/>

现在，新的项目向导是使用 Kotlin 创建跨平台项目的首选方法。自 1.9.20 起，Kotlin
插件不再在 IntelliJ IDEA 中提供 **Kotlin Multiplatform** 项目向导。

新的向导将轻松引导您完成初始设置，从而使入门过程更加顺畅。
如果您遇到任何问题，请将它们报告给 [YouTrack](https://kotl.in/issue)，以帮助我们改善您使用
该向导的体验。

<a href="https://kmp.jetbrains.com">
   <img src="/img/multiplatform-create-project-button.png" alt="创建项目" />
</a>

### 在 Kotlin Multiplatform 中完全支持 Gradle 配置缓存

以前，我们引入了 Gradle 配置缓存的 [预览版](whatsnew19#preview-of-the-gradle-configuration-cache)，
该预览版可用于 Kotlin Multiplatform 库。借助 1.9.20，Kotlin Multiplatform 插件迈出了又一步。

它现在支持 [Kotlin CocoaPods Gradle 插件](native-cocoapods-dsl-reference) 中的 Gradle 配置缓存，
以及 Xcode 构建所需的集成任务中，例如 `embedAndSignAppleFrameworkForXcode`。

现在，所有多平台项目都可以利用改进的构建时间。
Gradle 配置缓存通过重用后续构建的配置阶段的结果来加快构建过程。
有关更多详细信息和设置说明，请参见 [Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)。

### 更轻松地在 Gradle 中配置新的标准库版本

创建多平台项目时，标准库（`stdlib`）的依赖项会自动添加到每个
源代码集中。这是开始使用您的多平台项目的最简单方法。

以前，如果您想手动配置标准库的依赖项，则需要在每个
源代码集中分别配置它。从 `kotlin-stdlib:1.9.20` 开始，您只需要在
`commonMain` 根源代码集中配置一次依赖项：
<table>
<tr>
<td>
标准库版本 1.9.10 及更早版本
</td>
<td>
标准库版本 1.9.20
</td>
</tr>
<tr>
<td>

```kotlin
kotlin {
    sourceSets {
        // 对于通用源代码集
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

通过在标准库的 Gradle 元数据中包含新信息，可以进行此更改。这使
Gradle 可以自动为其他源代码集解析正确的标准库工件。

### 默认支持第三方 cinterop 库

Kotlin 1.9.20 为应用了 [Kotlin CocoaPods Gradle](native-cocoapods) 插件的项目中的所有 cinterop 依赖项添加了默认支持（而不是 opt-in 支持）。

这意味着您现在可以共享更多本机代码，而不受平台特定依赖项的限制。例如，您可以将 [Pod 库的依赖项](native-cocoapods-libraries) 添加到 `iosMain` 共享源代码集中。

以前，这仅适用于 Kotlin/Native
发行版附带的 [平台特定库](native-platform-libs)（例如 Foundation，UIKit 和 POSIX）。现在，默认情况下，所有第三方 Pod 库都可在共享源代码集中使用。您不再需要指定单独的 Gradle 属性来支持它们。

### Compose Multiplatform 项目中对 Kotlin/Native 编译缓存的支持

此版本解决了 Compose Multiplatform 编译器插件的兼容性问题，该问题主要影响
适用于 iOS 的 Compose Multiplatform 项目。

要解决此问题，您必须使用 `kotlin.native.cacheKind=none` Gradle 属性来禁用缓存。但是，此
解决方法会带来性能损失：由于缓存在 Kotlin/Native 编译器中不起作用，因此降低了编译时间。

现在问题已修复，您可以从 `gradle.properties` 文件中删除 `kotlin.native.cacheKind=none`，并享受
Compose Multiplatform 项目中改进的编译时间。

有关提高编译时间的更多提示，请参见 [Kotlin/Native 文档](native-improving-compilation-time)。

### 兼容性指南

配置项目时，请检查 Kotlin Multiplatform Gradle 插件与可用的 Gradle，Xcode 和
Android Gradle 插件 (AGP) 版本的兼容性：

| Kotlin Multiplatform Gradle 插件 | Gradle | Android Gradle 插件 | Xcode |
|---------------------------|------|----|----|
| 1.9.20        | 7.5 及更高版本 | 7.4.2–8.2 | 15.0。请参见下面的详细信息 |

截至本版本，建议的 Xcode 版本是 15.0。完全支持 Xcode 15.0 附带的库，并且
您可以从 Kotlin 代码中的任何位置访问它们。

但是，XCode 14.3 在大多数情况下仍应有效。请记住，如果您在本地计算机上使用版本 14.3，则 Xcode 15 附带的库将可见但不可访问。

## Kotlin/Wasm

在 1.9.20 中，Kotlin Wasm 达到了稳定性的 [Alpha 级别](components-stability)。

* [与 Wasm GC 第 4 阶段和最终操作码的兼容性](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
* [新的 `wasm-wasi` 目标，以及将 `wasm` 目标重命名为 `wasm-js`](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [标准库中对 WASI API 的支持](#support-for-the-wasi-api-in-the-standard-library)
* [Kotlin/Wasm API 改进](#kotlin-wasm-api-improvements)

Kotlin Wasm 是 [Alpha](components-stability)。
它可能随时更改。仅将其用于评估目的。

我们将在 [YouTrack](https://kotl.in/issue) 中感谢您的反馈。

:::

### 与 Wasm GC 第 4 阶段和最终操作码的兼容性

Wasm GC 移至最终阶段，它需要更新操作码 - 二进制表示中使用的常量数字。
Kotlin 1.9.20 支持最新的操作码，因此我们强烈建议您将 Wasm 项目更新到最新版本的 Kotlin。
我们还建议使用具有 Wasm 环境的最新版本的浏览器：
* Chrome 和基于 Chromium 的浏览器的 119 或更高版本。
* Firefox 的 119 或更高版本。请注意，在 Firefox 119 中，您需要 [手动打开 Wasm GC](wasm-troubleshooting)。

### 新的 wasm-wasi 目标，以及将 wasm 目标重命名为 wasm-js

在此版本中，我们为 Kotlin/Wasm 引入了一个新目标 – `wasm-wasi`。我们还将 `wasm` 目标重命名为 `wasm-js`。
在 Gradle DSL 中，这些目标分别可以作为 `wasmWasi {}` 和 `wasmJs {}` 使用。

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

先前引入的 `wasm {}` 块已被弃用，而使用 `wasmJs {}`。

要迁移您现有的 Kotlin/Wasm 项目，请执行以下操作：
* 在 `build.gradle.kts` 文件中，将 `wasm {}` 块重命名为 `wasmJs {}`。
* 在您的项目结构中，将 `wasmMain` 目录重命名为 `