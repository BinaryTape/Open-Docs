[//]: # (title: Kotlin/Native 内存管理)

Kotlin/Native 使用现代内存管理器，它与 JVM、Go 以及其他主流技术类似，具备以下特性：

*   对象存储在共享堆中，可从任何线程访问。
*   追踪式垃圾回收定期执行，以回收无法从“根”（如局部变量和全局变量）访问的对象。

## 垃圾回收器

Kotlin/Native 的垃圾回收器 (GC) 算法不断发展。目前，它作为 Stop-the-World 标记和并发清除回收器运行，不将堆分成代。

GC 在单独的线程上执行，并根据内存压力启发式或通过计时器启动。或者，它也可以[手动调用](#enable-garbage-collection-manually)。

GC 在多个线程上并行处理标记队列，包括应用程序线程、GC 线程和可选的标记线程。应用程序线程和至少一个 GC 线程参与标记过程。默认情况下，当 GC 标记堆中的对象时，应用程序线程必须暂停。

> 您可以使用 `kotlin.native.binary.gcMarkSingleThreaded=true` 编译器选项禁用标记阶段的并行化。
> 但是，这可能会增加大型堆上垃圾回收器的暂停时间。
>
{style="tip"}

标记阶段完成后，GC 处理弱引用并将指向未标记对象的引用置空。默认情况下，弱引用会并发处理以缩短 GC 暂停时间。

了解如何[监控](#monitor-gc-performance)和[优化](#optimize-gc-performance)垃圾回收。

### 手动启用垃圾回收

要强制启动垃圾回收器，请调用 `kotlin.native.internal.GC.collect()`。此方法会触发一次新的回收并等待其完成。

### 监控 GC 性能

要监控 GC 性能，您可以查阅其日志并诊断问题。要启用日志记录，请在您的 Gradle 构建脚本中设置以下编译器选项：

```none
-Xruntime-logs=gc=info
```

目前，日志仅打印到 `stderr`。

在 Apple 平台上，您可以利用 Xcode Instruments 工具包来调试 iOS 应用性能。垃圾回收器通过 Instruments 中可用的 signposts 报告暂停。Signposts 在应用内启用自定义日志记录，允许您检查 GC 暂停是否与应用程序冻结相对应。

要在您的应用中追踪 GC 相关暂停：

1.  要启用此功能，请在您的 `gradle.properties` 文件中设置以下编译器选项：

    ```none
    kotlin.native.binary.enableSafepointSignposts=true
    ```

2.  打开 Xcode，前往 **Product** | **Profile** 或按下 <shortcut>Cmd + I</shortcut>。此操作将编译您的应用并启动 Instruments。
3.  在模板选择中，选择 **os_signpost**。
4.  通过指定 `org.kotlinlang.native.runtime` 作为 **subsystem** 和 `safepoint` 作为 **category** 进行配置。
5.  点击红色录制按钮以运行您的应用并开始记录 signpost 事件：

    ![将 GC 暂停追踪为 signpost](native-gc-signposts.png){width=700}

    在这里，最低图表上的每个蓝色斑点都代表一个单独的 signpost 事件，即一次 GC 暂停。

### 优化 GC 性能

为了提高 GC 性能，您可以启用并发标记以缩短 GC 暂停时间。这允许垃圾回收的标记阶段与应用程序线程同时运行。

该功能目前处于 [实验性](components-stability.md#stability-levels-explained) 阶段。要启用它，请在您的 `gradle.properties` 文件中设置以下编译器选项：

```none
kotlin.native.binary.gc=cms
```

### 禁用垃圾回收

建议保持 GC 启用。但是，在某些情况下，您可以禁用它，例如用于测试目的，或者如果您遇到问题并且程序生命周期较短。要做到这一点，请在您的 `gradle.properties` 文件中设置以下二进制选项：

```none
kotlin.native.binary.gc=noop
```

> 启用此选项后，GC 不会回收 Kotlin 对象，因此只要程序运行，内存消耗将持续增长。请注意不要耗尽系统内存。
>
{style="warning"}

## 内存消耗

Kotlin/Native 使用它自己的[内存分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。它将系统内存划分为页，允许按连续顺序独立清除。每次分配都成为页内的一个内存块，并且页会跟踪块大小。不同类型的页针对各种分配大小进行了优化。内存块的连续排列确保高效迭代所有已分配的块。

当线程分配内存时，它会根据分配大小搜索合适的页。线程维护一组用于不同大小类别的页。通常，给定大小的当前页可以容纳该分配。如果不能，线程会从共享分配空间请求不同的页。此页可能已可用、需要清除或需要首先创建。

Kotlin/Native 内存分配器带有防止内存分配突然激增的保护机制。它防止了 mutator 快速分配大量垃圾而 GC 线程无法跟上，导致内存使用量无休止地增长的情况。在这种情况下，GC 会强制进入 Stop-the-World 阶段，直到迭代完成。

您可以自行监控内存消耗、检查内存泄漏并调整内存消耗。

### 检查内存泄漏

要访问内存管理器指标，请调用 `kotlin.native.internal.GC.lastGCInfo()`。此方法返回上次垃圾回收器运行的统计信息。这些统计信息可用于：

*   在使用全局变量时调试内存泄漏
*   在运行测试时检查泄漏

```kotlin
import kotlin.native.internal.*
import kotlin.test.*

class Resource

val global = mutableListOf<Resource>()

@OptIn(ExperimentalStdlibApi::class)
fun getUsage(): Long {
    GC.collect()
    return GC.lastGCInfo!!.memoryUsageAfter["heap"]!!.totalObjectsSizeBytes
}

fun run() {
    global.add(Resource())
    // The test will fail if you remove the next line
    global.clear()
}

@Test
fun test() {
    val before = getUsage()
    // A separate function is used to ensure that all temporary objects are cleared
    run()
    val after = getUsage()
    assertEquals(before, after)
}
```

### 调整内存消耗

如果程序中没有内存泄漏，但您仍然看到内存消耗出乎意料地高，请尝试将 Kotlin 更新到最新版本。我们正在不断改进内存管理器，因此即使是简单的编译器更新也可能改善内存消耗。

如果更新后仍遇到高内存消耗，请在您的 Gradle 构建脚本中使用以下编译器选项切换到系统内存分配器：

```none
-Xallocator=std
```

如果这没有改善您的内存消耗，请在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中报告问题。

## 后台单元测试

在单元测试中，主线程队列中没有任何处理，因此不要使用 `Dispatchers.Main`，除非它已被模拟。可以通过从 `kotlinx-coroutines-test` 调用 `Dispatchers.setMain` 来模拟它。

如果您不依赖 `kotlinx.coroutines` 或者 `Dispatchers.setMain` 由于某种原因不起作用，请尝试以下变通方法来实现测试启动器：

```kotlin
package testlauncher

import platform.CoreFoundation.*
import kotlin.native.concurrent.*
import kotlin.native.internal.test.*
import kotlin.system.*

fun mainBackground(args: Array<String>) {
    val worker = Worker.start(name = "main-background")
    worker.execute(TransferMode.SAFE, { args.freeze() }) {
        val result = testLauncherEntryPoint(it)
        exitProcess(result)
    }
    CFRunLoopRun()
    error("CFRunLoopRun should never return")
}
```
{initial-collapse-state="collapsed" collapsible="true"}

然后，使用 `-e testlauncher.mainBackground` 编译器选项编译测试二进制文件。

## 下一步

*   [从旧版内存管理器迁移](native-migration-guide.md)
*   [查看与 Swift/Objective-C ARC 集成的细节](native-arc-integration.md)