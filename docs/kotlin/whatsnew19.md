---
title: "Kotlin 1.9.0 版本的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[发布日期：2023 年 7 月 6 日](releases#release-details)_

Kotlin 1.9.0 版本已发布，JVM 的 K2 编译器现在处于 **Beta** 阶段。此外，以下是一些主要亮点：

* [新的 Kotlin K2 编译器更新](#new-kotlin-k2-compiler-updates)
* [稳定替换 `enum class values` 函数](#stable-replacement-of-the-enum-class-values-function)
* [用于开区间的稳定 `..<` 运算符](#stable-operator-for-open-ended-ranges)
* [通过名称获取 `regex` 捕获组的新通用函数](#new-common-function-to-get-regex-capture-group-by-name)
* [用于创建父目录的新路径实用程序](#new-path-utility-to-create-parent-directories)
* [Kotlin Multiplatform 中 Gradle 配置缓存的预览](#preview-of-the-gradle-configuration-cache)
* [Kotlin Multiplatform 中 Android 目标支持的变更](#changes-to-android-target-support)
* [Kotlin/Native 中自定义内存分配器的预览](#preview-of-custom-memory-allocator)
* [Kotlin/Native 中的库链接](#library-linkage-in-kotlin-native)
* [Kotlin/Wasm 中与大小相关的优化](#size-related-optimizations)

你还可以在此视频中找到更新的简短概述：

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="What's new in Kotlin 1.9.0"/>

## IDE 支持

支持 1.9.0 的 Kotlin 插件可用于：

| IDE | 支持的版本 |
|--|--|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 插件将包含在 Android Studio Giraffe (223) 和 Hedgehog (231) 的即将发布的版本中。

Kotlin 1.9.0 插件将包含在 IntelliJ IDEA 2023.2 的即将发布的版本中。

:::note
要下载 Kotlin 工件（artifacts）和依赖项（dependencies），请[配置你的 Gradle 设置](#configure-gradle-settings)以使用 Maven Central 仓库。

## 新的 Kotlin K2 编译器更新

JetBrains 的 Kotlin 团队将继续稳定 K2 编译器，1.9.0 版本引入了更多改进。
JVM 的 K2 编译器现在处于 **Beta** 阶段。

现在还基本支持 Kotlin/Native 和多平台项目。

### `kapt` 编译器插件与 K2 编译器的兼容性

你可以在你的项目中使用 [kapt 插件](kapt) 以及 K2 编译器，但有一些限制。
尽管将 `languageVersion` 设置为 `2.0`，但 `kapt` 编译器插件仍然使用旧的编译器。

如果在 `languageVersion` 设置为 `2.0` 的项目中执行 `kapt` 编译器插件，`kapt` 将自动切换到 `1.9` 并禁用特定的版本兼容性检查。
此行为等效于包含以下命令参数：
* `-Xskip-metadata-version-check`
* `-Xskip-prerelease-check`
* `-Xallow-unstable-dependencies`

这些检查仅对 `kapt` 任务禁用。所有其他编译任务将继续使用新的 K2 编译器。

如果在 K2 编译器中使用 `kapt` 时遇到任何问题，请将其报告给我们的 [问题跟踪器](http://kotl.in/issue)。

### 在你的项目中尝试 K2 编译器

从 1.9.0 开始，直到 Kotlin 2.0 发布，你可以通过将 `kotlin.experimental.tryK2=true`
Gradle 属性添加到你的 `gradle.properties` 文件中来轻松测试 K2 编译器。你还可以运行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

此 Gradle 属性会自动将语言版本设置为 2.0，并使用使用 K2 编译器编译的 Kotlin
任务数与当前编译器相比来更新构建报告：

```none
##### 'kotlin.experimental.tryK2' 结果（未检查 Kotlin/Native）#####
:lib:compileKotlin: 2.0 语言版本
:app:compileKotlin: 2.0 语言版本
##### 100% (2/2) 的任务已使用 Kotlin 2.0 编译 #####
```

### Gradle 构建报告

[Gradle 构建报告](gradle-compilation-and-caches#build-reports) 现在显示是使用当前编译器还是 K2 编译器来编译代码。
在 Kotlin 1.9.0 中，你可以在你的 [Gradle 构建扫描](https://scans.gradle.com/)中看到此信息：

<img src="/img/gradle-build-scan-k1.png" alt="Gradle build scan - K1" width="700" style={{verticalAlign: 'middle'}}/>

<img src="/img/gradle-build-scan-k2.png" alt="Gradle build scan - K2" width="700" style={{verticalAlign: 'middle'}}/>

你还可以在构建报告中找到项目中使用的 Kotlin 版本：

```none
Task info:
  Kotlin language version: 1.9
```

如果使用 Gradle 8.0，你可能会遇到一些构建报告问题，尤其是在启用 Gradle 配置缓存时。
这是一个已知问题，已在 Gradle 8.1 及更高版本中修复。

:::

### 当前 K2 编译器的局限性

在你的 Gradle 项目中启用 K2 会带来某些限制，这些限制可能会在以下情况下影响使用低于 8.3 的 Gradle 版本的项目：

* 从 `buildSrc` 编译源代码。
* 在包含的构建中编译 Gradle 插件。
* 如果其他 Gradle 插件在低于 8.3 的 Gradle 版本的项目中使用，则编译这些插件。
* 构建 Gradle 插件依赖项。

如果遇到上述任何问题，可以采取以下步骤来解决这些问题：

* 设置 `buildSrc`、任何 Gradle 插件及其依赖项的语言版本：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

* 在 Gradle 8.3 可用时，将项目中的 Gradle 版本更新到 8.3。

### 留下你对新 K2 编译器的反馈

我们感谢你的任何反馈！

* 将你的反馈直接提供给 K2 开发人员 Kotlin 的 Slack – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
  并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
* 在 [我们的问题跟踪器](https://kotl.in/issue) 上报告你使用新 K2 编译器遇到的任何问题。
* [启用 **发送使用情况统计信息** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以
  允许 JetBrains 收集有关 K2 使用情况的匿名数据。

## 语言

在 Kotlin 1.9.0 中，我们将稳定一些之前引入的新语言特性：
* [替换 `enum class values` 函数](#stable-replacement-of-the-enum-class-values-function)
* [数据对象与数据类的对称性](#stable-data-objects-for-symmetry-with-data-classes)
* [对内联值类中带有主体的二级构造函数的支持](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### 稳定替换 `enum class values` 函数

在 1.8.20 中，引入了枚举类的 `entries` 属性作为实验性功能。`entries` 属性是合成 `values()` 函数的现代且高性能的替代方案。在 1.9.0 中，`entries` 属性是稳定的。

:::note
仍然支持 `values()` 函数，但我们建议你改用 `entries` 属性。

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```

有关枚举类的 `entries` 属性的更多信息，请参阅 [Kotlin 1.8.20 中的新增功能](whatsnew1820#a-modern-and-performant-replacement-of-the-enum-class-values-function)。

### 数据对象与数据类的对称性

数据对象声明已在 [Kotlin 1.8.20](whatsnew1820#preview-of-data-objects-for-symmetry-with-data-classes) 中引入，现在是稳定的。
这包括为与数据类对称而添加的函数：`toString()`、`equals()` 和 `hashCode()`。

此功能对于 `sealed` 层级结构（如 `sealed class` 或 `sealed interface` 层级结构）特别有用，
因为 `data object` 声明可以与 `data class` 声明一起方便地使用。在此示例中，将
`EndOfFile` 声明为 `data object` 而不是普通的 `object` 意味着它会自动具有 `toString()` 函数，而无需
手动重写它。这保持了与随附数据类定义的对称性。

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```

有关更多信息，请参阅 [Kotlin 1.8.20 中的新增功能](whatsnew1820#preview-of-data-objects-for-symmetry-with-data-classes)。

### 对内联值类中带有主体的二级构造函数的支持

从 Kotlin 1.9.0 开始，默认情况下可以使用 [内联值类](inline-classes) 中带有主体的二级构造函数：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // 自 Kotlin 1.4.30 起允许：
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // 自 Kotlin 1.9.0 起默认允许：
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

以前，Kotlin 仅允许在内联类中使用公共主构造函数。因此，不可能
封装底层值或创建表示某些约束值的内联类。

随着 Kotlin 的发展，这些问题得到了修复。Kotlin 1.4.30 取消了对 `init` 块的限制，然后 Kotlin 1.8.20
提供了带有主体的二级构造函数的预览。它们现在默认可用。在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes) 中了解有关 Kotlin 内联类开发的更多信息。

## Kotlin/JVM

从 1.9.0 版本开始，编译器可以生成具有对应于 JVM 20 的字节码版本的类。此外，
`JvmDefault` 注释和旧版 `-Xjvm-default` 模式的弃用仍在继续。

### 弃用 JvmDefault 注释和旧版 -Xjvm-default 模式

从 Kotlin 1.5 开始，已弃用使用 `JvmDefault` 注释，而推荐使用较新的 `-Xjvm-default`
模式：`all` 和 `all-compatibility`。随着 Kotlin 1.4 中 `JvmDefaultWithoutCompatibility` 和
Kotlin 1.6 中 `JvmDefaultWithCompatibility` 的引入，这些模式提供了对 `DefaultImpls` 生成的全面控制
类，确保与旧版 Kotlin 代码的无缝兼容性。

因此，在 Kotlin 1.9.0 中，`JvmDefault` 注释不再具有任何意义，并且已标记为
已弃用，从而导致错误。它最终将从 Kotlin 中删除。

## Kotlin/Native

除了其他改进之外，此版本还为 [Kotlin/Native 内存管理器](native-memory-manager) 带来了更多改进
这应增强其稳健性和性能：

* [自定义内存分配器的预览](#preview-of-custom-memory-allocator)
* [主线程上的 Objective-C 或 Swift 对象释放挂钩](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
* [访问 Kotlin/Native 中的常量值时没有对象初始化](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [能够为 iOS 模拟器测试配置独立模式](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
* [Kotlin/Native 中的库链接](#library-linkage-in-kotlin-native)

### 自定义内存分配器的预览

Kotlin 1.9.0 引入了自定义内存分配器的预览。其分配系统提高了 [Kotlin/Native 内存管理器](native-memory-manager) 的运行时性能。

Kotlin/Native 中当前的对象分配系统使用通用的分配器，该分配器不具有
用于高效垃圾回收的功能。为了弥补这一点，它在垃圾收集器 (GC) 将它们合并到单个列表之前，维护所有已分配对象的线程本地链接列表，可以在扫描期间对其进行迭代。这种方法带来
几个性能缺点：

* 扫描顺序缺乏内存局部性，并且通常会导致分散的内存访问模式，从而导致潜在的性能问题。
* 链接列表需要每个对象的额外内存，从而增加内存使用量，尤其是在处理许多小对象时。
* 已分配对象的单个列表使得难以并行化扫描，这可能会导致当 mutator 线程分配对象的速度快于 GC 线程收集它们的速度时出现内存使用问题。

为了解决这些问题，Kotlin 1.9.0 引入了自定义分配器的预览。它将系统内存划分为页面，
允许以连续顺序进行独立扫描。每个分配都成为页面中的一个内存块，并且页面
跟踪块大小。不同的页面类型针对各种分配大小进行了优化。连续排列
内存块可确保高效地迭代所有已分配的块。

当线程分配内存时，它会根据分配大小搜索合适的页面。线程维护一组
不同大小类别的页面。通常，给定大小的当前页面可以容纳分配。如果没有，
线程会从共享分配空间请求不同的页面。此页面可能已可用，需要
扫描，或者应首先创建。

新的分配器允许同时拥有多个独立的分配空间，这将允许 Kotlin 团队
试验不同的页面布局，以进一步提高性能。

有关新分配器设计的更多信息，请参阅 [此 README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README)。

#### 如何启用

添加 `-Xallocator=custom` 编译器选项：

```kotlin
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                freeCompilerArgs.add("-Xallocator=custom")
            }
        }
    }
}
```

#### 留下反馈

我们希望你能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native) 中提供反馈
以改进自定义分配器。

### 主线程上的 Objective-C 或 Swift 对象释放挂钩

从 Kotlin 1.9.0 开始，如果对象传递到 Kotlin，则在主线程上调用 Objective-C 或 Swift 对象释放挂钩。
[Kotlin/Native 内存管理器](native-memory-manager) 先前处理 Objective-C 对象引用的方式可能导致内存泄漏。我们认为新行为应提高内存管理器的稳健性。

考虑一个在 Kotlin 代码中引用的 Objective-C 对象，例如，当作为参数传递、由函数返回或从集合中检索时。在这种情况下，Kotlin 创建其自己的对象，该对象保存对 Objective-C 对象的引用。当 Kotlin 对象被释放时，Kotlin/Native 运行时调用 `objc_release` 函数，该函数释放该 Objective-C 引用。

以前，Kotlin/Native 内存管理器在特殊的 GC 线程上运行 `objc_release`。如果它是最后一个对象引用，
则该对象将被释放。当 Objective-C 对象具有自定义释放挂钩（如 Objective-C 中的 `dealloc` 方法或 Swift 中的 `deinit` 块）时，可能会出现问题，并且这些挂钩希望在特定线程上调用。

由于主线程上对象的挂钩通常希望在那里调用，因此 Kotlin/Native 运行时现在
也在主线程上调用 `objc_release`。它应涵盖 Objective-C 对象在主线程上传递到
Kotlin 的情况，从而在那里创建 Kotlin 对等对象。这仅在处理主调度队列时才有效，这是常规 UI 应用程序的情况。当它不是主队列或对象在主线程以外的线程上传递到
Kotlin 时，`objc_release` 像以前一样在特殊的 GC 线程上调用。

#### 如何选择退出

如果你遇到问题，可以在你的 `gradle.properties` 文件中使用以下选项禁用此行为：

```none
kotlin.native.binary.objcDisposeOnMain=false
```

请随时将此类情况报告给 [我们的问题跟踪器](https://kotl.in/issue)。

### 访问 Kotlin/Native 中的常量值时没有对象初始化

从 Kotlin 1.9.0 开始，Kotlin/Native 后端在访问 `const val` 字段时不会初始化对象：

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // 首次没有初始化
    val x = MyObject    // 发生初始化
    println(x.y)
}
```

该行为现在与 Kotlin/JVM 统一，在 Kotlin/JVM 中，该实现与 Java 一致，并且在这种情况下永远不会初始化对象。由于
此更改，你还可以期望你的 Kotlin/Native 项目中的某些性能改进。

### 能够为 Kotlin/Native 中的 iOS 模拟器测试配置独立模式

默认情况下，在为 Kotlin/Native 运行 iOS 模拟器测试时，使用 `--standalone` 标志以避免手动模拟器
启动和关闭。在 1.9.0 中，你现在可以通过 `standalone` 属性在 Gradle 任务中配置是否使用此标志。
默认情况下，使用 `--standalone` 标志，因此启用独立模式。

以下是如何在你的 `build.gradle.kts` 文件中禁用独立模式的示例：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```

如果禁用独立模式，则必须手动启动模拟器。要从 CLI 启动你的模拟器，你可以使用以下命令：

```shell
/usr/bin/xcrun simctl boot <DeviceId>
```

:::

### Kotlin/Native 中的库链接

从 Kotlin 1.9.0 开始，Kotlin/Native 编译器以与 Kotlin/JVM 相同的方式处理 Kotlin 库中的链接问题。
如果某个第三方 Kotlin 库的作者在另一个第三方 Kotlin 库使用的实验性 API 中进行了不兼容的更改，你可能会遇到此类问题。

现在，如果第三方 Kotlin 库之间存在链接问题，则构建在编译期间不会失败。相反，你将
仅在运行时遇到这些错误，就像在 JVM 上一样。

每当 Kotlin/Native 编译器检测到库链接问题时，它都会报告警告。你可以在你的编译日志中找到此类警告，例如：

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

你可以进一步配置甚至禁用你项目中的此行为：

* 如果你不希望在你的编译日志中看到这些警告，请使用 `-Xpartial-linkage-loglevel=INFO` 编译器选项禁止显示它们。
* 也可以使用 `-Xpartial-linkage-loglevel=ERROR` 将报告的警告的严重性提高到编译错误。在这种情况下，编译失败，你将在编译日志中看到所有错误。使用此选项可以更仔细地检查链接问题。
* 如果你遇到此功能的意外问题，可以始终使用
  `-Xpartial-linkage=disable` 编译器选项选择退出。请随时将此类情况报告给 [我们的问题
  跟踪器](https://kotl.in/issue)。

```kotlin
// 通过 Gradle 构建文件传递编译器选项的示例。
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {

                // 要禁止显示链接警告：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // 要将链接警告提升为错误：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // 要完全禁用该功能：
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```

### 用于 C 互操作隐式整数转换的编译器选项

我们引入了一个用于 C 互操作的编译器选项，该选项允许你使用隐式整数转换。经过仔细
考虑，我们引入了此编译器选项以防止意外使用，因为此功能仍有改进空间，并且我们的目标是拥有最高质量的 API。

在此代码示例中，隐式整数转换允许 `options = 0`，即使 [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options)
具有无符号类型 `UInt`，并且 `0` 是有符号的。

```kotlin
val today = NSDate()
val tomorrow = NSCalendar.currentCalendar.dateByAddingUnit(
    unit = NSCalendarUnitDay,
    value = 1,
    toDate = today,
    options = 0
)
```

要将隐式转换与本机互操作库一起使用，请使用 `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion`
编译器选项。

你可以在你的 Gradle `build.gradle.kts` 文件中配置此选项：
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```

## Kotlin Multiplatform

Kotlin Multiplatform 在 1.9.0 中收到了一些值得注意的更新，旨在改善你的开发人员体验：

* [Android 目标支持的变更](#changes-to-android-target-support)
* [默认启用新的 Android 源码集布局](#new-android-source-set-layout-enabled-by-default)
* [多平台项目中 Gradle 配置缓存的预览](#preview-of-the-gradle-configuration-cache)

### Android 目标支持的变更

我们将继续努力稳定 Kotlin Multiplatform。一个重要的步骤是提供一流的
对 Android 目标的支持。我们很高兴地宣布，将来，Google 的 Android 团队将提供
其自己的 Gradle 插件来支持 Kotlin Multiplatform 中的 Android。

为了为 Google 提供的这种新解决方案打开道路，我们将在当前的 Kotlin DSL 中重命名 `android` 块（block）在 1.9.0 中。
请将你的构建脚本中所有出现的 `android` 块更改为 `androidTarget`。这是一个临时的
更改，对于为 Google 即将推出的 DSL 释放 `android` 名称是必需的。

Google 插件将是在多平台项目中处理 Android 的首选方式。准备就绪后，我们将
提供必要的迁移说明，以便你能够像以前一样使用短 `android` 名称。

### 默认启用新的 Android 源码集布局

从 Kotlin 1.9.0 开始，新的 Android 源码集布局是默认设置。它取代了先前目录的命名架构，该架构在多个方面令人困惑。新布局具有许多优点：

* 简化的类型语义 – 新的 Android 源码布局提供了清晰一致的命名约定，可帮助区分不同类型的源码集。
* 改进的源码目录布局 – 使用新布局，`SourceDirectories` 排列变得更加连贯，从而更易于组织代码和查找源文件。
* Gradle 配置的清晰命名架构 – 该架构现在在 `KotlinSourceSets` 和 `AndroidSourceSets` 中都更加一致和可预测。

新布局需要 Android Gradle 插件版本 7.0 或更高版本，并且在 Android Studio 2022.3 及更高版本中受支持。请参阅我们的
[迁移指南](multiplatform-android-layout) 以在你的 `build.gradle(.kts)` 文件中进行必要的更改。

### Gradle 配置缓存的预览

<anchor name="preview-of-gradle-configuration-cache"/>

Kotlin 1.9.0 附带了对多平台库中 [Gradle 配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html) 的支持。
如果你是库作者，你已经可以从改进的构建性能中受益。

Gradle 配置缓存通过重用后续
构建的配置阶段的结果来加速构建过程。自 Gradle 8.1 以来，该功能已变得稳定。要启用它，请按照 [Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage) 中的说明进行操作。

Kotlin Multiplatform 插件仍然不支持具有 Xcode 集成任务或
[Kotlin CocoaPods Gradle 插件](native-cocoapods-dsl-reference) 的 Gradle 配置缓存。我们希望在将来的 Kotlin 版本中添加此功能。

:::

## Kotlin/Wasm

Kotlin 团队将继续试验新的 Kotlin/Wasm 目标。此版本引入了多个性能和
[与大小相关的优化](#size-related-optimizations)，以及 [JavaScript 互操作的更新](#updates-in-javascript-interop)。

### 与大小相关的优化

Kotlin 1.9.0 为 WebAssembly (Wasm) 项目引入了显着的大小改进。比较两个“Hello World”项目，
Kotlin 1.9.0 中 Wasm 的代码占用空间现在比 Kotlin 1.8.20 小 10 倍以上。

<img src="/img/wasm-1-9-0-size-improvements.png" alt="Kotlin/Wasm 与大小相关的优化" width="700" style={{verticalAlign: 'middle'}}/>

这些大小优化可提高在使用 Kotlin 代码定位 Wasm
平台时的资源利用率和性能。

### JavaScript 互操作的更新

此 Kotlin 更新引入了 Kotlin/Wasm 的 Kotlin 和 JavaScript 之间的互操作性的更改。由于 Kotlin/Wasm
是 [实验性](components-stability#stability-levels-explained) 功能，因此某些限制适用于其互操作性。

#### 动态类型的限制

从 1.9.0 版本开始，Kotlin 不再支持在 Kotlin/Wasm 中使用 `Dynamic` 类型。现在已弃用
而推荐使用新的通用 `JsAny` 类型，该类型有助于 JavaScript 互操作性。

有关更多详细信息，请参阅 [Kotlin/Wasm 与 JavaScript 的互操作性](wasm-js-interop) 文档。

#### 非外部类型的限制

在将值传递到 JavaScript 和从 JavaScript 传递值时，Kotlin/Wasm 支持特定 Kotlin 静态类型的转换。这些受支持的
类型包括：

* 原始类型，例如有符号数、`Boolean` 和 `Char`。
* `String`。
* 函数类型。

其他类型作为不透明引用传递，无需转换，从而导致 JavaScript 和 Kotlin 之间存在子类型化不一致。

为了解决这个问题，Kotlin 将 JavaScript 互操作限制为一组受良好支持的类型。从 Kotlin 1.9.0 开始，仅外部、
原始、字符串和函数类型在 Kotlin/Wasm JavaScript 互操作中受支持。此外，还引入了一个单独的显式类型 `JsReference` 来表示可用于 JavaScript 互操作的 Kotlin/Wasm 对象的句柄。

有关更多详细信息，请参阅 [Kotlin/Wasm 与 JavaScript 的互操作性](wasm-js-interop) 文档。

### Kotlin Playground 中的 Kotlin/Wasm

Kotlin Playground 支持 Kotlin/Wasm 目标。
你可以编写、运行和共享你的 Kotlin 代码，该代码面向 Kotlin/Wasm。[立即查看！](https://pl.kotl.in/HDFAvimga)

:::note
使用 Kotlin/Wasm 需要在你的浏览器中启用实验性功能。

[了解有关如何启用这些功能的更多信息](wasm-troubleshooting)。

:::

```kotlin
import kotlin.time.*
import kotlin.time.measureTime

fun main() {
    println("Hello from Kotlin/Wasm!")
    computeAck(3, 10)
}

tailrec fun ack(m: Int, n: Int): Int = when {
    m == 0 `->` n + 1
    n == 0 `->` ack(m - 1, 1)
    else `->` ack(m - 1, ack(m, n - 1))
}

fun computeAck(m: Int, n: Int) {
    var res = 0
    val t = measureTime {
        res = ack(m, n)
    }
    println()
    println("ack($m, $n) = ${res}")
    println("duration: ${t.inWholeNanoseconds / 1e6} ms")
}
```

## Kotlin/JS

此版本引入了 Kotlin/JS 的更新，包括删除旧的 Kotlin/JS 编译器、Kotlin/JS Gradle 插件弃用和对 ES2015 的实验性支持：

* [删除旧的 Kotlin/JS 编译器](#removal-of-the-old-kotlin-js-compiler)
* [弃用 Kotlin/JS Gradle 插件](#deprecation-of-the-kotlin-js-gradle-plugin)
* [弃用外部枚举](#deprecation-of-external-enum)
* [对 ES2015 类和模块的实验性支持](#experimental-support-for-es2015-classes-and-modules)
* [更改 JS 生产分发的默认目标](#changed-default-destination-of-js-production-distribution)
* [从 stdlib-js 中提取 org.w3c 声明](#extract-org-w3c-declarations-from-stdlib-js)

:::note
从 1.9.0 版本开始，[部分库链接](#library-linkage-in-kotlin-native) 也已为 Kotlin/JS 启用。

:::

### 删除旧的 Kotlin/JS 编译器

在 Kotlin 1.8.0 中，我们 [宣布](whatsnew18#stable-js-ir-compiler-backend) 基于 IR 的后端变为 [稳定](components-stability)。
从那时起，不指定编译器已成为一个错误，并且使用旧编译器会导致警告。

在 Kotlin 1.9.0 中，使用旧后端会导致错误。请按照我们的 [迁移指南](js-ir-migration) 迁移到 IR 编译器。

### 弃用 Kotlin/JS Gradle 插件

从 Kotlin 1.9.0 开始，已弃用 `kotlin-js` Gradle 插件。
我们建议你改用带有 `js()` 目标的 `kotlin-multiplatform` Gradle 插件。

Kotlin/JS Gradle 插件的功能本质上复制了 `kotlin-multiplatform` 插件，并在底层共享了
相同的实现。这种重叠造成了混乱，并增加了 Kotlin 团队的维护负担。

有关迁移说明，请参阅我们的 [Kotlin Multiplatform 兼容性指南](multiplatform-compatibility-guide#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin)。
如果你发现本指南中未涵盖的任何问题，请将其报告给 [我们的问题跟踪器](http://kotl.in/issue)。

### 弃用外部枚举

在 Kotlin 1.9.0 中，由于静态枚举成员（如 `entries`）存在问题，将弃用外部枚举的使用，这些成员
无法在 Kotlin 外部存在。我们建议改用带有对象子类的外部密封类：

```kotlin
// 之前
external enum class ExternalEnum { A, B }

// 之后
external sealed class ExternalEnum {
    object A: ExternalEnum
    object B: ExternalEnum
}
```

通过切换到带有对象子类的外部密封类，你可以实现与外部枚举类似的功能，
同时避免与默认方法相关联的问题。

从 Kotlin 1.9.0 开始，外部枚举的使用将被标记为已弃用。我们建议你更新你的代码
以利用建议的外部密封类实现来实现兼容性和未来的维护。

### 对 ES2015 类和模块的实验性支持

此版本引入了对 ES2015 模块和生成 ES2015 类的 [实验性](components-stability#stability-levels-explained) 支持：
* 模块提供了一种简化你的代码库并提高可维护性的方法。
* 类允许你合并面向对象编程 (OOP) 原则，从而生成更清晰、更直观的代码。

要启用这些功能，请相应地更新你的 `build.gradle.kts` 文件：

```kotlin
// build.gradle.kts
kotlin { 
    js(IR) { 
        useEsModules() // 启用 ES2015 模块
        browser()
        }
    }

// 启用 ES2015 类生成
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        useEsClasses = true
    }
}
```

[在官方文档中了解有关 ES2015 (ECMAScript 2015, ES6) 的更多信息](https://262.ecma-international.org/6.0/)。

### 更改 JS 生产分发的默认目标

在 Kotlin 1.9.0 之前，分发目标目录为 `build/distributions`。但是，这是 Gradle 存档的通用目录。为了解决这个问题，我们已将 Kotlin 1.9.0 中的默认分发目标目录更改为：
`build/dist/<targetName>/<binaryName>`。

例如，`productionExecutable` 位于 `build/distributions` 中。在 Kotlin 1.9.0 中，它位于 `build/dist/js/productionExecutable` 中。

:::note
如果你有一个使用这些构建结果的管道，请确保更新目录。

### 从 stdlib-js 中提取 org.w3c 声明

自 Kotlin 1.9.0 起，`stdlib-js` 不再包含 `org.w3c` 声明。相反，这些声明已
移动到单独的 Gradle 依赖项。当你将 Kotlin Multiplatform Gradle 插件添加到你的 `build.gradle.kts` 文件时，
这些声明将自动包含在你的项目中，类似于标准库。

无需任何手动操作或迁移。必要的调整将自动处理。

## Gradle

Kotlin 1.9.0 附带了新的 Gradle 编译器选项以及更多内容：

*