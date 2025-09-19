[//]: # (title: Kotlin 1.9.0 新特性)

_[发布日期：2023 年 7 月 6 日](releases.md#release-details)_

Kotlin 1.9.0 版本现已发布，面向 JVM 的 K2 编译器现在已进入 **Beta** 阶段。此外，以下是一些主要亮点：

*   [新的 Kotlin K2 编译器更新](#new-kotlin-k2-compiler-updates)
*   [enum class values 函数的稳定替代](#stable-replacement-of-the-enum-class-values-function)
*   [用于开区间操作的稳定 `..<` 操作符](#stable-operator-for-open-ended-ranges)
*   [通过名称获取正则表达式捕获组的新公共函数](#new-common-function-to-get-regex-capture-group-by-name)
*   [创建父目录的新路径工具](#new-path-utility-to-create-parent-directories)
*   [Kotlin Multiplatform 中 Gradle 配置缓存的预览](#preview-of-the-gradle-configuration-cache)
*   [Kotlin Multiplatform 中 Android 目标平台支持的变化](#changes-to-android-target-support)
*   [Kotlin/Native 中自定义内存分配器的预览](#preview-of-custom-memory-allocator)
*   [Kotlin/Native 中的库链接](#library-linkage-in-kotlin-native)
*   [Kotlin/Wasm 中的大小相关优化](#size-related-optimizations)

你还可以在此视频中找到更新的简要概述：

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="What's new in Kotlin 1.9.0"/>

## IDE 支持

支持 1.9.0 的 Kotlin 插件适用于：

| IDE | 支持的版本 |
|---|---|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 插件将随 Android Studio Giraffe (223) 和 Hedgehog (231) 的即将发布版本一同提供。

Kotlin 1.9.0 插件将随 IntelliJ IDEA 2023.2 的即将发布版本一同提供。

> 要下载 Kotlin artifact 和依赖项，请[配置你的 Gradle 设置](#configure-gradle-settings)以使用 Maven Central Repository。
>
{style="warning"}

## 新的 Kotlin K2 编译器更新

JetBrains 的 Kotlin 团队持续稳定 K2 编译器，而 1.9.0 版本引入了进一步的改进。面向 JVM 的 K2 编译器现在已进入 **Beta** 阶段。

现在还为 Kotlin/Native 和多平台项目提供了基本支持。

### kapt 编译器插件与 K2 编译器的兼容性

你可以在你的项目中将 [kapt 插件](kapt.md)与 K2 编译器一起使用，但有一些限制。尽管将 `languageVersion` 设置为 `2.0`，kapt 编译器插件仍会使用旧的编译器。

如果你在 `languageVersion` 设置为 `2.0` 的项目中执行 kapt 编译器插件，kapt 将自动切换到 `1.9` 并禁用特定的版本兼容性检测。此行为等同于包含以下命令实参：
*   `-Xskip-metadata-version-check`
*   `-Xskip-prerelease-check`
*   `-Xallow-unstable-dependencies`

这些检测仅对 kapt 任务禁用。所有其他编译任务将继续使用新的 K2 编译器。

如果你在使用 kapt 和 K2 编译器时遇到任何问题，请向我们的[问题跟踪器](http://kotl.in/issue)报告。

### 在你的项目中尝试 K2 编译器

从 1.9.0 版本开始，直到 Kotlin 2.0 发布，你可以通过将 `kotlin.experimental.tryK2=true` 这个 Gradle 属性添加到你的 `gradle.properties` 文件中来轻松测试 K2 编译器。你也可以运行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

此 Gradle 属性会自动将语言版本设置为 2.0，并更新构建报告，其中包含使用 K2 编译器编译的 Kotlin 任务数量与当前编译器相比的信息：

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradle 构建报告

[Gradle 构建报告](gradle-compilation-and-caches.md#build-reports)现在显示是使用了当前编译器还是 K2 编译器来编译代码。在 Kotlin 1.9.0 中，你可以在 [Gradle 构建扫描](https://scans.gradle.com/)中查看此信息：

![Gradle build scan - K1](gradle-build-scan-k1.png){width=700}

![Gradle build scan - K2](gradle-build-scan-k2.png){width=700}

你还可以在构建报告中找到项目中使用的 Kotlin 版本：

```none
Task info:
  Kotlin language version: 1.9
```

> 如果你使用 Gradle 8.0，你可能会遇到一些构建报告问题，尤其是在启用 Gradle 配置缓存时。这是一个已知问题，已在 Gradle 8.1 及更高版本中修复。
>
{style="note"}

### 当前 K2 编译器限制

在你的 Gradle 项目中启用 K2 伴随着某些限制，这可能会影响在以下情况下使用 Gradle 8.3 以下版本的项目：

*   从 `buildSrc` 编译源代码。
*   在包含的构建中编译 Gradle 插件。
*   如果在 Gradle 8.3 以下版本的项目中使用其他 Gradle 插件，则编译这些插件。
*   构建 Gradle 插件依赖项。

如果你遇到上述任何问题，可以采取以下步骤来解决：

*   为 `buildSrc`、任何 Gradle 插件及其依赖项设置语言版本：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

*   将项目中的 Gradle 版本更新到 8.3（一旦可用）。

### 留下你对新 K2 编译器的反馈

我们期待收到你的任何反馈！

*   直接向 K2 开发者提供反馈：加入 Kotlin 的 Slack – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
*   向我们的[问题跟踪器](https://kotl.in/issue)报告你在新 K2 编译器中遇到的任何问题。
*   [启用 **发送使用情况统计信息** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)以允许 JetBrains 收集 K2 使用情况的匿名数据。

## 语言

在 Kotlin 1.9.0 中，我们正在稳定一些早期引入的新语言特性：
*   [enum class values 函数的替代](#stable-replacement-of-the-enum-class-values-function)
*   [data object 与 data class 的对称性](#stable-data-objects-for-symmetry-with-data-classes)
*   [支持 inline value class 中带函数体的次构造函数](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### enum class values 函数的稳定替代

在 1.8.20 中，enum class 的 `entries` 属性作为一项实验性的特性引入。`entries` 属性是合成 `values()` 函数的一种现代化且高性能的替代。在 1.9.0 中，`entries` 属性已稳定。

> `values()` 函数仍然受支持，但我们建议你使用 `entries` 属性。
>
{style="tip"}

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```
{validate="false"}

关于 enum class 的 `entries` 属性的更多信息，请参见 [Kotlin 1.8.20 新特性](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)。

### data object 与 data class 的稳定对称性

在 [Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes) 中引入的 data object 声明现在已稳定。这包括为与 data class 对称而添加的函数：`toString()`、`equals()` 和 `hashCode()`。

此特性对于 `sealed` 层次结构（例如 `sealed class` 或 `sealed interface` 层次结构）特别有用，因为 `data object` 声明可以方便地与 `data class` 声明一起使用。在此示例中，将 `EndOfFile` 声明为 `data object` 而不是普通 `object` 意味着它会自动拥有 `toString()` 函数，而无需手动覆盖。这保持了与伴随的 data class 定义的对称性。

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
{validate="false"}

更多信息，请参见 [Kotlin 1.8.20 新特性](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)。

### 支持 inline value class 中带函数体的次构造函数

从 Kotlin 1.9.0 开始，[inline value class](inline-classes.md) 中使用带函数体的次构造函数默认可用：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // 允许自 Kotlin 1.4.30 起：
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // 允许自 Kotlin 1.9.0 起默认使用：
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```
{validate="false"}

以前，Kotlin 只允许 inline class 中有公共的主构造函数。因此，不可能封装底层值或创建表示某些受限值的 inline class。

随着 Kotlin 的发展，这些问题得到了修复。Kotlin 1.4.30 取消了对 `init` 代码块的限制，然后 Kotlin 1.8.20 带来了带函数体的次构造函数的预览。它们现在默认可用。关于 Kotlin inline class 的更多发展信息，请参阅[这个 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md)。

## Kotlin/JVM

从 1.9.0 版本开始，编译器可以生成与 JVM 20 对应的字节码版本的类。此外，`JvmDefault` 注解和旧版 `-Xjvm-default` 模式的弃用仍在继续。

### JvmDefault 注解和旧版 -Xjvm-default 模式的弃用

从 Kotlin 1.5 开始，`JvmDefault` 注解的使用已被弃用，取而代之的是新的 `-Xjvm-default` 模式：`all` 和 `all-compatibility`。随着 Kotlin 1.4 中引入 `JvmDefaultWithoutCompatibility` 和 Kotlin 1.6 中引入 `JvmDefaultWithCompatibility`，这些模式提供了对 `DefaultImpls` 类生成的全面控制，确保与旧版 Kotlin 代码的无缝兼容性。

因此，在 Kotlin 1.9.0 中，`JvmDefault` 注解不再具有任何意义并已被标记为弃用，导致错误。它最终将从 Kotlin 中移除。

## Kotlin/Native

除了其他改进之外，此版本还进一步改进了 [Kotlin/Native 内存管理器](native-memory-manager.md)，这应该会增强其鲁棒性和性能：

*   [自定义内存分配器的预览](#preview-of-custom-memory-allocator)
*   [主线程上的 Objective-C 或 Swift 对象释放钩子](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
*   [在 Kotlin/Native 中访问常量值时无对象初始化](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
*   [在 Kotlin/Native 中为 iOS 模拟器测试配置独立模式的能力](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
*   [Kotlin/Native 中的库链接](#library-linkage-in-kotlin-native)

### 自定义内存分配器的预览

Kotlin 1.9.0 引入了自定义内存分配器的预览。其分配系统改善了 [Kotlin/Native 内存管理器](native-memory-manager.md)的运行时性能。

Kotlin/Native 中当前的对象分配系统使用通用分配器，该分配器不具备高效垃圾回收的功能。为了弥补这一点，它在垃圾收集器 (GC) 将所有已分配对象合并成一个链表之前，维护着线程局部链表，该链表可在清理期间进行迭代。这种方法存在几个性能缺点：

*   清理顺序缺乏内存局部性，并且通常会导致分散的内存访问模式，从而可能导致性能问题。
*   链表需要为每个对象额外的内存，这会增加内存使用量，尤其是在处理许多小对象时。
*   已分配对象的单个链表使得并行清理变得困难，当修改线程分配对象的速度快于 GC 线程收集它们的速度时，这可能会导致内存使用问题。

为了解决这些问题，Kotlin 1.9.0 引入了自定义分配器的预览。它将系统内存划分为页，允许以连续顺序进行独立清理。每次分配都成为页内的内存块，并且页会跟踪块大小。不同的页类型针对各种分配大小进行了优化。内存块的连续排列确保了对所有已分配块的高效迭代。

当线程分配内存时，它会根据分配大小搜索合适的页。线程维护着一组用于不同大小类别的页。通常，给定大小的当前页可以容纳分配。如果不能，线程会从共享分配空间请求不同的页。此页可能已经可用，需要清理，或者应该首先创建。

新的分配器允许同时拥有多个独立的分配空间，这将使 Kotlin 团队能够尝试不同的页布局，以进一步提高性能。

有关新分配器设计的更多信息，请参阅此 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。

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
{validate="false"}

#### 留下反馈

我们非常感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native) 中提供反馈，以改进自定义分配器。

### 主线程上的 Objective-C 或 Swift 对象释放钩子

从 Kotlin 1.9.0 开始，如果 Objective-C 或 Swift 对象在主线程上传递给 Kotlin，则 Objective-C 或 Swift 对象释放钩子将在主线程上调用。[Kotlin/Native 内存管理器](native-memory-manager.md)以前处理 Objective-C 对象引用的方式可能导致内存泄漏。我们相信新行为将提高内存管理器的鲁棒性。

考虑一个在 Kotlin 代码中被引用的 Objective-C 对象，例如，作为实参传递，由函数返回，或从集合中检索。在这种情况下，Kotlin 创建自己的对象，该对象持有对 Objective-C 对象的引用。当 Kotlin 对象被释放时，Kotlin/Native 运行时调用 `objc_release` 函数，该函数释放该 Objective-C 引用。

以前，Kotlin/Native 内存管理器在特殊的 GC 线程上运行 `objc_release`。如果它是最后一个对象引用，对象将被释放。当 Objective-C 对象具有自定义释放钩子（例如 Objective-C 中的 `dealloc` 方法或 Swift 中的 `deinit` 代码块），并且这些钩子期望在特定线程上调用时，可能会出现问题。

由于主线程上的对象钩子通常期望在那里被调用，Kotlin/Native 运行时现在也在主线程上调用 `objc_release`。它应该涵盖 Objective-C 对象在主线程上传递给 Kotlin，并在那里创建 Kotlin 对等对象的情况。这仅在主调度队列被处理时才有效，这对于常规 UI 应用程序是这种情况。当它不是主队列或对象在非主线程上传递给 Kotlin 时，`objc_release` 像以前一样在特殊的 GC 线程上调用。

#### 如何选择退出

如果你遇到问题，可以在 `gradle.properties` 文件中使用以下选项禁用此行为：

```none
kotlin.native.binary.objcDisposeOnMain=false
```

请随时向我们的[问题跟踪器](https://kotl.in/issue)报告此类情况。

### 在 Kotlin/Native 中访问常量值时无对象初始化

从 Kotlin 1.9.0 开始，Kotlin/Native 后端在访问 `const val` 字段时不会初始化对象：

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // 首次访问时无初始化
    val x = MyObject    // 发生初始化
    println(x.y)
}
```
{validate="false"}

此行为现在与 Kotlin/JVM 统一，其实现与 Java 保持一致，在这种情况下永远不会初始化对象。由于此更改，你还可以预期你的 Kotlin/Native 项目的性能会得到一些提高。

### 在 Kotlin/Native 中为 iOS 模拟器测试配置独立模式的能力

默认情况下，在运行 Kotlin/Native 的 iOS 模拟器测试时，使用 `--standalone` 标志来避免手动模拟器启动和关闭。在 1.9.0 中，你现在可以通过 `standalone` 属性来配置是否在 Gradle 任务中使用此标志。默认情况下，使用 `--standalone` 标志，因此独立模式是启用的。

以下是禁用 `standalone` 模式在 `build.gradle.kts` 文件中的示例：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```
{validate="false"}

> 如果你禁用独立模式，则必须手动启动模拟器。要从 CLI 启动模拟器，你可以使用以下命令：
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
>```
>
{style="warning"}

### Kotlin/Native 中的库链接

从 Kotlin 1.9.0 开始，Kotlin/Native 编译器处理 Kotlin 库中的链接问题的方式与 Kotlin/JVM 相同。如果某个第三方 Kotlin 库的作者在另一个第三方 Kotlin 库使用的实验性 API 中进行了不兼容的更改，你可能会面临此类问题。

现在，在第三方 Kotlin 库之间存在链接问题时，构建不会在编译期间失败。相反，你只会在运行时遇到这些错误，这与在 JVM 上完全相同。

Kotlin/Native 编译器每次检测到库链接问题时都会报告警告。你可以在编译日志中找到此类警告，例如：

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

你可以进一步配置甚至禁用项目中的此行为：

*   如果你不想在编译日志中看到这些警告，请使用 `-Xpartial-linkage-loglevel=INFO` 编译器选项来抑制它们。
*   还可以使用 `-Xpartial-linkage-loglevel=ERROR` 将报告警告的严重性提升为编译错误。在这种情况下，编译将失败，你将在编译日志中看到所有错误。使用此选项可以更仔细地检查链接问题。
*   如果你遇到此功能的意外问题，你可以随时使用 `-Xpartial-linkage=disable` 编译器选项选择退出。请随时向我们的[问题跟踪器](https://kotl.in/issue)报告此类情况。

```kotlin
// 通过 Gradle 构建文件传递编译器选项的示例。
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 抑制链接警告：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // 将链接警告提升为错误：
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // 完全禁用此特性：
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```
{validate="false"}

### 用于 C 互操作隐式整数转换的编译器选项

我们为 C 互操作引入了一个编译器选项，允许你使用隐式整数转换。经过仔细考虑，我们引入了此编译器选项以防止意外使用，因为此功能仍有改进空间，我们的目标是提供最高质量的 API。

在此代码示例中，即使 [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options) 具有无符号类型 `UInt` 且 `0` 为有符号，隐式整数转换也允许 `options = 0`。

```kotlin
val today = NSDate()
val tomorrow = NSCalendar.currentCalendar.dateByAddingUnit(
    unit = NSCalendarUnitDay,
    value = 1,
    toDate = today,
    options = 0
)
```
{validate="false"}

要将隐式转换与 native 互操作库一起使用，请使用 `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion` 编译器选项。

你可以在 Gradle 的 `build.gradle.kts` 文件中进行此配置：
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```
{validate="false"}

## Kotlin Multiplatform

Kotlin Multiplatform 在 1.9.0 中获得了一些显著更新，旨在改善你的开发者体验：

*   [Android 目标平台支持的变化](#changes-to-android-target-support)
*   [新 Android 源代码集布局默认启用](#new-android-source-set-layout-enabled-by-default)
*   [多平台项目中 Gradle 配置缓存的预览](#preview-of-the-gradle-configuration-cache)

### Android 目标平台支持的变化

我们继续努力稳定 Kotlin Multiplatform。重要的一步是为 Android 目标平台提供一流的支持。我们很高兴地宣布，未来 Google 的 Android 团队将提供自己的 Gradle 插件来支持 Kotlin Multiplatform 中的 Android。

为了为 Google 的新解决方案铺平道路，我们在 1.9.0 中重命名了当前 Kotlin DSL 中的 `android` 代码块。请将构建脚本中所有出现的 `android` 代码块更改为 `androidTarget`。这是一个临时更改，是为 Google 即将推出的 DSL 释放 `android` 名称所必需的。

Google 插件将是多平台项目中与 Android 配合使用的首选方式。当它准备就绪时，我们将提供必要的迁移说明，以便你能够像以前一样使用简短的 `android` 名称。

### 新 Android 源代码集布局默认启用

从 Kotlin 1.9.0 开始，新的 Android 源代码集布局是默认设置。它取代了以前的目录命名方案，该方案在多个方面令人困惑。新布局具有许多优点：

*   简化的类型语义 – 新的 Android 源代码布局提供了清晰一致的命名约定，有助于区分不同类型的源代码集。
*   改进的源代码目录布局 – 使用新布局，`SourceDirectories` 的排列变得更加连贯，从而更易于组织代码和查找源文件。
*   清晰的 Gradle 配置命名方案 – 该方案现在在 `KotlinSourceSets` 和 `AndroidSourceSets` 中都更加一致和可预测。

新布局需要 Android Gradle 插件版本 7.0 或更高版本，并支持 Android Studio 2022.3 及更高版本。请参阅我们的[迁移指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html)以在你的 `build.gradle(.kts)` 文件中进行必要的更改。

### Gradle 配置缓存的预览

<anchor name="preview-of-gradle-configuration-cache"/>

Kotlin 1.9.0 支持多平台库中的 [Gradle 配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)。如果你是库作者，你已经可以从改进的构建性能中受益。

Gradle 配置缓存通过重用配置阶段的结果来加快构建过程，以便后续构建。该特性自 Gradle 8.1 起已稳定。要启用它，请遵循 [Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)中的说明。

> Kotlin Multiplatform 插件仍然不支持与 Xcode 集成任务或 [Kotlin CocoaPods Gradle 插件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)一起使用 Gradle 配置缓存。我们预计将在未来的 Kotlin 版本中添加此特性。
>
{style="note"}

## Kotlin/Wasm

Kotlin 团队继续试验新的 Kotlin/Wasm 目标平台。此版本引入了一些性能和[大小相关优化](#size-related-optimizations)，以及 [JavaScript 互操作中的更新](#updates-in-javascript-interop)。

### 大小相关优化

Kotlin 1.9.0 为 WebAssembly (Wasm) 项目引入了显著的大小改进。比较两个“Hello World”项目，Kotlin 1.9.0 中 Wasm 的代码占用空间现在比 Kotlin 1.8.20 小 10 倍以上。

![Kotlin/Wasm size-related optimizations](wasm-1-9-0-size-improvements.png){width=700}

这些大小优化带来了更有效的资源利用和在使用 Kotlin 代码面向 Wasm 平台时的改进性能。

### JavaScript 互操作中的更新

此 Kotlin 更新引入了 Kotlin 和 JavaScript 之间针对 Kotlin/Wasm 互操作的更改。由于 Kotlin/Wasm 是一个[实验性的](components-stability.md#stability-levels-explained)特性，因此对其互操作性存在某些限制。

#### `Dynamic` 类型的限制

从 1.9.0 版本开始，Kotlin 不再支持在 Kotlin/Wasm 中使用 `Dynamic` 类型。现在弃用它，转而使用新的通用 `JsAny` 类型，它有助于 JavaScript 互操作。

更多详情，请参见 [Kotlin/Wasm 与 JavaScript 互操作](wasm-js-interop.md)文档。

#### 非外部类型的限制

Kotlin/Wasm 支持在将值传递给 JavaScript 和从 JavaScript 传递值时，对特定 Kotlin 静态类型进行转换。这些受支持的类型包括：

*   原生类型，例如有符号数字、`Boolean` 和 `Char`。
*   `String`。
*   函数类型。

其他类型作为不透明引用传递，没有进行转换，导致 JavaScript 和 Kotlin 子类型之间存在不一致。

为了解决这个问题，Kotlin 将 JavaScript 互操作限制为一组受良好支持的类型。从 Kotlin 1.9.0 开始，Kotlin/Wasm JavaScript 互操作中只支持外部、原生类型、字符串和函数类型。此外，还引入了一个单独的显式类型 `JsReference`，用于表示可以在 JavaScript 互操作中使用的 Kotlin/Wasm 对象的句柄。

更多详情，请参阅 [Kotlin/Wasm 与 JavaScript 互操作](wasm-js-interop.md)文档。

### Kotlin/Wasm 在 Kotlin Playground 中

Kotlin Playground 支持 Kotlin/Wasm 目标平台。
你可以编写、运行和分享你的面向 Kotlin/Wasm 的 Kotlin 代码。[立即试用！](https://pl.kotl.in/HDFAvimga)

> 使用 Kotlin/Wasm 需要在你的浏览器中启用实验性特性。
>
> [了解如何启用这些特性](wasm-troubleshooting.md)。
>
{style="note"}

```kotlin
import kotlin.time.*
import kotlin.time.measureTime

fun main() {
    println("Hello from Kotlin/Wasm!")
    computeAck(3, 10)
}

tailrec fun ack(m: Int, n: Int): Int = when {
    m == 0 -> n + 1
    n == 0 -> ack(m - 1, 1)
    else -> ack(m - 1, ack(m, n - 1))
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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-1-9-0-kotlin-wasm-playground"}

## Kotlin/JS

此版本引入了 Kotlin/JS 的更新，包括旧 Kotlin/JS 编译器的移除、Kotlin/JS Gradle 插件的弃用以及对 ES2015 的实验性支持：

*   [移除旧版 Kotlin/JS 编译器](#removal-of-the-old-kotlin-js-compiler)
*   [Kotlin/JS Gradle 插件的弃用](#deprecation-of-the-kotlin-js-gradle-plugin)
*   [外部枚举的弃用](#deprecation-of-external-enum)
*   [对 ES2015 类和模块的实验性支持](#experimental-support-for-es2015-classes-and-modules)
*   [JS 生产构件的默认目标路径已更改](#changed-default-destination-of-js-production-distribution)
*   [从 stdlib-js 中提取 org.w3c 声明](#extract-org-w3c-declarations-from-stdlib-js)

> 从 1.9.0 版本开始，[部分库链接](#library-linkage-in-kotlin-native)也为 Kotlin/JS 启用。
>
{style="note"}

### 移除旧版 Kotlin/JS 编译器

在 Kotlin 1.8.0 中，我们[宣布](whatsnew18.md#stable-js-ir-compiler-backend)基于 IR 的后端已[稳定](components-stability.md)。从那时起，不指定编译器就成了错误，而使用旧编译器则会导致警告。

在 Kotlin 1.9.0 中，使用旧后端会导致错误。请按照我们的[迁移指南](js-ir-migration.md)迁移到 IR 编译器。

### Kotlin/JS Gradle 插件的弃用

从 Kotlin 1.9.0 开始，`kotlin-js` Gradle 插件已弃用。我们鼓励你转而使用 `kotlin-multiplatform` Gradle 插件与 `js()` 目标平台。

Kotlin/JS Gradle 插件的功能本质上是重复 `kotlin-multiplatform` 插件的功能，并在底层共享相同的实现。这种重叠造成了混淆，并增加了 Kotlin 团队的维护负担。

请参阅我们的 [Kotlin Multiplatform 兼容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin)以获取迁移说明。如果你发现指南中未涵盖的任何问题，请向我们的[问题跟踪器](http://kotl.in/issue)报告。

### 外部枚举的弃用

在 Kotlin 1.9.0 中，外部枚举的使用将被弃用，因为存在静态枚举成员（如 `entries`）无法在 Kotlin 外部存在的问题。我们建议改用带对象子类的外部密封类：

```kotlin
// 之前
external enum class ExternalEnum { A, B }

// 之后
external sealed class ExternalEnum {
    object A: ExternalEnum
    object B: ExternalEnum
}
```
{validate="false"}

通过切换到带对象子类的外部密封类，你可以实现与外部枚举类似的功能，同时避免与默认方法相关的问题。

从 Kotlin 1.9.0 开始，外部枚举的使用将被标记为弃用。我们鼓励你更新代码以利用建议的外部密封类实现，以确保兼容性和未来的维护。

### 对 ES2015 类和模块的实验性支持

此版本引入了对 ES2015 模块和 ES2015 类生成的[实验性](components-stability.md#stability-levels-explained)支持：
*   模块提供了一种简化代码库和提高可维护性的方法。
*   类允许你结合面向对象编程 (OOP) 原则，从而产生更清晰、更直观的代码。

要启用这些特性，请相应地更新你的 `build.gradle.kts` 文件：

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
{validate="false"}

[在官方文档中了解有关 ES2015 (ECMAScript 2015, ES6) 的更多信息](https://262.ecma-international.org/6.0/)。

### JS 生产构件的默认目标路径已更改

在 Kotlin 1.9.0 之前，分发目标目录是 `build/distributions`。然而，这是 Gradle archive 的常见目录。为了解决这个问题，我们在 Kotlin 1.9.0 中将默认分发目标目录更改为：`build/dist/<targetName>/<binaryName>`。

例如，`productionExecutable` 以前在 `build/distributions` 中。在 Kotlin 1.9.0 中，它位于 `build/dist/js/productionExecutable` 中。

> 如果你有一个使用这些构建结果的流水线，请确保更新目录。
>
{style="warning"}

### 从 stdlib-js 中提取 org.w3c 声明

从 Kotlin 1.9.0 开始，`stdlib-js` 不再包含 `org.w3c` 声明。相反，这些声明已移至单独的 Gradle 依赖项。当你在 `build.gradle.kts` 文件中添加 Kotlin Multiplatform Gradle 插件时，这些声明将自动包含在你的项目中，类似于标准库。

无需任何手动操作或迁移。必要的调整将自动处理。

## Gradle

Kotlin 1.9.0 带来了新的 Gradle 编译器选项以及更多功能：

*   [移除 classpath 属性](#removed-classpath-property)
*   [新的 Gradle 编译器选项](#new-compiler-options)
*   [Kotlin/JVM 的项目级编译器选项](#project-level-compiler-options-for-kotlin-jvm)
*   [Kotlin/Native 模块名称的编译器选项](#compiler-option-for-kotlin-native-module-name)
*   [官方 Kotlin 库的独立编译器插件](#separate-compiler-plugins-for-official-kotlin-libraries)
*   [最低支持版本已增加](#incremented-minimum-supported-version)
*   [kapt 不再导致 Gradle 中的急切任务创建](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
*   [JVM 目标平台验证模式的编程式配置](#programmatic-configuration-of-the-jvm-target-validation-mode)

### 移除 classpath 属性

在 Kotlin 1.7.0 中，我们宣布开始弃用 `KotlinCompile` 任务的属性 `classpath`。在 Kotlin 1.8.0 中，弃用级别提高到 `ERROR`。在此版本中，我们最终移除了 `classpath` 属性。所有编译任务现在都应使用 `libraries` 输入来获取编译所需的库列表。

### 新的编译器选项

Kotlin Gradle 插件现在为 opt-ins 和编译器的渐进模式提供了新属性。

*   要选择启用新 API，你现在可以使用 `optIn` 属性并传递字符串列表，例如：`optIn.set(listOf(a, b, c))`。
*   要启用渐进模式，请使用 `progressiveMode.set(true)`。

### Kotlin/JVM 的项目级编译器选项

从 Kotlin 1.9.0 开始，`kotlin` 配置块中新增了一个 `compilerOptions` 代码块：

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```
{validate="false"}

这使得配置编译器选项变得容易得多。然而，需要注意一些重要细节：

*   此配置仅适用于项目级别。
*   对于 Android 插件，此代码块配置的对象与以下代码相同：

```kotlin
android {
    kotlinOptions {}
}
```
{validate="false"}

*   `android.kotlinOptions` 和 `kotlin.compilerOptions` 配置代码块会相互覆盖。构建文件中最后一个（最低的）代码块始终生效。
*   如果 `moduleName` 在项目级别配置，其值在传递给编译器时可能会更改。对于 `main` 编译而言并非如此，但对于其他类型，例如测试源代码，Kotlin Gradle 插件将添加 `_test` 后缀。
*   `tasks.withType<KotlinJvmCompile>().configureEach {}`（或 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`）内部的配置会覆盖 `kotlin.compilerOptions` 和 `android.kotlinOptions`。

### Kotlin/Native 模块名称的编译器选项

Kotlin/Native 的 [`module-name`](compiler-reference.md#module-name-name-native) 编译器选项现在在 Kotlin Gradle 插件中易于使用。

此选项指定编译模块的名称，也可以用于为导出到 Objective-C 的声明添加名称前缀。

你现在可以直接在 Gradle 构建文件的 `compilerOptions` 代码块中设置模块名称：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>("compileKotlinLinuxX64") {
    compilerOptions {
        moduleName.set("my-module-name")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlinLinuxX64", org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile.class) {
    compilerOptions {
        moduleName = "my-module-name"
    }
}
```

</tab>
</tabs>

### 官方 Kotlin 库的独立编译器插件

Kotlin 1.9.0 引入了其官方库的独立编译器插件。以前，编译器插件嵌入在其相应的 Gradle 插件中。这可能导致兼容性问题，如果编译器插件是针对高于 Gradle 构建的 Kotlin 运行时版本的 Kotlin 版本编译的。

现在，编译器插件作为独立的依赖项添加，因此你将不再面临与旧版本 Gradle 的兼容性问题。新方法的另一个主要优点是新编译器插件可以与其他构建系统（如 [Bazel](https://bazel.build/)）一起使用。

以下是我们现在发布到 Maven Central 的新编译器插件列表：

*   kotlin-atomicfu-compiler-plugin
*   kotlin-allopen-compiler-plugin
*   kotlin-lombok-compiler-plugin
*   kotlin-noarg-compiler-plugin
*   kotlin-sam-with-receiver-compiler-plugin
*   kotlinx-serialization-compiler-plugin

每个插件都有其 `-embeddable` 对应项，例如，`kotlin-allopen-compiler-plugin-embeddable` 旨在与 `kotlin-compiler-embeddable` artifact 一起使用，这是脚本 artifact 的默认选项。

Gradle 将这些插件作为编译器实参添加。你无需对现有项目进行任何更改。

### 最低支持版本已增加

从 Kotlin 1.9.0 开始，支持的最低 Android Gradle 插件版本是 4.2.2。

请参阅我们的文档中 [Kotlin Gradle 插件与可用 Gradle 版本的兼容性](gradle-configure-project.md#apply-the-plugin)。

### kapt 不再导致 Gradle 中的急切任务创建

在 1.9.0 之前，[kapt 编译器插件](kapt.md)通过请求 Kotlin 编译任务的已配置实例，导致急切任务创建。此行为已在 Kotlin 1.9.0 中修复。如果你使用 `build.gradle.kts` 文件的默认配置，则此更改不会影响你的设置。

> 如果你使用自定义配置，你的设置将受到不利影响。
> 例如，如果你使用 Gradle 的任务 API 修改了 `KotlinJvmCompile` 任务，则必须在构建脚本中类似地修改 `KaptGenerateStubs` 任务。
>
> 例如，如果你的脚本对 `KotlinJvmCompile` 任务有以下配置：
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // 你的自定义配置 }
> ```
> {validate="false"}
>
> 在这种情况下，你需要确保 `KaptGenerateStubs` 任务也包含相同的修改：
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // 你的自定义配置 }
>```
> {validate="false"}
>
{style="warning"}

更多信息，请参阅我们的 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation)。

### JVM 目标平台验证模式的编程式配置

在 Kotlin 1.9.0 之前，只有一种方法可以调整 Kotlin 和 Java 之间 JVM 目标平台不兼容性的检测。你必须在 `gradle.properties` 中为整个项目设置 `kotlin.jvm.target.validation.mode=ERROR`。

你现在还可以在 `build.gradle.kts` 文件中在任务级别进行配置：

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```
{validate="false"}

## 标准库

Kotlin 1.9.0 对标准库进行了一些重大改进：
*   [`..<` 操作符](#stable-operator-for-open-ended-ranges)和[时间 API](#stable-time-api) 已稳定。
*   [Kotlin/Native 标准库已彻底审阅和更新](#the-kotlin-native-standard-library-s-journey-towards-stabilization)。
*   [`@Volatile` 注解可在更多平台使用](#stable-volatile-annotation)。
*   [有一个**公共**函数可以通过名称获取正则表达式捕获组](#new-common-function-to-get-regex-capture-group-by-name)。
*   [引入了 `HexFormat` 类来格式化和解析十六进制](#new-hexformat-class-to-format-and-parse-hexadecimals)。

### 用于开区间操作的稳定 `..<` 操作符

新的 `..<` 操作符用于开区间操作，它在 [Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges) 中引入并在 1.8.0 中稳定。在 1.9.0 中，用于处理开区间操作的标准库 API 也已稳定。

我们的研究表明，新的 `..<` 操作符使得理解开区间的声明变得更容易。如果你使用 [`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html) 中缀函数，很容易错误地认为上限是包含在内的。

以下是使用 `until` 函数的示例：

```kotlin
fun main() {
    for (number in 2 until 10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 2 4 6 8
}
```
{validate="false"}

以下是使用新 `..<` 操作符的示例：

```kotlin
fun main() {
    for (number in 2..<10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 2 4 6 8
}
```
{validate="false"}

> 从 IntelliJ IDEA 2023.1.1 版本开始，提供了一项新的代码检测功能，当你可以使用 `..<` 操作符时，它会突出显示。
>
{style="note"}

有关此操作符的更多信息，请参见 [Kotlin 1.7.20 新特性](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)。

### 稳定时间 API

自 1.3.50 以来，我们已经预览了一个新的时间测量 API。该 API 的持续时间部分在 1.6.0 中稳定。在 1.9.0 中，剩余的时间测量 API 也已稳定。

旧的时间 API 提供了 `measureTimeMillis` 和 `measureNanoTime` 函数，它们的使用不直观。尽管它们都以不同的单位测量时间很清楚，但 `measureTimeMillis` 使用[挂钟](https://en.wikipedia.org/wiki/Elapsed_real_time)测量时间，而 `measureNanoTime` 使用单调时间源并不清楚。新的时间 API 解决了这个问题以及其他问题，使 API 更易于使用。

使用新的时间 API，你可以轻松地：
*   使用单调时间源和所需的时间单位测量代码执行所需的时间。
*   标记一个时间点。
*   比较并找出两个时间点之间的差异。
*   检测自特定时间点以来已经过去了多长时间。
*   检测当前时间是否已超过特定时间点。

#### 测量代码执行时间

要测量代码块执行所需的时间，请使用 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 内联函数。

要测量代码块执行所需的时间**并**返回代码块的结果，请使用 [`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 内联函数。

默认情况下，这两个函数都使用单调时间源。但是，如果你想使用实时流逝时间源，你也可以。例如，在 Android 上，默认时间源 `System.nanoTime()` 只在设备处于活动状态时计算时间。当设备进入深度睡眠时，它会失去对时间的跟踪。为了在设备深度睡眠时跟踪时间，你可以创建一个使用 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos()) 的时间源：

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```
{validate="false"}

#### 标记和测量时间差

要标记一个特定的时间点，请使用 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/) 接口和 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 函数来创建一个 [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)。要测量来自同一时间源的 `TimeMarks` 之间的差异，请使用减法操作符 (`-`)：

```kotlin
import kotlin.time.*

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 睡眠 0.5 秒。
    val mark2 = timeSource.markNow()

    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // 也可以相互比较时间标记。
    println(mark2 > mark1) // 为 true，因为 mark2 比 mark1 捕获得晚。
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-elapsed"}

要检查截止日期是否已过或是否已达到超时，请使用 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html) 和 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 扩展函数：

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    val fiveSeconds: Duration = 5.seconds
    val mark2 = mark1 + fiveSeconds

    // 还没过 5 秒
    println(mark2.hasPassedNow())
    // false

    // 等待 6 秒
    Thread.sleep(6000)
    println(mark2.hasPassedNow())
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-passednow"}

### Kotlin/Native 标准库的稳定化之旅

随着 Kotlin/Native 标准库的不断发展，我们决定是时候进行一次全面审阅，以确保其符合我们的高标准。作为其中的一部分，我们仔细审阅了**每一个**现有的公共签名。对于每个签名，我们都考虑了它是否：

*   具有独特的目的。
*   与 Kotin 其他 API 保持一致。
*   与 JVM 上的对应项行为相似。
*   面向未来。

基于这些考虑，我们做出了以下决策之一：
*   将其稳定。
*   使其成为实验性的。
*   将其标记为 `private`。
*   修改其行为。
*   将其移动到其他位置。
*   弃用它。
*   将其标记为已废弃。

> 如果现有签名已：
> *   移动到另一个包，则该签名仍存在于原始包中，但现在已弃用，弃用级别为 `WARNING`。IntelliJ IDEA 将在代码检测时自动建议替代项。
> *   弃用，则它已弃用，弃用级别为 `WARNING`。
> *   标记为已废弃，则你可以继续使用它，但它将在未来被替换。
>
{style="note"}

我们不会在此处列出审阅的所有结果，但以下是一些亮点：
*   我们稳定了 Atomics API。
*   我们将 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) 设为实验性的，现在需要不同的 opt-in 才能使用该包。更多信息，请参见[显式 C 互操作稳定性保证](#explicit-c-interoperability-stability-guarantees)。
*   我们将 [`Worker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker/) 类及其相关 API 标记为已废弃。
*   我们将 [`BitSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-bit-set/) 类标记为已废弃。
*   我们将 `kotlin.native.internal` 包中的所有 `public` API 标记为 `private` 或将其移动到其他包。

#### 显式 C 互操作稳定性保证

为了保持 API 的高质量，我们决定将 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) 设为实验性的。尽管 `kotlinx.cinterop` 已经过彻底的尝试和测试，但在我们满意并将其稳定之前，仍有改进空间。我们建议你将此 API 用于互操作，但尽量将其使用限制在项目中的特定区域。一旦我们开始发展此 API 以使其稳定，这将使你的迁移更容易。

如果你想使用类似 C 的外部 API（例如指针），则必须使用 `@OptIn(ExperimentalForeignApi)` 选择启用，否则你的代码将无法编译。

要使用 `kotlinx.cinterop` 的其余部分（涵盖 Objective-C/Swift 互操作），你必须选择启用 `@OptIn(BetaInteropApi)`。如果你尝试在没有选择启用的情况下使用此 API，你的代码将编译成功，但编译器会发出警告，提供对你所期望行为的清晰解释。

有关这些注解的更多信息，请参阅我们的 [`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt) 源代码。

有关此审阅所有更改的更多信息，请参阅我们的 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-55765)。

我们感谢你的任何反馈！你可以通过在 [ticket](https://youtrack.jetbrains.com/issue/KT-57728) 上评论直接提供反馈。

### 稳定 @Volatile 注解

如果你用 `@Volatile` 注解 `var` 属性，则幕后字段将被标记，以便对该字段的任何读取或写入都是原子的，并且写入总是对其他线程可见。

在 1.8.20 之前，[`kotlin.jvm.Volatile` 注解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/) 在公共标准库中可用。然而，此注解仅在 JVM 上有效。如果你在其他平台使用它，它将被忽略，从而导致错误。

在 1.8.20 中，我们引入了一个实验性的公共注解 `kotlin.concurrent.Volatile`，你可以在 JVM 和 Kotlin/Native 中预览它。

在 1.9.0 中，`kotlin.concurrent.Volatile` 已稳定。如果你在多平台项目中使用 `kotlin.jvm.Volatile`，我们建议你迁移到 `kotlin.concurrent.Volatile`。

### 通过名称获取正则表达式捕获组的新公共函数

在 1.9.0 之前，每个平台都有自己的扩展来从正则表达式匹配中通过名称获取正则表达式捕获组。然而，没有公共函数。在 Kotlin 1.8.0 之前不可能拥有公共函数，因为标准库仍然支持 JVM 目标平台 1.6 和 1.7。

从 Kotlin 1.8.0 开始，标准库与 JVM 目标平台 1.8 编译。因此，在 1.9.0 中，现在有一个**公共** [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html) 函数，你可以使用它来检索正则表达式匹配的捕获组内容。这在你想要访问属于特定捕获组的正则表达式匹配结果时很有用。

以下是一个包含三个捕获组（`city`、`state` 和 `areaCode`）的正则表达式示例。你可以使用这些组名称来访问匹配的值：

```kotlin
fun main() {
    val regex = """\b(?<city>[A-Za-z\s]+),\s(?<state>[A-Z]{2}):\s(?<areaCode>[0-9]{3})\b""".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    
    val match = regex.find(input)!!
    println(match.groups["city"]?.value)
    // Austin
    println(match.groups["state"]?.value)
    // TX
    println(match.groups["areaCode"]?.value)
    // 123
}
```
{validate="false"}

### 创建父目录的新路径工具

在 1.9.0 中，有一个新的 `createParentDirectories()` 扩展函数，你可以使用它来创建具有所有必要父目录的新文件。当你向 `createParentDirectories()` 提供文件路径时，它会检测父目录是否已存在。如果存在，它不执行任何操作。但是，如果不存在，它会为你创建它们。

`createParentDirectories()` 在复制文件时特别有用。例如，你可以将其与 `copyToRecursively()` 函数结合使用：

 ```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
 ```
{validate="false"}

### 新 HexFormat 类来格式化和解析十六进制

> 新的 `HexFormat` 类及其相关扩展函数是[实验性的](components-stability.md#stability-levels-explained)，要使用它们，你可以使用 `@OptIn(ExperimentalStdlibApi::class)` 或编译器实参 `-opt-in=kotlin.ExperimentalStdlibApi` 选择启用。
>
{style="warning"}

在 1.9.0 中，[`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 类及其相关扩展函数作为一项实验性特性提供，允许你在数值和十六进制字符串之间进行转换。具体来说，你可以使用扩展函数在十六进制字符串和 `ByteArrays` 或其他数字类型（`Int`、`Short`、`Long`）之间进行转换。

例如：

```kotlin
println(93.toHexString()) // "0000005d"
```
{validate="false"}

`HexFormat` 类包含格式化选项，你可以使用 `HexFormat{}` 构建器进行配置。

如果你正在处理 `ByteArrays`，你有以下选项，可通过属性进行配置：

| 选项 | 描述 |
|---|---|
| `upperCase` | 十六进制数字是大写还是小写。默认情况下，假定为小写。`upperCase = false`。 |
| `bytes.bytesPerLine` | 每行的最大字节数。 |
| `bytes.bytesPerGroup` | 每组的最大字节数。 |
| `bytes.bytesSeparator` | 字节之间的分隔符。默认情况下为空。 |
| `bytes.bytesPrefix` | 紧跟在每个字节两位十六进制表示之前的字符串，默认情况下为空。 |
| `bytes.bytesSuffix` | 紧跟在每个字节两位十六进制表示之后的字符串，默认情况下为空。 |

例如：

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// 使用 HexFormat{} 构建器通过冒号分隔十六进制字符串
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// "00:1b:63:84:45:e6"

// 使用 HexFormat{} 构建器执行以下操作：
// * 将十六进制字符串转换为大写
// * 将字节分组为对
// * 用句点分隔
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// "001B.6384.45E6"
```
{validate="false"}

如果你正在使用数字类型，你有以下选项，可通过属性进行配置：

| 选项 | 描述 |
|---|---|
| `number.prefix` | 十六进制字符串的前缀，默认情况下为空。 |
| `number.suffix` | 十六进制字符串的后缀，默认情况下为空。 |
| `number.removeLeadingZeros` | 是否移除十六进制字符串中的前导零。默认情况下，不移除前导零。`number.removeLeadingZeros = false` |

例如：

```kotlin
// 使用 HexFormat{} 构建器解析带有前缀 "0x" 的十六进制。
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // "58"
```
{validate="false"}

## 文档更新

Kotlin 文档收到了一些显著更改：
*   [Kotlin 之旅](kotlin-tour-welcome.md) – 通过包含理论和实践章节的指南，学习 Kotlin 编程语言的基础知识。
*   [Android 源代码集布局](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html) – 了解新的 Android 源代码集布局。
*   [Kotlin Multiplatform 兼容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html) – 了解你在使用 Kotlin Multiplatform 开发项目时可能遇到的不兼容更改。
*   [Kotlin Wasm](wasm-overview.md) – 了解 Kotlin/Wasm 以及如何在你的 Kotlin Multiplatform 项目中使用它。

## 安装 Kotlin 1.9.0

### 检测 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3 和 2023.1.1 会自动建议将 Kotlin 插件更新到 1.9.0 版本。IntelliJ IDEA 2023.2 将包含 Kotlin 1.9.0 插件。

Android Studio Giraffe (223) 和 Hedgehog (231) 将在其即将发布的版本中支持 Kotlin 1.9.0。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0)下载。

### 配置 Gradle 设置

要下载 Kotlin artifact 和依赖项，请更新你的 `settings.gradle(.kts)` 文件以使用 Maven Central 版本库：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

如果未指定版本库，Gradle 将使用已废弃的 JCenter 版本库，这可能会导致 Kotlin artifact 的问题。

## Kotlin 1.9.0 兼容性指南

Kotlin 1.9.0 是一个[特性版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能会带来与你为早期语言版本编写的代码不兼容的更改。有关这些更改的详细列表，请参见 [Kotlin 1.9.0 兼容性指南](compatibility-guide-19.md)。