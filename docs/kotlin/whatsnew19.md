[//]: # (title: Kotlin 1.9.0 新特性)

_[发布日期：2023 年 7 月 6 日](releases.md#release-details)_

Kotlin 1.9.0 版本现已发布，并且适用于 JVM 的 K2 编译器现在已进入 **Beta 版**。此外，以下是一些主要亮点：

* [新 Kotlin K2 编译器更新](#new-kotlin-k2-compiler-updates)
* [enum class values 函数的稳定替代](#stable-replacement-of-the-enum-class-values-function)
* [用于开区间的稳定 `..<` 运算符](#stable-operator-for-open-ended-ranges)
* [通过名称获取 regex 捕获组的新通用函数](#new-common-function-to-get-regex-capture-group-by-name)
* [创建父目录的新路径工具](#new-path-utility-to-create-parent-directories)
* [Kotlin Multiplatform 中 Gradle 配置缓存的预览](#preview-of-the-gradle-configuration-cache)
* [Kotlin Multiplatform 中 Android 目标支持的变更](#changes-to-android-target-support)
* [Kotlin/Native 中自定义内存分配器的预览](#preview-of-custom-memory-allocator)
* [Kotlin/Native 中的库链接](#library-linkage-in-kotlin-native)
* [Kotlin/Wasm 中与大小相关的优化](#size-related-optimizations)

你也可以在此视频中找到更新的简要概述：

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="What's new in Kotlin 1.9.0"/>

## IDE 支持

支持 1.9.0 的 Kotlin 插件适用于：

| IDE | 支持版本 |
|--|--|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 插件将包含在即将发布的 Android Studio Giraffe (223) 和 Hedgehog (231) 中。

Kotlin 1.9.0 插件将包含在即将发布的 IntelliJ IDEA 2023.2 中。

> 要下载 Kotlin 工件和依赖项，请[配置你的 Gradle 设置](#configure-gradle-settings)以使用 Maven Central Repository。
>
{style="warning"}

## 新 Kotlin K2 编译器更新

JetBrains 的 Kotlin 团队持续稳定 K2 编译器，1.9.0 版本引入了进一步的改进。适用于 JVM 的 K2 编译器现在已进入 **Beta 版**。

现在还对 Kotlin/Native 和多平台项目提供了基本支持。

### kapt 编译器插件与 K2 编译器的兼容性

你可以在项目中使用 [kapt 插件](kapt.md)以及 K2 编译器，但有一些限制。尽管将 `languageVersion` 设置为 `2.0`，kapt 编译器插件仍然使用旧编译器。

如果你在 `languageVersion` 设置为 `2.0` 的项目中执行 kapt 编译器插件，kapt 将自动切换到 `1.9` 并禁用特定的版本兼容性检查。此行为等同于包含以下命令行参数：
* `-Xskip-metadata-version-check`
* `-Xskip-prerelease-check`
* `-Xallow-unstable-dependencies`

这些检查仅对 kapt 任务禁用。所有其他编译任务将继续使用新的 K2 编译器。

如果你在使用 kapt 和 K2 编译器时遇到任何问题，请向我们的[问题追踪器](http://kotl.in/issue)报告。

### 在项目中尝试 K2 编译器

从 1.9.0 开始直到 Kotlin 2.0 发布，你可以通过将 `kotlin.experimental.tryK2=true` Gradle 属性添加到你的 `gradle.properties` 文件中来轻松测试 K2 编译器。你也可以运行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

此 Gradle 属性会自动将语言版本设置为 2.0，并更新构建报告，其中包含使用 K2 编译器编译的 Kotlin 任务数量与当前编译器的对比：

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradle 构建报告

[Gradle 构建报告](gradle-compilation-and-caches.md#build-reports)现在显示是使用当前编译器还是 K2 编译器来编译代码。在 Kotlin 1.9.0 中，你可以在 [Gradle 构建扫描](https://scans.gradle.com/)中查看此信息：

![Gradle build scan - K1](gradle-build-scan-k1.png){width=700}

![Gradle build scan - K2](gradle-build-scan-k2.png){width=700}

你也可以在构建报告中直接找到项目中使用的 Kotlin 版本：

```none
Task info:
  Kotlin language version: 1.9
```

> 如果你使用 Gradle 8.0，你可能会遇到一些构建报告问题，特别是当 Gradle 配置缓存启用时。这是一个已知问题，已在 Gradle 8.1 及更高版本中修复。
>
{style="note"}

### 当前 K2 编译器的限制

在 Gradle 项目中启用 K2 会带来某些限制，这些限制可能会影响使用 Gradle 8.3 以下版本的项目，在以下情况下：

* 编译 `buildSrc` 中的源代码。
* 编译包含构建中的 Gradle 插件。
* 如果其他 Gradle 插件在 Gradle 8.3 以下版本的项目中使用，则编译它们。
* 构建 Gradle 插件依赖项。

如果你遇到上述任何问题，可以采取以下步骤来解决：

* 为 `buildSrc`、任何 Gradle 插件及其依赖项设置语言版本：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

* 将项目中的 Gradle 版本更新到 8.3（一旦可用）。

### 对新 K2 编译器留下你的反馈

我们非常感谢你的任何反馈！

* 直接向 K2 开发者提供反馈，请加入 Kotlin 的 Slack – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
* 在我们的[问题追踪器](https://kotl.in/issue)上报告你使用新 K2 编译器遇到的任何问题。
* [启用**发送使用统计**选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，允许 JetBrains 收集 K2 使用的匿名数据。

## 语言

在 Kotlin 1.9.0 中，我们正在稳定一些早期引入的新语言特性：
* [enum class values 函数的替代](#stable-replacement-of-the-enum-class-values-function)
* [数据对象与数据类的对称性](#stable-data-objects-for-symmetry-with-data-classes)
* [支持带有主体的次构造函数在内联值类中](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### enum class values 函数的稳定替代

在 1.8.20 中，enum class 的 `entries` 属性作为实验性特性引入。`entries` 属性是合成 `values()` 函数的现代化且高性能的替代品。在 1.9.0 中，`entries` 属性是稳定版。

> `values()` 函数仍然受支持，但我们建议你使用 `entries` 属性代替。
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

有关 enum class `entries` 属性的更多信息，请参阅 [Kotlin 1.8.20 新特性](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)。

### 数据对象与数据类的稳定对称性

在 [Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes) 中引入的数据对象声明现在已稳定。这包括为与数据类对称而添加的函数：`toString()`、`equals()` 和 `hashCode()`。

此功能在 `sealed` 层次结构（如 `sealed class` 或 `sealed interface` 层次结构）中特别有用，因为 `data object` 声明可以方便地与 `data class` 声明一起使用。在此示例中，将 `EndOfFile` 声明为 `data object` 而不是普通 `object` 意味着它自动具有 `toString()` 函数，而无需手动覆盖。这保持了与伴随数据类定义的对称性。

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

有关更多信息，请参阅 [Kotlin 1.8.20 新特性](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)。

### 支持带有主体的次构造函数在内联值类中

从 Kotlin 1.9.0 开始，在[内联值类](inline-classes.md)中使用带有主体的次构造函数现在默认可用：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // 允许自 Kotlin 1.4.30 起：
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // 默认允许自 Kotlin 1.9.0 起：
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```
{validate="false"}

以前，Kotlin 仅允许内联类中的公共主构造函数。因此，无法封装底层值或创建表示某些受限值的内联类。

随着 Kotlin 的发展，这些问题得到了解决。Kotlin 1.4.30 取消了 `init` 块的限制，然后 Kotlin 1.8.20 带来了带有主体的次构造函数的预览。它们现在默认可用。在 [this KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中了解更多关于 Kotlin 内联类的发展。

## Kotlin/JVM

从 1.9.0 版本开始，编译器可以生成与 JVM 20 对应的字节码版本的类。此外，`JvmDefault` 注解和旧版 `-Xjvm-default` 模式的弃用仍在继续。

### JvmDefault 注解和旧版 -Xjvm-default 模式的弃用

从 Kotlin 1.5 开始，`JvmDefault` 注解的使用已弃用，取而代之的是更新的 `-Xjvm-default` 模式：`all` 和 `all-compatibility`。随着 Kotlin 1.4 中引入 `JvmDefaultWithoutCompatibility` 和 Kotlin 1.6 中引入 `JvmDefaultWithCompatibility`，这些模式提供了对 `DefaultImpls` 类生成的全面控制，确保与旧版 Kotlin 代码的无缝兼容性。

因此，在 Kotlin 1.9.0 中，`JvmDefault` 注解不再具有任何意义并已被标记为已弃用，导致错误。它最终将从 Kotlin 中移除。

## Kotlin/Native

除了其他改进，此版本还进一步增强了 [Kotlin/Native 内存管理器](native-memory-manager.md)，这应能提高其健壮性和性能：

* [自定义内存分配器的预览](#preview-of-custom-memory-allocator)
* [主线程上的 Objective-C 或 Swift 对象解分配钩子](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
* [访问 Kotlin/Native 中的常量值时不进行对象初始化](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [在 Kotlin/Native 中为 iOS 模拟器测试配置独立模式的能力](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
* [Kotlin/Native 中的库链接](#library-linkage-in-kotlin-native)

### 自定义内存分配器的预览

Kotlin 1.9.0 引入了自定义内存分配器的预览。其分配系统改进了 [Kotlin/Native 内存管理器](native-memory-manager.md)的运行时性能。

Kotlin/Native 中当前的对象分配系统使用通用分配器，该分配器不具备高效垃圾回收的功能。为了弥补这一点，它在垃圾回收器（GC）将所有已分配对象合并到单个列表之前，维护着线程本地的链表，该列表可以在扫描期间进行迭代。这种方法会带来几个性能缺陷：

* 扫描顺序缺乏内存局部性，并且通常导致分散的内存访问模式，从而导致潜在的性能问题。
* 链表需要为每个对象额外的内存，增加了内存使用量，尤其是在处理大量小对象时。
* 已分配对象的单列表使得并行扫描变得困难，这可能会导致当变异线程分配对象的速度快于 GC 线程收集它们的速度时出现内存使用问题。

为了解决这些问题，Kotlin 1.9.0 引入了自定义分配器的预览。它将系统内存划分为页面，允许按连续顺序独立扫描。每个分配都成为页面内的内存块，页面会跟踪块大小。不同的页面类型针对各种分配大小进行了优化。内存块的连续排列确保了对所有已分配块的有效迭代。

当线程分配内存时，它会根据分配大小搜索合适的页面。线程会为不同的尺寸类别维护一组页面。通常，给定尺寸的当前页面可以容纳该分配。如果不能，线程会从共享分配空间请求另一个页面。该页面可能已经可用、需要扫描或应该首先创建。

新的分配器允许同时拥有多个独立的分配空间，这将使 Kotlin 团队能够尝试不同的页面布局，以进一步提高性能。

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

### 主线程上的 Objective-C 或 Swift 对象解分配钩子

从 Kotlin 1.9.0 开始，如果 Objective-C 或 Swift 对象被传递到 Kotlin 的主线程上，则其解分配钩子将在主线程上被调用。[Kotlin/Native 内存管理器](native-memory-manager.md)以前处理 Objective-C 对象引用的方式可能导致内存泄漏。我们相信新行为应该能提高内存管理器的健壮性。

考虑一个在 Kotlin 代码中引用的 Objective-C 对象，例如，作为参数传递、由函数返回或从集合中检索。在这种情况下，Kotlin 会创建自己的对象来持有 Objective-C 对象的引用。当 Kotlin 对象被解分配时，Kotlin/Native 运行时会调用 `objc_release` 函数，该函数会释放该 Objective-C 引用。

以前，Kotlin/Native 内存管理器在特殊的 GC 线程上运行 `objc_release`。如果是最后一个对象引用，则该对象将被解分配。当 Objective-C 对象具有自定义解分配钩子（例如 Objective-C 中的 `dealloc` 方法或 Swift 中的 `deinit` 块），并且这些钩子期望在特定线程上调用时，可能会出现问题。

由于主线程上的对象的钩子通常期望在那里调用，因此 Kotlin/Native 运行时现在也会在主线程上调用 `objc_release`。这应该涵盖了当 Objective-C 对象在主线程上传递给 Kotlin，并在那里创建 Kotlin 对等对象的情况。这仅在处理主调度队列时有效，这对于常规 UI 应用程序是常见情况。如果不是主队列，或者对象在主线程以外的线程上传递给 Kotlin，则 `objc_release` 像以前一样在特殊的 GC 线程上调用。

#### 如何选择退出

如果你遇到问题，可以在 `gradle.properties` 文件中禁用此行为，使用以下选项：

```none
kotlin.native.binary.objcDisposeOnMain=false
```

请务必向我们的[问题追踪器](https://kotl.in/issue)报告此类情况。

### 访问 Kotlin/Native 中的常量值时不进行对象初始化

从 Kotlin 1.9.0 开始，Kotlin/Native 后端在访问 `const val` 字段时不会初始化对象：

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // 第一次访问时未初始化
    val x = MyObject    // 初始化发生
    println(x.y)
}
```
{validate="false"}

此行为现在已与 Kotlin/JVM 统一，其实现与 Java 一致，在此情况下对象永远不会被初始化。由于此更改，你还可以预期 Kotlin/Native 项目中的一些性能改进。

### 在 Kotlin/Native 中为 iOS 模拟器测试配置独立模式的能力

默认情况下，在运行 Kotlin/Native 的 iOS 模拟器测试时，使用 `--standalone` 标志以避免手动模拟器启动和关闭。在 1.9.0 中，你现在可以通过 `standalone` 属性配置是否在 Gradle 任务中使用此标志。默认情况下，使用 `--standalone` 标志，因此独立模式已启用。

以下是在 `build.gradle.kts` 文件中禁用独立模式的示例：

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

从 Kotlin 1.9.0 开始，Kotlin/Native 编译器处理 Kotlin 库中的链接问题的方式与 Kotlin/JVM 相同。如果某个第三方 Kotlin 库的作者对另一个第三方 Kotlin 库使用的实验性 API 进行了不兼容的更改，你可能会遇到此类问题。

现在，在第三方 Kotlin 库之间存在链接问题时，构建不会在编译期间失败。相反，你只会在运行时遇到这些错误，就像在 JVM 上一样。

每当 Kotlin/Native 编译器检测到库链接问题时，它都会报告警告。你可以在编译日志中找到此类警告，例如：

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

你可以进一步配置甚至禁用项目中的此行为：

* 如果你不想在编译日志中看到这些警告，可以使用 `-Xpartial-linkage-loglevel=INFO` 编译器选项来抑制它们。
* 也可以使用 `-Xpartial-linkage-loglevel=ERROR` 将报告警告的严重性提升到编译错误。在这种情况下，编译会失败，你将在编译日志中看到所有错误。使用此选项可以更仔细地检查链接问题。
* 如果你遇到此功能的意外问题，可以随时使用 `-Xpartial-linkage=disable` 编译器选项选择退出。请随时向我们的[问题追踪器](https://kotl.in/issue)报告此类情况。

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

                // 完全禁用此功能：
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```
{validate="false"}

### C 互操作隐式整数转换的编译器选项

我们为 C 互操作引入了一个编译器选项，允许你使用隐式整数转换。经过仔细考虑，我们引入了此编译器选项以防止意外使用，因为此功能仍有改进空间，我们的目标是拥有最高质量的 API。

在此代码示例中，隐式整数转换允许 `options = 0`，即使 [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options) 具有无符号类型 `UInt` 并且 `0` 是有符号的。

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

要与原生互操作库一起使用隐式转换，请使用 `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion` 编译器选项。

你可以在 Gradle `build.gradle.kts` 文件中进行配置：
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

* [Android 目标支持的变更](#changes-to-android-target-support)
* [新的 Android 源码集布局默认启用](#new-android-source-set-layout-enabled-by-default)
* [多平台项目中 Gradle 配置缓存的预览](#preview-of-the-gradle-configuration-cache)

### Android 目标支持的变更

我们继续努力稳定 Kotlin Multiplatform。重要的一步是为 Android 目标提供一流的支持。我们很高兴地宣布，未来 Google 的 Android 团队将提供其自己的 Gradle 插件来支持 Kotlin Multiplatform 中的 Android。

为了为 Google 的这一新解决方案开辟道路，我们在 1.9.0 中重命名了当前 Kotlin DSL 中的 `android` 块。请将构建脚本中所有 `android` 块的出现更改为 `androidTarget`。这是一个临时更改，为了给即将到来的 Google DSL 的 `android` 名称腾出空间是必要的。

Google 插件将是多平台项目中与 Android 配合使用的首选方式。当它准备就绪时，我们将提供必要的迁移说明，以便你能够像以前一样使用简短的 `android` 名称。

### 新的 Android 源码集布局默认启用

从 Kotlin 1.9.0 开始，新的 Android 源码集布局是默认布局。它取代了以前的目录命名方案，该方案在多个方面令人困惑。新布局有许多优点：

* 简化的类型语义 – 新的 Android 源码布局提供了清晰一致的命名约定，有助于区分不同类型的源码集。
* 改进的源码目录布局 – 使用新布局，`SourceDirectories` 的组织变得更加连贯，从而更容易组织代码和定位源文件。
* Gradle 配置的清晰命名方案 – 该方案现在在 `KotlinSourceSets` 和 `AndroidSourceSets` 中都更加一致和可预测。

新布局需要 Android Gradle 插件版本 7.0 或更高版本，并支持 Android Studio 2022.3 及更高版本。请参阅我们的[迁移指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html)以在你的 `build.gradle(.kts)` 文件中进行必要的更改。

### Gradle 配置缓存的预览

<anchor name="preview-of-gradle-configuration-cache"/>

Kotlin 1.9.0 支持多平台库中的 [Gradle 配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)。如果你是库作者，你已经可以从改进的构建性能中受益。

Gradle 配置缓存通过重用配置阶段的结果来加速后续构建的构建过程。此功能自 Gradle 8.1 起已稳定。要启用它，请按照 [Gradle 文档](https://docs.gradle.com/current/userguide/configuration_cache.html#config_cache:usage)中的说明进行操作。

> Kotlin Multiplatform 插件仍不支持带有 Xcode 集成任务或 [Kotlin CocoaPods Gradle 插件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)的 Gradle 配置缓存。我们希望在未来的 Kotlin 版本中添加此功能。
>
{style="note"}

## Kotlin/Wasm

Kotlin 团队继续试验新的 Kotlin/Wasm 目标。此版本引入了一些性能和[大小相关的优化](#size-related-optimizations)，以及 [JavaScript 互操作中的更新](#updates-in-javascript-interop)。

### 与大小相关的优化

Kotlin 1.9.0 为 WebAssembly (Wasm) 项目引入了显著的大小改进。比较两个“Hello World”项目，Kotlin 1.9.0 中 Wasm 的代码占用空间现在比 Kotlin 1.8.20 小 10 倍以上。

![Kotlin/Wasm size-related optimizations](wasm-1-9-0-size-improvements.png){width=700}

这些大小优化带来了更有效的资源利用和在使用 Kotlin 代码针对 Wasm 平台时的改进性能。

### JavaScript 互操作中的更新

此 Kotlin 更新引入了 Kotlin 和 JavaScript 之间在 Kotlin/Wasm 上的互操作性变化。由于 Kotlin/Wasm 是[实验性](components-stability.md#stability-levels-explained)功能，因此对其互操作性适用某些限制。

#### Dynamic 类型的限制

从 1.9.0 版本开始，Kotlin 不再支持在 Kotlin/Wasm 中使用 `Dynamic` 类型。现在已弃用此功能，取而代之的是新的通用 `JsAny` 类型，它促进了 JavaScript 互操作性。

有关更多详细信息，请参阅 [Kotlin/Wasm 与 JavaScript 的互操作性](wasm-js-interop.md)文档。

#### 非外部类型的限制

Kotlin/Wasm 支持在将值传递到 JavaScript 和从 JavaScript 传递值时，对特定 Kotlin 静态类型进行转换。这些受支持的类型包括：

* 原生类型，例如有符号数字、`Boolean` 和 `Char`。
* `String`。
* 函数类型。

其他类型作为不透明引用不经转换地传递，导致 JavaScript 和 Kotlin 子类型之间存在不一致。

为了解决这个问题，Kotlin 将 JavaScript 互操作限制为一组支持良好的类型。从 Kotlin 1.9.0 开始，Kotlin/Wasm JavaScript 互操作仅支持外部、原生、字符串和函数类型。此外，引入了一个单独的显式类型 `JsReference` 来表示可在 JavaScript 互操作中使用的 Kotlin/Wasm 对象的句柄。

有关更多详细信息，请参阅 [Kotlin/Wasm 与 JavaScript 的互操作性](wasm-js-interop.md)文档。

### Kotlin/Wasm 在 Kotlin Playground 中

Kotlin Playground 支持 Kotlin/Wasm 目标。
你可以编写、运行和共享针对 Kotlin/Wasm 的 Kotlin 代码。[快来试试吧！](https://pl.kotl.in/HDFAvimga)

> 使用 Kotlin/Wasm 需要在浏览器中启用实验性功能。
>
> [了解更多关于如何启用这些功能的信息](wasm-troubleshooting.md)。
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

* [旧 Kotlin/JS 编译器的移除](#removal-of-the-old-kotlin-js-compiler)
* [Kotlin/JS Gradle 插件的弃用](#deprecation-of-the-kotlin-js-gradle-plugin)
* [external enum 的弃用](#deprecation-of-external-enum)
* [对 ES2015 类和模块的实验性支持](#experimental-support-for-es2015-classes-and-modules)
* [JS 生产分发的默认目标更改](#changed-default-destination-of-js-production-distribution)
* [从 stdlib-js 中提取 org.w3c 声明](#extract-org-w3c-declarations-from-stdlib-js)

> 从 1.9.0 版本开始，[部分库链接](#library-linkage-in-kotlin-native)也已为 Kotlin/JS 启用。
>
{style="note"}

### 旧 Kotlin/JS 编译器的移除

在 Kotlin 1.8.0 中，我们[宣布](whatsnew18.md#stable-js-ir-compiler-backend)基于 IR 的后端已[稳定](components-stability.md)。从那时起，不指定编译器就成为一个错误，而使用旧编译器会导致警告。

在 Kotlin 1.9.0 中，使用旧后端会导致错误。请按照我们的[迁移指南](js-ir-migration.md)迁移到 IR 编译器。

### Kotlin/JS Gradle 插件的弃用

从 Kotlin 1.9.0 开始，`kotlin-js` Gradle 插件已弃用。我们鼓励你使用带有 `js()` 目标的 `kotlin-multiplatform` Gradle 插件。

Kotlin/JS Gradle 插件的功能本质上是重复了 `kotlin-multiplatform` 插件的功能，并且在底层共享相同的实现。这种重叠造成了混淆，并增加了 Kotlin 团队的维护负担。

有关迁移说明，请参阅我们的 [Kotlin Multiplatform 兼容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin)。如果你发现指南中未涵盖的任何问题，请向我们的[问题追踪器](http://kotl.in/issue)报告。

### external enum 的弃用

在 Kotlin 1.9.0 中，`external enum` 的使用将弃用，因为静态枚举成员（如 `entries`）无法在 Kotlin 之外存在。我们建议改用带有对象子类的 `external sealed class`：

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

通过切换到带有对象子类的 `external sealed class`，你可以实现与 `external enum` 类似的功能，同时避免与默认方法相关的问题。

从 Kotlin 1.9.0 开始，`external enum` 的使用将被标记为已弃用。我们鼓励你更新代码以使用建议的 `external sealed class` 实现，以实现兼容性和未来的维护。

### 对 ES2015 类和模块的实验性支持

此版本引入了对 ES2015 模块和 ES2015 类生成的[实验性](components-stability.md#stability-levels-explained)支持：
* 模块提供了一种简化代码库和提高可维护性的方法。
* 类允许你结合面向对象编程 (OOP) 原则，从而生成更简洁、更直观的代码。

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
{validate="false"}

[在官方文档中了解有关 ES2015 (ECMAScript 2015, ES6) 的更多信息](https://262.ecma-international.org/6.0/)。

### JS 生产分发的默认目标更改

在 Kotlin 1.9.0 之前，分发目标目录是 `build/distributions`。然而，这是 Gradle 归档的常用目录。为了解决这个问题，我们在 Kotlin 1.9.0 中将默认分发目标目录更改为：`build/dist/<targetName>/<binaryName>`。

例如，`productionExecutable` 以前在 `build/distributions` 中。在 Kotlin 1.9.0 中，它位于 `build/dist/js/productionExecutable` 中。

> 如果你有一个使用这些构建结果的流水线，请务必更新目录。
>
{style="warning"}

### 从 stdlib-js 中提取 org.w3c 声明

从 Kotlin 1.9.0 开始，`stdlib-js` 不再包含 `org.w3c` 声明。相反，这些声明已移至单独的 Gradle 依赖项。当你将 Kotlin Multiplatform Gradle 插件添加到 `build.gradle.kts` 文件时，这些声明将自动包含在你的项目中，类似于标准库。

无需任何手动操作或迁移。必要的调整将自动处理。

## Gradle

Kotlin 1.9.0 带来了新的 Gradle 编译器选项以及更多内容：

* [移除了 classpath 属性](#removed-classpath-property)
* [新的 Gradle 编译器选项](#new-compiler-options)
* [Kotlin/JVM 的项目级别编译器选项](#project-level-compiler-options-for-kotlin-jvm)
* [Kotlin/Native 模块名称的编译器选项](#compiler-option-for-kotlin-native-module-name)
* [官方 Kotlin 库的独立编译器插件](#separate-compiler-plugins-for-official-kotlin-libraries)
* [最低支持版本增加](#incremented-minimum-supported-version)
* [kapt 不再导致 Gradle 中的任务急切创建](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
* [JVM 目标验证模式的编程配置](#programmatic-configuration-of-the-jvm-target-validation-mode)

### 移除了 classpath 属性

在 Kotlin 1.7.0 中，我们[宣布](whatsnew17.md#deprecation-of-classpath-property) `KotlinCompile` 任务的属性 `classpath` 开始弃用周期。在 Kotlin 1.8.0 中，弃用级别提高到 `ERROR`。在此版本中，我们最终移除了 `classpath` 属性。所有编译任务现在都应使用 `libraries` 输入来获取编译所需的库列表。

### 新的编译器选项

Kotlin Gradle 插件现在为选择启用和编译器的渐进模式提供了新属性。

* 要选择启用新的 API，你现在可以使用 `optIn` 属性并传递一个字符串列表，例如：`optIn.set(listOf(a, b, c))`。
* 要启用渐进模式，请使用 `progressiveMode.set(true)`。

### Kotlin/JVM 的项目级别编译器选项

从 Kotlin 1.9.0 开始，`kotlin` 配置块中新增了 `compilerOptions` 块：

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```
{validate="false"}

这使得配置编译器选项变得容易得多。但是，需要注意一些重要细节：

* 此配置仅在项目级别有效。
* 对于 Android 插件，此块配置的对象与以下内容相同：

```kotlin
android {
    kotlinOptions {}
}
```
{validate="false"}

* `android.kotlinOptions` 和 `kotlin.compilerOptions` 配置块相互覆盖。构建文件中最后一个（最低的）块始终生效。
* 如果在项目级别配置了 `moduleName`，其值在传递给编译器时可能会更改。`main` 编译不会出现这种情况，但对于其他类型（例如测试源），Kotlin Gradle 插件将添加 `_test` 后缀。
* `tasks.withType<KotlinJvmCompile>().configureEach {}`（或 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`）中的配置会覆盖 `kotlin.compilerOptions` 和 `android.kotlinOptions`。

### Kotlin/Native 模块名称的编译器选项

Kotlin/Native [`module-name`](compiler-reference.md#module-name-name-native) 编译器选项现在在 Kotlin Gradle 插件中易于使用。

此选项为编译模块指定一个名称，也可以用于为导出到 Objective-C 的声明添加名称前缀。

你现在可以直接在 Gradle 构建文件的 `compilerOptions` 块中设置模块名称：

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

Kotlin 1.9.0 为其官方库引入了独立的编译器插件。以前，编译器插件嵌入在其相应的 Gradle 插件中。如果编译器插件是针对高于 Gradle 构建的 Kotlin 运行时版本的 Kotlin 版本编译的，这可能会导致兼容性问题。

现在，编译器插件作为单独的依赖项添加，因此你将不再面临与旧版 Gradle 版本的兼容性问题。新方法的另一个主要优点是，新的编译器插件可以与其他构建系统（如 [Bazel](https://bazel.build/)）一起使用。

以下是我们现在发布到 Maven Central 的新编译器插件列表：

* kotlin-atomicfu-compiler-plugin
* kotlin-allopen-compiler-plugin
* kotlin-lombok-compiler-plugin
* kotlin-noarg-compiler-plugin
* kotlin-sam-with-receiver-compiler-plugin
* kotlinx-serialization-compiler-plugin

每个插件都有其 `-embeddable` 对应物，例如，`kotlin-allopen-compiler-plugin-embeddable` 旨在与 `kotlin-compiler-embeddable` 工件一起使用，这是脚本工件的默认选项。

Gradle 将这些插件添加为编译器参数。你无需对现有项目进行任何更改。

### 最低支持版本增加

从 Kotlin 1.9.0 开始，支持的最低 Android Gradle 插件版本是 4.2.2。

有关 Kotlin Gradle 插件与可用 Gradle 版本的兼容性，请参阅我们的文档：[配置项目](gradle-configure-project.md#apply-the-plugin)。

### kapt 不再导致 Gradle 中的任务急切创建

在 1.9.0 之前，[kapt 编译器插件](kapt.md)通过请求 Kotlin 编译任务的已配置实例来导致任务的急切创建。此行为已在 Kotlin 1.9.0 中修复。如果你使用 `build.gradle.kts` 文件的默认配置，那么你的设置不受此更改的影响。

> 如果你使用自定义配置，你的设置将受到不利影响。
> 例如，如果你使用 Gradle 的任务 API 修改了 `KotlinJvmCompile` 任务，则必须在构建脚本中类似地修改 `KaptGenerateStubs` 任务。
>
> 例如，如果你的脚本对 `KotlinJvmCompile` 任务有以下配置：
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // Your custom configuration }
> ```
> {validate="false"}
>
> 在这种情况下，你需要确保相同的修改作为 `KaptGenerateStubs` 任务的一部分包含在内：
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // Your custom configuration }
> ```
> {validate="false"}
>
{style="warning"}

有关更多信息，请参阅我们的 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation)。

### JVM 目标验证模式的编程配置

在 Kotlin 1.9.0 之前，调整 Kotlin 和 Java 之间 JVM 目标不兼容性检测的方法只有一种。你必须在 `gradle.properties` 中为整个项目设置 `kotlin.jvm.target.validation.mode=ERROR`。

你现在还可以在 `build.gradle.kts` 文件中在任务级别对其进行配置：

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```
{validate="false"}

## 标准库

Kotlin 1.9.0 对标准库进行了一些重大改进：
* `..<` 运算符和时间 API 已稳定。
* [Kotlin/Native 标准库已彻底审查和更新](#the-kotlin-native-standard-library-s-journey-towards-stabilization)
* [`@Volatile` 注解可在更多平台上使用](#stable-volatile-annotation)
* [新增一个**通用**函数，可通过名称获取正则表达式捕获组](#new-common-function-to-get-regex-capture-group-by-name)
* [引入了 `HexFormat` 类来格式化和解析十六进制数](#new-hexformat-class-to-format-and-parse-hexadecimals)

### 稳定 `..<` 运算符用于开区间

新的 `..<` 运算符用于开区间，该运算符在 [Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges) 中引入，并在 1.8.0 中稳定。在 1.9.0 中，用于处理开区间的标准库 API 也已稳定。

我们的研究表明，新的 `..<` 运算符使得理解何时声明开区间变得更容易。如果你使用 [`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html) 中缀函数，很容易犯错，误认为上限是包含的。

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

以下是使用新的 `..<` 运算符的示例：

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

> 从 IntelliJ IDEA 2023.1.1 版本开始，提供了一个新的代码检查，当你可以使用 `..<` 运算符时会突出显示。
>
{style="note"}

有关此运算符可以做什么的更多信息，请参阅 [Kotlin 1.7.20 新特性](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)。

### 稳定时间 API

自 1.3.50 起，我们预览了一个新的时间测量 API。该 API 的持续时间部分在 1.6.0 中稳定。在 1.9.0 中，剩余的时间测量 API 已稳定。

旧的时间 API 提供了 `measureTimeMillis` 和 `measureNanoTime` 函数，它们不直观。尽管它们都以不同的单位测量时间，但 `measureTimeMillis` 使用[挂钟时间](https://en.wikipedia.org/wiki/Elapsed_real_time)来测量时间，而 `measureNanoTime` 使用单调时间源，这一点并不清楚。新的时间 API 解决了这个问题和其他问题，以使 API 更用户友好。

使用新的时间 API，你可以轻松地：
* 使用单调时间源和所需的单位测量执行某些代码所需的时间。
* 标记一个时间点。
* 比较并找出两个时间点之间的差异。
* 检查自某个特定时间点以来已经过去了多少时间。
* 检查当前时间是否已超过某个特定时间点。

#### 测量代码执行时间

要测量执行代码块所需的时间，请使用 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 内联函数。

要测量执行代码块所需的时间**并**返回代码块的结果，请使用 [`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 内联函数。

默认情况下，这两个函数都使用单调时间源。但是，如果你想使用实时时间源，也可以。例如，在 Android 上，默认时间源 `System.nanoTime()` 仅在设备处于活动状态时计算时间。当设备进入深度睡眠时，它会失去对时间的跟踪。为了在设备深度睡眠时跟踪时间，你可以创建一个使用 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos()) 的时间源：

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```
{validate="false"}

#### 标记和测量时间差异

要标记特定的时间点，请使用 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/) 接口和 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 函数来创建 [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)。要测量来自同一时间源的 `TimeMark` 之间的差异，请使用减法运算符 (`-`)：

```kotlin
import kotlin.time.*

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 暂停 0.5 秒。
    val mark2 = timeSource.markNow()

    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // 也可以比较时间标记。
    println(mark2 > mark1) // 这为 true，因为 mark2 比 mark1 捕获得晚。
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-elapsed"}

要检查截止日期是否已过或超时是否已达到，请使用 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html) 和 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 扩展函数：

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

    // 等待六秒
    Thread.sleep(6000)
    println(mark2.hasPassedNow())
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-passednow"}

### Kotlin/Native 标准库的稳定化进程

随着我们的 Kotlin/Native 标准库不断发展，我们决定对其进行全面审查，以确保其符合我们的高标准。作为其中的一部分，我们仔细审查了**每个**现有的公共签名。对于每个签名，我们考虑了它是否：

* 具有独特的用途。
* 与其他 Kotlin API 一致。
* 行为与其 JVM 对应物相似。
* 具有未来兼容性。

基于这些考虑，我们做出了以下决定之一：
* 使其稳定。
* 使其实验性。
* 标记为 `private`。
* 修改其行为。
* 将其移动到其他位置。
* 弃用。
* 标记为过时。

> 如果现有签名已：
> * 移动到其他包，则该签名仍在原始包中存在，但现在已弃用，弃用级别为：`WARNING`。IntelliJ IDEA 将在代码检查时自动建议替换。
> * 弃用，则其弃用级别为：`WARNING`。
> * 标记为过时，则你可以继续使用它，但它将在未来被替换。
>
{style="note"}

我们不会在此处列出审查的所有结果，但以下是一些亮点：
* 我们稳定了 Atomics API。
* 我们将 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) 设为实验性，现在需要不同的选择启用才能使用该包。有关更多信息，请参阅[显式 C 互操作稳定性保证](#explicit-c-interoperability-stability-guarantees)。
* 我们将 `Worker` 类及其相关 API 标记为过时。
* 我们将 `BitSet` 类标记为过时。
* 我们将 `kotlin.native.internal` 包中的所有 `public` API 标记为 `private` 或将其移动到其他包。

#### 显式 C 互操作稳定性保证

为了保持我们 API 的高质量，我们决定将 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) 设为实验性。尽管 `kotlinx.cinterop` 经过了彻底的尝试和测试，但在我们满意并将其稳定化之前，仍有改进空间。我们建议你将此 API 用于互操作性，但尽量将其使用限制在项目中的特定区域。一旦我们开始演进此 API 以使其稳定，这将使你的迁移更容易。

如果你想使用类似 C 的外部 API（例如指针），你必须使用 `@OptIn(ExperimentalForeignApi)` 选择启用，否则你的代码将无法编译。

要使用 `kotlinx.cinterop` 的其余部分（涵盖 Objective-C/Swift 互操作性），你必须使用 `@OptIn(BetaInteropApi)` 选择启用。如果你尝试在没有选择启用的情况下使用此 API，你的代码将编译，但编译器将发出警告，清楚地解释你可以预期哪些行为。

有关这些注解的更多信息，请参阅我们的 [`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt) 源代码。

有关此审查中**所有**更改的更多信息，请参阅我们的 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-55765)。

我们非常感谢你可能提出的任何反馈！你可以直接在[该问题](https://youtrack.jetbrains.com/issue/KT-57728)上发表评论来提供反馈。

### 稳定 `@Volatile` 注解

如果你用 `@Volatile` 注解 `var` 属性，则支持字段会被标记，以便对该字段的任何读取或写入都是原子操作，并且写入总是对其他线程可见。

在 1.8.20 之前，[`kotlin.jvm.Volatile` 注解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)在通用标准库中可用。但是，此注解仅在 JVM 上有效。如果你在其他平台上使用它，它将被忽略，从而导致错误。

在 1.8.20 中，我们引入了一个实验性的通用注解 `kotlin.concurrent.Volatile`，你可以在 JVM 和 Kotlin/Native 中预览它。

在 1.9.0 中，`kotlin.concurrent.Volatile` 已稳定。如果你在多平台项目中使用 `kotlin.jvm.Volatile`，我们建议你迁移到 `kotlin.concurrent.Volatile`。

### 通过名称获取 regex 捕获组的新通用函数

在 1.9.0 之前，每个平台都有自己的扩展来从正则表达式匹配中通过名称获取正则表达式捕获组。但是没有通用的函数。在 Kotlin 1.8.0 之前不可能有通用函数，因为标准库仍然支持 JVM 目标 1.6 和 1.7。

从 Kotlin 1.8.0 开始，标准库使用 JVM 目标 1.8 编译。因此在 1.9.0 中，现在有一个**通用** [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html) 函数，你可以使用它来为正则表达式匹配检索组的内容（通过其名称）。这在你想要访问属于特定捕获组的正则表达式匹配结果时很有用。

以下是一个包含三个捕获组的正则表达式示例：`city`、`state` 和 `areaCode`。你可以使用这些组名称来访问匹配的值：

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

在 1.9.0 中，有一个新的 `createParentDirectories()` 扩展函数，你可以使用它来创建带有所有必要父目录的新文件。当你向 `createParentDirectories()` 提供文件路径时，它会检查父目录是否已存在。如果存在，它不做任何操作。但是，如果不存在，它会为你创建它们。

`createParentDirectories()` 在复制文件时特别有用。例如，你可以将其与 `copyToRecursively()` 函数结合使用：

 ```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
 ```
{validate="false"}

### 新增 HexFormat 类用于格式化和解析十六进制数

> 新的 `HexFormat` 类及其相关的扩展函数是[实验性](components-stability.md#stability-levels-explained)功能，要使用它们，你可以使用 `@OptIn(ExperimentalStdlibApi::class)` 或编译器参数 `-opt-in=kotlin.ExperimentalStdlibApi` 来选择启用。
>
{style="warning"}

在 1.9.0 中，[`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 类及其相关的扩展函数作为实验性功能提供，允许你在数值和十六进制字符串之间进行转换。具体来说，你可以使用扩展函数在十六进制字符串和 `ByteArrays` 或其他数值类型（`Int`、`Short`、`Long`）之间进行转换。

例如：

```kotlin
println(93.toHexString()) // "0000005d"
```
{validate="false"}

`HexFormat` 类包括格式化选项，你可以使用 `HexFormat{}` 构建器进行配置。

如果你正在使用 `ByteArrays`，你拥有以下可由属性配置的选项：

| 选项 | 描述 |
|--|--|
| `upperCase` | 十六进制数字是大写还是小写。默认假定为小写。`upperCase = false`。 |
| `bytes.bytesPerLine` | 每行的最大字节数。 |
| `bytes.bytesPerGroup` | 每组的最大字节数。 |
| `bytes.bytesSeparator` | 字节之间的分隔符。默认无。 |
| `bytes.bytesPrefix` | 紧跟在每个字节的两位十六进制表示之前的字符串，默认无。 |
| `bytes.bytesSuffix` | 紧跟在每个字节的两位十六进制表示之后的字符串，默认无。 |

例如：

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// 使用 HexFormat{} 构建器以冒号分隔十六进制字符串
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// "00:1b:63:84:45:e6"

// 使用 HexFormat{} 构建器来：
// * 将十六进制字符串转换为大写
// * 将字节两两分组
// * 用句点分隔
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// "001B.6384.45E6"
```
{validate="false"}

如果你正在使用数值类型，你拥有以下可由属性配置的选项：

| 选项 | 描述 |
|--|--|
| `number.prefix` | 十六进制字符串的前缀，默认无。 |
| `number.suffix` | 十六进制字符串的后缀，默认无。 |
| `number.removeLeadingZeros` | 是否删除十六进制字符串中的前导零。默认不删除前导零。`number.removeLeadingZeros = false` |

例如：

```kotlin
// 使用 HexFormat{} 构建器解析带有前缀“0x”的十六进制数。
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // "58"
```
{validate="false"}

## 文档更新

Kotlin 文档收到了一些显著的更改：
* [Kotlin 之旅](kotlin-tour-welcome.md) – 学习 Kotlin 编程语言的基础知识，章节包括理论和实践。
* [Android 源码集布局](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-android-layout.html) – 了解新的 Android 源码集布局。
* [Kotlin Multiplatform 兼容性指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-compatibility-guide.html) – 了解你在使用 Kotlin Multiplatform 开发项目时可能遇到的不兼容更改。
* [Kotlin Wasm](wasm-overview.md) – 了解 Kotlin/Wasm 以及如何在 Kotlin Multiplatform 项目中使用它。

## 安装 Kotlin 1.9.0

### 检查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3 和 2023.1.1 会自动建议将 Kotlin 插件更新到 1.9.0 版本。IntelliJ IDEA 2023.2 将包含 Kotlin 1.9.0 插件。

Android Studio Giraffe (223) 和 Hedgehog (231) 将在即将发布的版本中支持 Kotlin 1.9.0。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0)下载。

### 配置 Gradle 设置

要下载 Kotlin 工件和依赖项，请更新你的 `settings.gradle(.kts)` 文件以使用 Maven Central 仓库：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

如果未指定仓库，Gradle 将使用已淘汰的 JCenter 仓库，这可能导致 Kotlin 工件出现问题。

## Kotlin 1.9.0 兼容性指南

Kotlin 1.9.0 是一个[特性发布版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能带来与你用早期版本语言编写的代码不兼容的更改。在 [Kotlin 1.9.0 兼容性指南](compatibility-guide-19.md)中查找这些更改的详细列表。