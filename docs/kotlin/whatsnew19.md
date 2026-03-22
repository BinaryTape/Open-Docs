[//]: # (title: Kotlin 1.9.0 最新变化)

<web-summary>阅读 Kotlin 1.9.0 版本说明，涵盖新语言功能、Kotlin Multiplatform、JVM、Native、JS 和 Wasm 的更新，以及对 Gradle 和 Maven 的构建工具支持。</web-summary>

_[发布日期：2023 年 7 月 6 日](releases.md#release-history)_

Kotlin 1.9.0 版本已发布，适用于 JVM 的 K2 编译器现已进入 **Beta** 阶段。此外，以下是一些主要亮点：

* [新的 Kotlin K2 编译器更新](#new-kotlin-k2-compiler-updates)
* [enum 类 values 函数的稳定替代](#stable-replacement-of-the-enum-class-values-function)
* [用于开区间的稳定 `..<` 运算符](#stable-operator-for-open-ended-ranges)
* [按名称获取正则捕获组的新通用函数](#new-common-function-to-get-regex-capture-group-by-name)
* [用于创建父目录的新路径实用程序](#new-path-utility-to-create-parent-directories)
* [Kotlin Multiplatform 中 Gradle 配置缓存的预览](#preview-of-the-gradle-configuration-cache)
* [Kotlin Multiplatform 中 Android 目标支持的变化](#changes-to-android-target-support)
* [Kotlin/Native 中自定义内存分配器的预览](#preview-of-custom-memory-allocator)
* [Kotlin/Native 中的库链接](#library-linkage-in-kotlin-native)
* [Kotlin/Wasm 中与大小相关的优化](#size-related-optimizations)

您也可以在此视频中找到更新的简短概述：

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="Kotlin 1.9.0 最新变化"/>

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## IDE 支持

支持 1.9.0 的 Kotlin 插件适用于：

| IDE | 支持的版本 |
|--|--|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 插件将包含在即将发布的 Android Studio Giraffe (223) 和 Hedgehog (231) 中。

Kotlin 1.9.0 插件将包含在即将发布的 IntelliJ IDEA 2023.2 中。

> 要下载 Kotlin 构件和依赖项，请[配置您的 Gradle 设置](#configure-gradle-settings)以使用 Maven Central 仓库。
>
{style="warning"}

## 新的 Kotlin K2 编译器更新

JetBrains 的 Kotlin 团队继续致力于稳定 K2 编译器，1.9.0 版本引入了进一步的进展。
适用于 JVM 的 K2 编译器现已进入 **Beta** 阶段。

现在还提供了对 Kotlin/Native 和多平台项目的初步支持。

### kapt 编译器插件与 K2 编译器的兼容性

您可以在项目中使用 [kapt 插件](kapt.md) 以及 K2 编译器，但存在一些限制。 
尽管将 `languageVersion` 设置为 `2.0`，kapt 编译器插件仍然利用旧编译器。

如果您在 `languageVersion` 设置为 `2.0` 的项目中执行 kapt 编译器插件，kapt 将自动
切换到 `1.9` 并禁用特定版本的兼容性检查。此行为相当于包含以下命令参数：
* `-Xskip-metadata-version-check`
* `-Xskip-prerelease-check`
* `-Xallow-unstable-dependencies`

这些检查仅针对 kapt 任务禁用。所有其他编译任务将继续利用新的 K2 编译器。

如果您在配合使用 kapt 与 K2 编译器时遇到任何问题，请将其报告到我们的[问题跟踪器](http://kotl.in/issue)。

### 在您的项目中尝试 K2 编译器

从 1.9.0 开始，在 Kotlin 2.0 发布之前，您可以通过在 `gradle.properties` 文件中添加 `kotlin.experimental.tryK2=true` 
Gradle 属性来轻松测试 K2 编译器。您也可以运行以下命令：

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

此 Gradle 属性会自动将语言版本设置为 2.0，并更新构建报告，显示使用 K2 编译器编译的 Kotlin 
任务数量与当前编译器的对比：

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradle 构建报告

[Gradle 构建报告](gradle-compilation-and-caches.md#build-reports)现在会显示是使用当前编译器还是 K2 编译器来编译代码。在 Kotlin 1.9.0 中，您可以在 [Gradle build scans](https://scans.gradle.com/) 中看到这些信息：

![Gradle build scan - K1](gradle-build-scan-k1.png){width=700}

![Gradle build scan - K2](gradle-build-scan-k2.png){width=700}

您也可以直接在构建报告中找到项目中使用的 Kotlin 版本：

```none
Task info:
  Kotlin language version: 1.9
```

> 如果您使用 Gradle 8.0，您可能会遇到构建报告的一些问题，特别是在启用 Gradle 配置缓存时。这是一个已知问题，已在 Gradle 8.1 及更高版本中修复。
>
{style="note"}

### 当前 K2 编译器限制

在您的 Gradle 项目中启用 K2 会带来某些限制，这些限制可能会影响在以下情况下使用 8.3 以下 Gradle 版本的项目：

* 编译来自 `buildSrc` 的源代码。
* 编译包含在构建（included builds）中的 Gradle 插件。
* 编译其他 Gradle 插件（如果它们在 Gradle 版本低于 8.3 的项目中使用）。
* 构建 Gradle 插件依赖项。

如果您遇到上述任何问题，可以采取以下步骤来解决：

* 为 `buildSrc`、任何 Gradle 插件及其依赖项设置语言版本：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

* 将项目中的 Gradle 版本更新至 8.3（当其可用时）。

### 留下您对新 K2 编译器的反馈

我们非常感谢您的任何反馈！

* 在 Kotlin 的 Slack 中直接向 K2 开发者提供反馈 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
  并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
* 在[我们的问题跟踪器](https://kotl.in/issue)上报告您在使用新 K2 编译器时遇到的任何问题。
* [启用 **发送使用情况统计信息** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)
  以允许 JetBrains 收集有关 K2 使用情况的匿名数据。

## 语言

在 Kotlin 1.9.0 中，我们正在使一些之前引入的新语言功能变得稳定：
* [enum 类 values 函数的替代](#stable-replacement-of-the-enum-class-values-function)
* [与数据类对称的数据对象](#stable-data-objects-for-symmetry-with-data-classes)
* [支持在内联值类（inline value classes）中使用带主体的二级构造函数](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### enum 类 values 函数的稳定替代

在 1.8.20 中，enum 类的 `entries` 属性作为实验性功能引入。`entries` 属性是
合成 `values()` 函数的现代且高性能的替代方案。在 1.9.0 中，`entries` 属性已变为稳定。

> `values()` 函数仍受支持，但我们建议您改用 `entries` 属性。
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

有关 enum 类 `entries` 属性的更多信息，请参阅 [Kotlin 1.8.20 最新变化](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)。

### 稳定数据对象以保持与数据类的对称性

在 [Kotlin 1.8.20](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes) 中引入的数据对象（data object）声明现在已变为稳定。这包括为保持与数据类对称而添加的函数：`toString()`、`equals()` 和 `hashCode()`。

此功能在 `sealed` 层次结构（如 `sealed class` 或 `sealed interface` 层次结构）中特别有用，
因为 `data object` 声明可以方便地与 `data class` 声明一起使用。在此示例中，将
`EndOfFile` 声明为 `data object` 而不是普通 `object` 意味着它自动拥有 `toString()` 函数，而
无需手动重写。这保持了与伴随的数据类定义的对称性。

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

欲了解更多信息，请参阅 [Kotlin 1.8.20 最新变化](whatsnew1820.md#preview-of-data-objects-for-symmetry-with-data-classes)。

### 支持在内联值类中使用带主体的二级构造函数

从 Kotlin 1.9.0 开始，在[内联值类](inline-classes.md)中使用带主体的二级构造函数已默认可用：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // 自 Kotlin 1.4.30 起允许使用：
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // 自 Kotlin 1.9.0 起默认允许使用：
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```
{validate="false"}

以前，Kotlin 仅允许在内联类中使用公共主构造函数。因此，无法
封装底层值，或创建表示某些受限值的内联类。

随着 Kotlin 的发展，这些问题得到了修复。Kotlin 1.4.30 取消了对 `init` 块的限制，随后 Kotlin 1.8.20 
带来了带主体二级构造函数的预览。它们现在默认可用。在 [此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中详细了解 Kotlin 内联类的发展。

## Kotlin/JVM

从 1.9.0 版本开始，编译器可以生成字节码版本对应于 JVM 20 的类。此外，
继续弃用 `JvmDefault` 注解和旧版 `-Xjvm-default` 模式。

### 弃用 JvmDefault 注解和旧版 -Xjvm-default 模式

从 Kotlin 1.5 开始，`JvmDefault` 注解的使用已被弃用，取而代之的是更新的 `-Xjvm-default` 
模式：`all` 和 `all-compatibility`。随着 Kotlin 1.4 中 `JvmDefaultWithoutCompatibility` 的引入以及 
Kotlin 1.6 中 `JvmDefaultWithCompatibility` 的引入，这些模式提供了对 `DefaultImpls` 
类生成的全面控制，确保与旧 Kotlin 代码的无缝兼容性。

因此，在 Kotlin 1.9.0 中，`JvmDefault` 注解不再具有任何意义，并已被标记为弃用，使用会导致错误。它最终将从 Kotlin 中移除。

## Kotlin/Native

在其他改进中，此版本为 [Kotlin/Native 内存管理器](native-memory-manager.md)带来了进一步的进步，应该会增强其健壮性和性能：

* [自定义内存分配器预览](#preview-of-custom-memory-allocator)
* [在主线程上的 Objective-C 或 Swift 对象析构钩子](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
* [在 Kotlin/Native 中访问常量值时不再初始化对象](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [能够为 iOS 模拟器测试配置独立模式](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
* [Kotlin/Native 中的库链接](#library-linkage-in-kotlin-native)

### 自定义内存分配器预览

Kotlin 1.9.0 引入了自定义内存分配器的预览。其分配系统提高了 [Kotlin/Native 内存管理器](native-memory-manager.md)的运行时性能。

Kotlin/Native 中当前的物体分配系统使用通用分配器，不具备
高效垃圾回收的功能。为了补偿，它在垃圾回收器 (GC) 将所有已分配对象合并到
单个列表（可在清除期间迭代）之前，维护这些对象的线程本地链接列表。这种方法存在
几个性能弊端：

* 清除（sweeping）顺序缺乏内存局部性，通常导致分散的内存访问模式，从而引发潜在的性能问题。
* 链接列表为每个对象都需要额外的内存，增加了内存使用量，尤其是在处理大量小对象时。
* 已分配对象的单一列表使得并行化清除变得具有挑战性，当增量更新（mutator）线程分配对象的速度快于 GC 线程回收它们的速度时，可能会导致内存使用问题。

为了解决这些问题，Kotlin 1.9.0 引入了自定义分配器的预览。它将系统内存划分为页，
允许按连续顺序独立清除。每次分配都成为页内的一个内存块，并且页会跟踪块的大小。不同的页类型针对各种分配大小进行了优化。内存块的连续排列
确保了对所有已分配块的高效迭代。

当线程分配内存时，它会根据分配大小搜索合适的页。线程为不同的
大小类别维护一组页。通常，给定大小的当前页可以容纳该分配。如果不能，
线程将从共享分配空间请求不同的页。该页可能已经可用，需要清除，
或者应该先创建。

新的分配器允许同时拥有多个独立的分配空间，这将允许 Kotlin 团队 
试验不同的页布局，以进一步提高性能。

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

#### 提供反馈

我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native) 
中提供的反馈，以改进自定义分配器。

### 在主线程上的 Objective-C 或 Swift 对象析构钩子

从 Kotlin 1.9.0 开始，如果 Objective-C 或 Swift 对象在主线程传递给 Kotlin，其析构钩子（deallocation hook）也会在该线程调用。以前 [Kotlin/Native 内存管理器](native-memory-manager.md)处理 Objective-C 对象引用的方式可能导致内存泄漏。我们相信新的行为应该会提高内存管理器的健壮性。

考虑在 Kotlin 代码中引用的 Objective-C 对象，例如，作为实参传递、由
函数返回或从集合中检索。在这种情况下，Kotlin 会创建自己的对象，持有对 
Objective-C 对象的引用。当 Kotlin 对象被析构时，Kotlin/Native 运行时会调用 `objc_release` 
函数来释放该 Objective-C 引用。

以前，Kotlin/Native 内存管理器在特殊的 GC 线程上运行 `objc_release`。如果它是最后一个对象引用，
该对象将被析构。当 Objective-C 对象具有自定义析构钩子（如 Objective-C 中的 `dealloc` 
方法或 Swift 中的 `deinit` 块）且这些钩子期望在特定线程上调用时，可能会出现问题。

由于主线程上对象的钩子通常期望在那里被调用，Kotlin/Native 运行时现在 
也会在主线程上调用 `objc_release`。它应该涵盖 Objective-C 对象在主线程上传递给 
Kotlin，并在那里创建 Kotlin 对等对象的情况。这仅在主调度队列（main dispatch queue）被处理时才有效，常规 UI 应用程序就是这种情况。当不是主队列或对象是在主线程以外的线程上传递给 
Kotlin 时，`objc_release` 仍会像以前一样在特殊的 GC 线程上调用。

#### 如何退出

如果您遇到问题，可以在 `gradle.properties` 文件中使用以下选项禁用此行为：

```none
kotlin.native.binary.objcDisposeOnMain=false
```

如有此类情况，请随时报告给[我们的问题跟踪器](https://kotl.in/issue)。

### 在 Kotlin/Native 中访问常量值时不再初始化对象

从 Kotlin 1.9.0 开始，Kotlin/Native 后端在访问 `const val` 字段时不再初始化对象：

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // 起初没有初始化
    val x = MyObject    // 发生初始化
    println(x.y)
}
```
{validate="false"}

该行为现在已与 Kotlin/JVM 统一，那里的实现与 Java 一致，在这种情况下从不 
初始化对象。由于这一变化，您也可以期待 Kotlin/Native 项目中的一些性能改进。

### 能够为 iOS 模拟器测试配置独立模式

默认情况下，为 Kotlin/Native 运行 iOS 模拟器测试时，会使用 `--standalone` 标志，以避免手动启动和关闭模拟器。在 1.9.0 中，您现在可以通过 `standalone` 属性在 Gradle 任务中配置是否使用此标志。默认情况下，使用 `--standalone` 标志，因此启用了独立模式。

以下是如何在 `build.gradle.kts` 文件中禁用独立模式的示例：

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```
{validate="false"}

> 如果禁用独立模式，则必须手动启动模拟器。要从命令行（CLI）启动模拟器，可以使用以下命令：
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
>```
>
{style="warning"}

### Kotlin/Native 中的库链接

从 Kotlin 1.9.0 开始，Kotlin/Native 编译器处理 Kotlin 库中的链接问题的方式与 Kotlin/JVM 相同。
如果一个第三方 Kotlin 库的作者对另一个第三方 Kotlin 库所使用的实验性 API 进行了不兼容的更改，您可能会面临此类问题。

现在，如果第三方 Kotlin 库之间存在链接问题，构建不会在编译期间失败。相反，您只会在运行时遇到这些错误，这与 JVM 上完全一致。

Kotlin/Native 编译器在检测到库链接问题时会报告警告。您可以在编译日志中找到此类警告，例如：

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

您可以进一步配置甚至在项目中禁用此行为：

* 如果您不想在编译日志中看到这些警告，请使用 `-Xpartial-linkage-loglevel=INFO` 编译器选项来抑制它们。
* 也可以通过 `-Xpartial-linkage-loglevel=ERROR` 将报告警告的严重级别提高到编译错误。在这种情况下，编译会失败，您将在编译日志中看到所有错误。使用此选项可以更密切地检查链接问题。
* 如果您在使用此功能时遇到意外问题，始终可以通过 `-Xpartial-linkage=disable` 编译器选项退出。如有此类情况，请随时报告给[我们的问题跟踪器](https://kotl.in/issue)。

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

                // 完全禁用该功能：
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```
{validate="false"}

### C 互操作隐式整数转换的编译器选项

我们引入了一个 C 互操作编译器选项，允许您使用隐式整数转换。经过
仔细考虑，我们引入了此编译器选项以防止意外使用，因为此功能仍有改进空间，我们的目标是提供最高质量的 API。

在此代码示例中，隐式整数转换允许 `options = 0`，即使 [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options)
具有无符号类型 `UInt` 且 `0` 是有符号的。

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

要对原生互操作库使用隐式转换，请使用 `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion` 编译器选项。

您可以在 Gradle `build.gradle.kts` 文件中进行配置：
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```
{validate="false"}

## Kotlin Multiplatform

Kotlin Multiplatform 在 1.9.0 中获得了一些旨在改善开发者体验的显著更新：

* [Android 目标支持的变化](#changes-to-android-target-support)
* [默认启用新的 Android 源集布局](#new-android-source-set-layout-enabled-by-default)
* [多平台项目中 Gradle 配置缓存的预览](#preview-of-the-gradle-configuration-cache)

### Android 目标支持的变化

我们继续努力稳定 Kotlin Multiplatform。关键的一步是为 Android 目标提供一流的 
支持。我们很高兴地宣布，在未来，Google 的 Android 团队将提供 
其自己的 Gradle 插件，以在 Kotlin Multiplatform 中支持 Android。

为了给来自 Google 的新方案扫清障碍，我们将在 1.9.0 中重命名当前 Kotlin DSL 中的 `android` 块。
请在您的构建脚本中将所有出现的 `android` 块更改为 `androidTarget`。这是一个临时 
更改，为了给 Google 即将推出的 DSL 腾出 `android` 名称，这一更改是必要的。

Google 插件将是在多平台项目中处理 Android 的首选方式。当它准备就绪时，我们将 
提供必要的迁移说明，以便您可以像以前一样使用简短的 `android` 名称。

### 默认启用新的 Android 源集布局

从 Kotlin 1.9.0 开始，新的 Android 源集布局成为默认。它取代了之前的目录命名架构，后者在多方面令人困惑。新布局具有多项优势：

* 简化类型语义 – 新的 Android 源布局提供了清晰一致的命名约定，有助于区分不同类型的源集。
* 改进的源目录布局 – 在新布局下，`SourceDirectories` 安排变得更加连贯，使组织代码和查找源文件变得更加容易。
* 清晰的 Gradle 配置命名架构 – 架构在 `KotlinSourceSets` 和 `AndroidSourceSets` 中现在更加一致且可预测。

新布局需要 Android Gradle 插件 7.0 或更高版本，并受 Android Studio 2022.3 及更高版本支持。请参阅我们的
[迁移指南](https://kotlinlang.org/docs/multiplatform/multiplatform-android-layout.html) 以在您的 `build.gradle(.kts)` 文件中进行必要的更改。

### Gradle 配置缓存预览

<p id="preview-of-gradle-configuration-cache">Kotlin 1.9.0 支持在多平台库中使用 <a href="https://docs.gradle.org/current/userguide/configuration_cache.html">Gradle 配置缓存</a>。如果您是库作者，现在就可以从改进的构建性能中获益。</p>

Gradle 配置缓存通过为后续构建重用配置阶段的结果来加快构建过程。该功能自 Gradle 8.1 起已变为稳定。要启用它，请按照 [Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)中的说明进行操作。

> Kotlin Multiplatform 插件仍然不支持在 Xcode 集成任务或 [Kotlin CocoaPods Gradle 插件](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html)中使用 Gradle 配置缓存。我们希望在未来的 Kotlin 版本中添加此功能。
>
{style="note"}

## Kotlin/Wasm

Kotlin 团队继续试验新的 Kotlin/Wasm 目标。此版本引入了多项性能及 
[与大小相关的优化](#size-related-optimizations)，以及 [JavaScript 互操作的更新](#updates-in-javascript-interop)。

### 与大小相关的优化

Kotlin 1.9.0 为 WebAssembly (Wasm) 项目引入了显著的大小改进。对比两个 "Hello World" 项目，Kotlin 1.9.0 中 Wasm 的代码占用空间现在比 Kotlin 1.8.20 小 10 倍以上。

![Kotlin/Wasm size-related optimizations](wasm-1-9-0-size-improvements.png){width=700}

这些大小优化导致在通过 Kotlin 代码针对 Wasm 平台时更高效的资源利用 and 更好的性能。

### JavaScript 互操作的更新

此次 Kotlin 更新引入了 Kotlin/Wasm 的 Kotlin 与 JavaScript 之间互操作性的变化。由于 Kotlin/Wasm 
是一个[实验性](components-stability.md#stability-levels-explained)功能，其互操作性受到某些限制。

#### 限制 Dynamic 类型

从 1.9.0 版本开始，Kotlin 不再支持在 Kotlin/Wasm 中使用 `Dynamic` 类型。现在已弃用，
取而代之的是新的通用 `JsAny` 类型，它有助于 JavaScript 互操作。

有关更多详细信息，请参阅 [Kotlin/Wasm 与 JavaScript 的互操作性](wasm-js-interop.md)文档。

#### 限制非外部类型

在与 JavaScript 互相传递值时，Kotlin/Wasm 支持特定 Kotlin 静态类型的转换。这些支持的 
类型包括：

* 基本类型，如带符号数字、`Boolean` 和 `Char`。
* `String`。
* 函数类型。

其他类型作为不透明引用在没有转换的情况下传递，导致 JavaScript 和 Kotlin 
子类型之间不一致。

为了解决这个问题，Kotlin 将 JavaScript 互操作限制在一组得到良好支持的类型中。从 Kotlin 1.9.0 开始，Kotlin/Wasm JavaScript 互操作仅支持外部、基本、字符串和函数类型。此外，引入了一个名为 
`JsReference` 的独立显式类型，用于表示可在 JavaScript 互操作中使用的 Kotlin/Wasm 对象句柄。

有关更多详细信息，请参阅 [Kotlin/Wasm 与 JavaScript 的互操作性](wasm-js-interop.md)文档。

### Kotlin Playground 中的 Kotlin/Wasm

Kotlin Playground 支持 Kotlin/Wasm 目标。
您可以编写、运行和分享针对 Kotlin/Wasm 的 Kotlin 代码。[去看看吧！](https://pl.kotl.in/HDFAvimga)

> 使用 Kotlin/Wasm 需要在浏览器中启用实验性功能。
>
> [详细了解如何启用这些功能](wasm-configuration.md)。
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

此版本引入了 Kotlin/JS 的更新，包括移除旧的 Kotlin/JS 编译器、弃用 Kotlin/JS Gradle 插件以及对 ES2015 的实验性 
支持：

* [移除旧的 Kotlin/JS 编译器](#removal-of-the-old-kotlin-js-compiler)
* [弃用 Kotlin/JS Gradle 插件](#deprecation-of-the-kotlin-js-gradle-plugin)
* [弃用外部枚举](#deprecation-of-external-enum)
* [对 ES2015 类和模块的实验性支持](#experimental-support-for-es2015-classes-and-modules)
* [更改了 JS 生产分发的默认目标目录](#changed-default-destination-of-js-production-distribution)
* [从 stdlib-js 中提取 org.w3c 声明](#extract-org-w3c-declarations-from-stdlib-js)

> 从 1.9.0 版本开始，[部分库链接](#library-linkage-in-kotlin-native)也为 Kotlin/JS 启用。
>
{style="note"}

### 移除旧的 Kotlin/JS 编译器

在 Kotlin 1.8.0 中，我们[宣布](whatsnew18.md#stable-js-ir-compiler-backend)基于 IR 的后端已变为[稳定](components-stability.md)。
从那时起，不指定编译器已成为错误，使用旧编译器会导致警告。

在 Kotlin 1.9.0 中，使用旧后端会导致错误。请迁移到 IR 编译器。

### 弃用 Kotlin/JS Gradle 插件

从 Kotlin 1.9.0 开始，`kotlin-js` Gradle 插件被 
弃用。我们鼓励您改用带有 `js()` 目标的 `kotlin-multiplatform` Gradle 插件。

Kotlin/JS Gradle 插件的功能基本上重复了 `kotlin-multiplatform` 插件，并且底层共享 
相同的实现。这种重叠造成了困惑，并增加了 Kotlin 团队的维护负担。

请参阅我们的 [Kotlin Multiplatform 兼容性指南](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin) 以获取迁移说明。如果您发现指南中未涵盖的任何问题，请将其报告到我们的[问题跟踪器](http://kotl.in/issue)。

### 弃用外部枚举

在 Kotlin 1.9.0 中，由于像 `entries` 这样无法存在于 Kotlin 之外的静态枚举成员问题，外部枚举的使用将被弃用。我们建议改用带有对象子类的外部密封类：

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

通过切换到带有对象子类的外部密封类，您可以实现与外部枚举类似的功能，
同时避免与默认方法相关的问题。

从 Kotlin 1.9.0 开始，外部枚举的使用将被标记为弃用。我们鼓励您更新代码 
以利用建议的外部密封类实现，从而保证兼容性和未来的维护。

### 对 ES2015 类和模块的实验性支持

此版本引入了对 ES2015 模块和 ES2015 类生成的[实验性](components-stability.md#stability-levels-explained)支持：
* 模块提供了一种简化代码库并提高可维护性的方法。
* 类允许您合并面向对象编程 (OOP) 原则，从而使代码更简洁、更直观。

要启用这些功能，请相应地更新您的 `build.gradle.kts` 文件：

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

[在官方文档中了解有关 ES2015（ECMAScript 2015, ES6）的更多信息](https://262.ecma-international.org/6.0/)。

### 更改了 JS 生产分发的默认目标目录

在 Kotlin 1.9.0 之前，分发目标目录为 `build/distributions`。然而，这是 Gradle 存档文件的通用 
目录。为了解决此问题，我们在 Kotlin 1.9.0 中将默认分发目标目录更改为：
`build/dist/<targetName>/<binaryName>`。

例如，`productionExecutable` 之前在 `build/distributions` 中。在 Kotlin 1.9.0 中，它位于 `build/dist/js/productionExecutable`。

> 如果您的流水线使用了这些构建结果，请务必更新目录路径。
>
{style="warning"}

### 从 stdlib-js 中提取 org.w3c 声明

自 Kotlin 1.9.0 起，`stdlib-js` 不再包含 `org.w3c` 声明。相反，这些声明已 
移至单独的 Gradle 依赖项。当您将 Kotlin Multiplatform Gradle 插件添加到 `build.gradle.kts` 文件时，
这些声明将自动包含在您的项目中，类似于标准库。

不需要任何手动操作或迁移。必要的调整将自动处理。

## Gradle

Kotlin 1.9.0 带来了新的 Gradle 编译器选项以及更多内容：

* [移除了 classpath 属性](#removed-classpath-property)
* [新的 Gradle 编译器选项](#new-compiler-options)
* [Kotlin/JVM 的项目级编译器选项](#project-level-compiler-options-for-kotlin-jvm)
* [Kotlin/Native 模块名称的编译器选项](#compiler-option-for-kotlin-native-module-name)
* [官方 Kotlin 库的独立编译器插件](#separate-compiler-plugins-for-official-kotlin-libraries)
* [提高最低支持版本](#incremented-minimum-supported-version)
* [kapt 不再导致 Gradle 任务被过早创建](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
* [JVM 目标验证模式的编程式配置](#programmatic-configuration-of-the-jvm-target-validation-mode)

### 移除了 classpath 属性

在 Kotlin 1.7.0 中，我们宣布开始弃用 `KotlinCompile` 任务的属性：`classpath`。
弃用级别在 Kotlin 1.8.0 中提高到 `ERROR`。在此版本中，我们终于移除了 `classpath` 属性。 
现在，所有编译任务都应使用 `libraries` 输入来获取编译所需的库列表。

### 新的编译器选项

Kotlin Gradle 插件现在为选择性加入和编译器的渐进模式提供了新属性。

* 要选择使用新 API，您现在可以使用 `optIn` 属性并传递字符串列表，如：`optIn.set(listOf(a, b, c))`。
* 要启用渐进模式，请使用 `progressiveMode.set(true)`。

### Kotlin/JVM 的项目级编译器选项

从 Kotlin 1.9.0 开始，在 `kotlin` 配置块内部提供了一个新的 `compilerOptions` 块：

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```
{validate="false"}

它使配置编译器选项变得更加容易。但是，需要注意一些重要细节：

* 此配置仅在项目级别工作。
* 对于 Android 插件，此块配置的对象与以下内容相同：

```kotlin
android {
    kotlinOptions {}
}
```
{validate="false"}

* `android.kotlinOptions` 和 `kotlin.compilerOptions` 配置块会相互覆盖。构建文件中最后一个（最下方）的块始终生效。
* 如果在项目级别配置了 `moduleName`，其值在传递给编译器时可能会被更改。对于 `main` 编译不是这样，但对于其他类型（例如测试源），Kotlin Gradle 插件将添加 `_test` 后缀。
* `tasks.withType<KotlinJvmCompile>().configureEach {}`（或 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`）内部的配置会覆盖 `kotlin.compilerOptions` 和 `android.kotlinOptions`。

### Kotlin/Native 模块名称的编译器选项

Kotlin/Native [`module-name`](compiler-reference.md#module-name-name-native) 编译器选项现在可以在 Kotlin Gradle 插件中轻松使用。

此选项指定编译模块的名称，也可用于为导出到 Objective-C 的声明添加名称前缀。

您现在直接在 Gradle 构建文件的 `compilerOptions` 块中设置模块名称：

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

Kotlin 1.9.0 为其官方库引入了独立的编译器插件。以前，编译器插件嵌入在 
它们对应的 Gradle 插件中。如果编译器插件是针对比 Gradle 构建的 Kotlin 运行时版本更高的 
Kotlin 版本编译的，这可能会导致兼容性问题。

现在编译器插件作为单独的依赖项添加，因此您不再会面临旧版本 Gradle 
的兼容性问题。新方法的另一个主要优势是新的编译器插件可以与其他构建系统（如 
Bazel）一起使用。

以下是我们现在发布到 Maven Central 的新编译器插件列表：

* kotlin-atomicfu-compiler-plugin
* kotlin-allopen-compiler-plugin
* kotlin-lombok-compiler-plugin
* kotlin-noarg-compiler-plugin
* kotlin-sam-with-receiver-compiler-plugin
* kotlinx-serialization-compiler-plugin

每个插件都有其 `-embeddable` 对应版本，例如，`kotlin-allopen-compiler-plugin-embeddable` 专为 
配合 `kotlin-compiler-embeddable` 构件工作而设计，这是脚本构件的默认选项。

Gradle 将这些插件作为编译器参数添加。您无需对现有项目进行任何更改。

### 提高最低支持版本

从 Kotlin 1.9.0 开始，最低支持的 Android Gradle 插件版本为 4.2.2。

请参阅[我们的文档中 Kotlin Gradle 插件与可用 Gradle 版本的兼容性](gradle-configure-project.md#apply-the-plugin)。

### kapt 不再导致 Gradle 任务被过早创建

在 1.9.0 之前，[kapt 编译器插件](kapt.md)通过请求 Kotlin 编译任务的配置实例来导致任务被过早创建。此行为已在 Kotlin 1.9.0 中修复。如果您在 `build.gradle.kts` 文件中使用了默认配置，那么您的设置不受此更改的影响。

> 如果您使用了自定义配置，您的设置将受到不利影响。
> 例如，如果您使用 Gradle 的 tasks API 修改了 `KotlinJvmCompile` 任务，则必须在构建脚本中类似地修改 `KaptGenerateStubs` 任务。
>
> 例如，如果您的脚本对 `KotlinJvmCompile` 任务有以下配置：
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // 您的自定义配置 }
> ```
> {validate="false"}
>
> 在这种情况下，您需要确保相同的修改作为 `KaptGenerateStubs` 任务的一部分包含在内：
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // 您的自定义配置 }
>```
> {validate="false"}
> 
{style="warning"}

更多信息请参见我们的 [YouTrack 票据](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation)。

### JVM 目标验证模式的编程式配置

在 Kotlin 1.9.0 之前，只有一种方法可以调整 Kotlin 和 Java 之间 JVM 目标不兼容性的检测。
您必须在整个项目的 `gradle.properties` 中设置 `kotlin.jvm.target.validation.mode=ERROR`。

您现在也可以在 `build.gradle.kts` 文件中的任务级别进行配置：

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```
{validate="false"}

## 标准库

Kotlin 1.9.0 对标准库进行了一些重大改进：
* [`..<` 运算符](#stable-operator-for-open-ended-ranges) 和 [时间 API](#stable-time-api) 已变为稳定。
* [Kotlin/Native 标准库经过了彻底的审查和更新](#the-kotlin-native-standard-library-s-journey-towards-stabilization)
* [`@Volatile` 注解可用于更多平台](#stable-volatile-annotation)
* [新增了一个**通用**函数，可按名称获取正则捕获组](#new-common-function-to-get-regex-capture-group-by-name)
* [引入了 `HexFormat` 类，用于格式化和解析十六进制数](#new-hexformat-class-to-format-and-parse-hexadecimals)

### 用于开区间的稳定 ..< 运算符

在 [Kotlin 1.7.20](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges) 中引入并在 1.8.0 中稳定的新 `..<` 运算符，用于创建开区间。在 1.9.0 中，用于处理开区间的标准库 API 也已变为稳定。

我们的研究表明，新的 `..<` 运算符使得在声明开区间时更容易理解。如果您 
使用 [`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html) 中缀函数，很容易
错误地假设上限包含在内。

这是一个使用 `until` 函数的示例：

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

而这是一个使用新 `..<` 运算符的示例：

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

> 从 IntelliJ IDEA 2023.1.1 版本开始，提供了一个新的代码检查功能，它可以高亮显示何时 
> 可以使用 `..<` 运算符。
>
{style="note"}

有关可以使用此运算符执行的操作的更多信息，请参阅 [Kotlin 1.7.20 最新变化](whatsnew1720.md#preview-of-the-operator-for-creating-open-ended-ranges)。

### 稳定时间 API

自 1.3.50 起，我们提供了新的时间测量 API 预览。API 的时长部分在 1.6.0 中已变为稳定。在 1.9.0 中，
剩余的时间测量 API 已变为稳定。

旧的时间 API 提供了 `measureTimeMillis` 和 `measureNanoTime` 函数，它们使用起来并不直观。虽然 
清楚它们都以不同的单位测量时间，但不清楚 `measureTimeMillis` 使用的是挂钟时间来测量时间，而 `measureNanoTime` 使用的是单调时间源。新的时间 API 解决了这些及其他问题，使 API 更加用户友好。

使用新的时间 API，您可以轻松地：
* 使用单调时间源和您需要的时间单位来测量执行某些代码所需的时间。
* 标记时间点。
* 比较并找出两个时间点之间的差异。
* 检查自特定时间点以来已经过去了多少时间。
* 检查当前时间是否已超过特定时间点。

#### 测量代码执行时间

要测量执行一段代码块所需的时间，请使用 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 
内联函数。

要测量执行一段代码块所需的时间 **并** 返回代码块的结果，请使用 
[`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 内联函数。

默认情况下，这两个函数都使用单调时间源。但是，如果您想使用经过的实时时间源，也可以。
例如，在 Android 上，默认时间源 `System.nanoTime()` 
仅在设备处于活动状态时计算时间。当设备进入深度睡眠时，它会失去对时间的跟踪。为了在设备处于深度睡眠时也能跟踪时间，您可以创建一个使用 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos()) 
的时间源：

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```
{validate="false"}

#### 标记和测量时间差异

要标记特定的时间点，请使用 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/) 
接口和 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 函数 
来创建一个 [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)。要测量来自同一时间源的 `TimeMarks` 之间的差异，请使用减法运算符 (`-`)：

```kotlin
import kotlin.time.*

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 休眠 0.5 秒。
    val mark2 = timeSource.markNow()

    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        println("测量 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // 也可以互相比较时间标记。
    println(mark2 > mark1) // 结果为 true，因为 mark2 是在 mark1 之后捕获的。
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-elapsed"}

要检查截止时间是否已过或是否已达到超时，请使用 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html) 
和 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 
扩展函数：

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    val fiveSeconds: Duration = 5.seconds
    val mark2 = mark1 + fiveSeconds

    // 还没到 5 秒
    println(mark2.hasPassedNow())
    // false

    // 等待 6 秒
    Thread.sleep(6000)
    println(mark2.hasPassedNow())
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-passednow"}

### Kotlin/Native 标准库迈向稳定

随着我们用于 Kotlin/Native 的标准库不断壮大，我们认为现在是对其进行完整审查以确保 
其符合我们高标准的时候了。作为其中的一部分，我们仔细审查了 **每一个** 现有的公共签名。对于每个 
签名，我们考虑了它是否：

* 具有独特的目的。
* 与其他 Kotlin API 一致。
* 与其在 JVM 上的对应项具有类似的行为。
* 面向未来。

基于这些考虑，我们做出了以下决定之一：
* 使其变为稳定。
* 使其变为实验性。
* 将其标记为 `private`。
* 修改其行为。
* 将其移动到其他位置。
* 弃用它。
* 将其标记为已过时。

> 如果一个现有的签名已被：
> * 移动到另一个软件包，则该签名在原始软件包中仍然存在，但现在已被弃用，弃用级别为：`WARNING`。IntelliJ IDEA 将在代码检查时自动建议替换。
> * 弃用，则其弃用级别为：`WARNING`。
> * 标记为已过时，则您可以继续使用它，但它在未来将被替换。
>
{style="note"}

我们不会在此列出审查的所有结果，但以下是一些亮点：
* 我们稳定了 Atomics API。
* 我们将 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) 设为实验性，现在需要不同的选择性加入才能使用该软件包。更多信息请参见 [明确的 C 互操作性稳定性保证](#explicit-c-interoperability-stability-guarantees)。
* 我们将 [`Worker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker/) 类及其相关 API 标记为已过时。
* 我们将 [`BitSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-bit-set/) 类标记为已过时。
* 我们将 `kotlin.native.internal` 软件包中的所有 `public` API 标记为 `private` 或将其移动到其他软件包中。

#### 明确的 C 互操作性稳定性保证

为了保持 API 的高质量，我们决定将 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) 
设为实验性。尽管 `kotlinx.cinterop` 已经过彻底的试用和测试，但在 
我们足够满意地使其稳定之前，仍有改进空间。我们建议您将此 API 用于互操作性，但尽量 
将其使用限制在项目中的特定区域。一旦我们开始演进此 API 
以使其稳定，这将使您的迁移更加容易。

如果您想使用类 C 的外部 API（如指针），则必须通过 `@OptIn(ExperimentalForeignApi)` 选择性加入，否则 
您的代码将无法编译。

要使用 `kotlinx.cinterop` 的其余部分（涵盖 Objective-C/Swift 互操作性），必须通过 
`@OptIn(BetaInteropApi)` 选择性加入。如果您在没有选择性加入的情况下尝试使用此 API，您的代码将可以编译，但编译器会 
发出警告，明确解释您可以预期的行为。

有关这些注解的更多信息，请参阅我们 [`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt) 的源代码。

有关此次审查涉及的 **所有** 更改的更多信息，请参阅我们的 [YouTrack 票据](https://youtrack.jetbrains.com/issue/KT-55765)。

我们非常感谢您的任何反馈！您可以直接通过在[票据](https://youtrack.jetbrains.com/issue/KT-57728)上发表评论来提供反馈。

### 稳定 @Volatile 注解

如果您使用 `@Volatile` 注解一个 `var` 属性，那么支持字段将被标记，以便对该 
字段的任何读取或写入都是原子的，并且写入始终对其他线程可见。

在 1.8.20 之前，[`kotlin.jvm.Volatile` 注解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/) 
在通用标准库中可用。但是，此注解仅在 JVM 上有效。如果您在 
其他平台上使用它，它会被忽略，从而导致错误。

在 1.8.20 中，我们引入了一个实验性通用注解 `kotlin.concurrent.Volatile`，您可以在 JVM 和 Kotlin/Native 中预览它。

在 1.9.0 中，`kotlin.concurrent.Volatile` 已变为稳定。如果您在多平台项目中使用 `kotlin.jvm.Volatile`，我们 
建议您迁移到 `kotlin.concurrent.Volatile`。

### 按名称获取正则捕获组的新通用函数

在 1.9.0 之前，每个平台都有自己的扩展，可以从正则表达式匹配中按名称获取正则表达式捕获组。但是没有通用的函数。在 Kotlin 1.8.0 之前不可能有通用函数， 
因为标准库仍然支持 JVM 目标 1.6 和 1.7。

从 Kotlin 1.8.0 开始，标准库使用 JVM 目标 1.8 编译。因此在 1.9.0 中，现在有一个**通用**的 
[`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html) 函数，您可以 
使用它来按名称检索正则表达式匹配的组内容。当您想要访问 
属于特定捕获组的正则表达式匹配结果时，这非常有用。

这里有一个包含三个捕获组的正则表达式示例：`city`、`state` 和 `areaCode`。您 
可以使用这些组名来访问匹配的值：

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

### 用于创建父目录的新路径实用程序

在 1.9.0 中新增了一个 `createParentDirectories()` 扩展函数，您可以使用它来创建一个带有所有 
必要父目录的新文件。当您向 `createParentDirectories()` 提供文件路径时，它会检查父 
目录是否已存在。如果已存在，它什么也不做。但是，如果不存在，它会为您创建它们。

`createParentDirectories()` 在复制文件时特别有用。例如，您可以将其与 
`copyToRecursively()` 函数结合使用：

 ```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
 ```
{validate="false"}

### 用于格式化和解析十六进制数的新 HexFormat 类

> 新的 `HexFormat` 类及其相关的扩展函数是实验性的， 
> 要使用它们，您可以通过 `@OptIn(ExperimentalStdlibApi::class)` 或编译器参数 
> `-opt-in=kotlin.ExperimentalStdlibApi` 选择性加入。
>
{style="warning"}

在 1.9.0 中，[`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 类及其相关的 
扩展函数作为一项实验性功能提供，允许您在数值和 
十六进制字符串之间进行转换。具体来说，您可以使用扩展函数在十六进制字符串与 
`ByteArrays` 或其他数值类型（`Int`、`Short`、`Long`）之间进行转换。

例如：

```kotlin
println(93.toHexString()) // "0000005d"
```
{validate="false"}

`HexFormat` 类包含格式设置选项，您可以使用 `HexFormat{}` 构建器进行配置。

如果您正在处理 `ByteArrays`，您有以下选项，可通过属性进行配置：

| 选项 | 描述 |
|--|--|
| `upperCase` | 十六进制数字是大写还是小写。默认假定为小写。`upperCase = false`。 |
| `bytes.bytesPerLine` | 每行的最大字节数。 |
| `bytes.bytesPerGroup` | 每组的最大字节数。 |
| `bytes.bytesSeparator` | 字节之间的分隔符。默认没有。 |
| `bytes.bytesPrefix` | 每个字节的两位十六进制表示形式之前的字符串，默认没有。 |
| `bytes.bytesSuffix` | 每个字节的两位十六进制表示形式之后的字符串，默认没有。 |

例如：

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// 使用 HexFormat{} 构建器通过冒号分隔十六进制字符串
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// "00:1b:63:84:45:e6"

// 使用 HexFormat{} 构建器来：
// * 将十六进制字符串设为大写
// * 将字节成对分组
// * 使用句点分隔
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// "001B.6384.45E6"
```
{validate="false"}

如果您正在处理数值类型，您有以下选项，可通过属性进行配置：

| 选项 | 描述 |
|--|--|
| `number.prefix` | 十六进制字符串的前缀，默认没有。 |
| `number.suffix` | 十六进制字符串的后缀，默认没有。 |
| `number.removeLeadingZeros` | 是否移除十六进制字符串中的前导零。默认不移除。`number.removeLeadingZeros = false` |

例如：

```kotlin
// 使用 HexFormat{} 构建器解析带有前缀 "0x" 的十六进制数。
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // "58"
```
{validate="false"}

## 文档更新

Kotlin 文档发生了一些显著变化：
* [Kotlin 之旅](kotlin-tour-welcome.md) – 通过包含理论和实践的章节学习 Kotlin 编程语言的基础知识。
* [Android 源集布局](https://kotlinlang.org/docs/multiplatform/multiplatform-android-layout.html) – 了解新的 Android 源集布局。
* [Kotlin Multiplatform 兼容性指南](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html) – 了解在开发 Kotlin Multiplatform 项目时可能遇到的不兼容变更。
* [Kotlin Wasm](wasm-overview.md) – 了解 Kotlin/Wasm 以及如何在您的 Kotlin Multiplatform 项目中使用它。

## 安装 Kotlin 1.9.0

### 检查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3 和 2023.1.1 会自动建议将 Kotlin 
插件更新到 1.9.0 版本。IntelliJ IDEA 2023.2 将包含 Kotlin 1.9.0 插件。

Android Studio Giraffe (223) 和 Hedgehog (231) 将在即将发布的版本中支持 Kotlin 1.9.0。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0)上下载。

### 配置 Gradle 设置

要下载 Kotlin 构件和依赖项，请更新您的 `settings.gradle(.kts)` 文件以使用 Maven Central 仓库：

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

## Kotlin 1.9.0 兼容性指南

Kotlin 1.9.0 是一个特性版本，因此可能会 
带来与您为早期语言版本编写的代码不兼容的更改。请在 [Kotlin 1.9.0 兼容性指南](compatibility-guide-19.md)中找到这些更改的详细列表。