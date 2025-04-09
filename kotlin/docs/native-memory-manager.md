---
title: "Kotlin/Native 内存管理"
---
Kotlin/Native 使用一种与 JVM、Go 和其他主流技术类似的现代内存管理器，包括以下特性：

* 对象存储在共享堆中，可以从任何线程访问。
* 定期执行追踪垃圾回收（Tracing garbage collection），以回收从“根”（如局部变量和全局变量）无法访问的对象。

## 垃圾回收器

Kotlin/Native 的垃圾回收器（GC）算法在不断发展。目前，它的功能是停止世界（stop-the-world）标记和并发清除（concurrent sweep）回收器，不将堆分成几代。

GC 在单独的线程上执行，并根据内存压力启发式或计时器启动。或者，可以[手动调用](#enable-garbage-collection-manually)。

GC 并行处理多个线程上的标记队列，包括应用程序线程、GC 线程和可选的标记线程。应用程序线程和至少一个 GC 线程参与标记过程。默认情况下，当 GC 在堆中标记对象时，必须暂停应用程序线程。

:::tip
您可以使用 `kotlin.native.binary.gcMarkSingleThreaded=true` 编译器选项禁用标记阶段的并行化。但是，这可能会增加大型堆上垃圾回收器的暂停时间。

:::

当标记阶段完成后，GC 处理弱引用并将引用点置为空到未标记的对象。默认情况下，弱引用是并发处理的，以减少 GC 暂停时间。

请参阅如何[监控](#monitor-gc-performance)和[优化](#optimize-gc-performance)垃圾回收。

### 手动启用垃圾回收

要强制启动垃圾回收器，请调用 `kotlin.native.internal.GC.collect()`。此方法触发新的回收并等待其完成。

### 监控 GC 性能

要监控 GC 性能，您可以查看其日志并诊断问题。要启用日志记录，请在 Gradle 构建脚本中设置以下编译器选项：

```none
-Xruntime-logs=gc=info
```

目前，日志仅打印到 `stderr`。

在 Apple 平台上，您可以利用 Xcode Instruments 工具包来调试 iOS 应用程序的性能。垃圾回收器使用 Instruments 中提供的路标（signposts）报告暂停。
路标支持在您的应用程序中进行自定义日志记录，允许您检查 GC 暂停是否与应用程序冻结相对应。

要在您的应用程序中跟踪与 GC 相关的暂停：

1. 要启用该功能，请在您的 `gradle.properties` 文件中设置以下编译器选项：
  
   ```none
   kotlin.native.binary.enableSafepointSignposts=true
   ```

2. 打开 Xcode，转到 **Product** | **Profile** 或按 <shortcut>Cmd + I</shortcut>。此操作会编译您的应用程序并启动 Instruments。
3. 在模板选择中，选择 **os_signpost**。
4. 通过指定 `org.kotlinlang.native.runtime` 作为 **subsystem** 和 `safepoint` 作为 **category** 来配置它。
5. 单击红色记录按钮以运行您的应用程序并开始记录路标事件：

   <img src="/img/native-gc-signposts.png" alt="Tracking GC pauses as signposts" width="700" style={{verticalAlign: 'middle'}}/>

   在这里，最低的图表上的每个蓝色斑点代表一个单独的路标事件，这是一个 GC 暂停。

### 优化 GC 性能

要提高 GC 性能，您可以启用并发标记以减少 GC 暂停时间。这允许垃圾回收的标记阶段与应用程序线程同时运行。

该功能目前是[实验性的](components-stability#stability-levels-explained)。要启用它，请在您的 `gradle.properties` 文件中设置以下编译器选项：
  
```none
kotlin.native.binary.gc=cms
```

### 禁用垃圾回收

建议保持启用 GC。但是，您可以在某些情况下禁用它，例如用于测试目的，或者如果您遇到问题并有一个生命周期很短的程序。为此，请在您的 `gradle.properties` 文件中设置以下二进制选项：

```none
kotlin.native.binary.gc=noop
```

:::caution
启用此选项后，GC 不会收集 Kotlin 对象，因此只要程序运行，内存消耗就会不断增加。小心不要耗尽系统内存。

:::

## 内存消耗

Kotlin/Native 使用其自己的[内存分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README)。
它将系统内存划分为页面（page），允许以连续顺序进行独立清除（sweeping）。每个分配都成为页面中的一个内存块，并且该页面会跟踪块大小。不同的页面类型针对各种分配大小进行了优化。内存块的连续排列确保了有效地迭代所有已分配的块。

当线程分配内存时，它会根据分配大小搜索合适的页面。线程维护一组用于不同大小类别的页面。通常，给定大小的当前页面可以容纳分配。如果不是，则线程从共享分配空间请求不同的页面。此页面可能已经可用，需要清除，或者必须首先创建。

Kotlin/Native 内存分配器具有防止内存分配突然激增的保护措施。它可以防止突变器（mutator）开始快速分配大量垃圾，而 GC 线程无法跟上它的速度，从而使内存使用量无休止地增长的情况。在这种情况下，GC 会强制执行停止世界阶段，直到迭代完成。

您可以自行监控内存消耗，检查内存泄漏并调整内存消耗。

### 检查内存泄漏

要访问内存管理器指标，请调用 `kotlin.native.internal.GC.lastGCInfo()`。此方法返回上次运行垃圾回收器的统计信息。这些统计信息可用于：

* 调试使用全局变量时的内存泄漏
* 检查运行测试时的泄漏

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

如果程序中没有内存泄漏，但您仍然看到意外的高内存消耗，请尝试将 Kotlin 更新到最新版本。我们一直在改进内存管理器，因此即使是简单的编译器更新也可能会改善内存消耗。

如果在更新后继续遇到高内存消耗，请通过在 Gradle 构建脚本中使用以下编译器选项来切换到系统内存分配器：

```none
-Xallocator=std
```

如果这不能改善您的内存消耗，请在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中报告问题。

## 后台的单元测试

在单元测试中，没有任何东西处理主线程队列，所以不要使用 `Dispatchers.Main`，除非它被模拟（mocked）了。可以通过从 `kotlinx-coroutines-test` 调用 `Dispatchers.setMain` 来模拟它。

如果您不依赖 `kotlinx.coroutines`，或者如果 `Dispatchers.setMain` 由于某种原因对您不起作用，请尝试以下用于实现测试启动器的变通方法：

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

然后，使用 `-e testlauncher.mainBackground` 编译器选项编译测试二进制文件。

## 接下来做什么

* [从旧版内存管理器迁移](native-migration-guide)
* [检查与 Swift/Objective-C ARC 集成的具体细节](native-arc-integration)