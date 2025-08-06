[//]: # (title: Kotlin/Native 内存管理)

Kotlin/Native 使用现代内存管理器，类似于 JVM、Go 和其他主流技术，并包含以下特性：

*   对象存储在共享堆中，可以从任何线程访问。
*   定期执行追踪式垃圾回收，以回收那些从“根”不可达的对象，例如局部变量和全局变量。

## 垃圾回收器

Kotlin/Native 的垃圾回收器 (GC) 算法正在不断演进。目前，它作为 Stop-the-world 标记-并发清除收集器运行，不将堆分离为分代。

GC 在单独的线程上执行，并根据内存压力启发式或通过计时器启动。或者，它也可以[手动调用](#enable-garbage-collection-manually)。

GC 在多个线程中并行处理标记队列，包括应用程序线程、GC 线程和可选的标记线程。应用程序线程和至少一个 GC 线程参与标记过程。默认情况下，当 GC 标记堆中的对象时，应用程序线程必须暂停。

> 你可以使用 `kotlin.native.binary.gcMarkSingleThreaded=true` 编译器选项禁用标记阶段的并行化。
> 然而，这可能会增加大型堆上的垃圾回收器暂停时间。
>
{style="tip"}

标记阶段完成后，GC 处理弱引用并置空指向未标记对象的引用点。默认情况下，弱引用并发处理，以减少 GC 暂停时间。

关于如何[监控](#monitor-gc-performance)和[优化](#optimize-gc-performance)垃圾回收，请参见相关内容。

### 手动启用垃圾回收

要强制启动垃圾回收器，请调用 `kotlin.native.internal.GC.collect()`。此方法会触发一次新的回收并等待其完成。

### 监控 GC 性能

要监控 GC 性能，你可以查看其日志并诊断问题。要启用日志记录，请在你的 Gradle 构建脚本中设置以下编译器选项：

```none
-Xruntime-logs=gc=info
```

目前，日志仅打印到 `stderr`。

在 Apple 平台上，你可以利用 Xcode Instruments 工具包来调试 iOS 应用性能。垃圾回收器会通过 Instruments 中可用的标示来报告暂停。标示可以在你的应用内启用自定义日志记录，让你检查 GC 暂停是否与应用程序冻结相对应。

要在你的应用中跟踪 GC 相关暂停：

1.  要启用此特性，请在你的 `gradle.properties` 文件中设置以下编译器选项：
    
    ```none
    kotlin.native.binary.enableSafepointSignposts=true
    ```

2.  打开 Xcode，前往 **Product** | **Profile** 或按下 <shortcut>Cmd + I</shortcut>。此操作将编译你的应用并启动 Instruments。
3.  在模板选择中，选择 **os_signpost**。
4.  通过指定 `org.kotlinlang.native.runtime` 作为**子系统**和 `safepoint` 作为**类别**来配置它。
5.  点击红色录制按钮以运行你的应用并开始录制标示事件：

    ![将 GC 暂停作为标示进行跟踪](native-gc-signposts.png){width=700}

    在这里，最低图表上的每个蓝色斑点都代表一个单独的标示事件，即一次 GC 暂停。

### 优化 GC 性能

为了改进 GC 性能，你可以启用并发标记以减少 GC 暂停时间。这允许垃圾回收的标记阶段与应用程序线程同时运行。

此特性目前为[实验性的](components-stability.md#stability-levels-explained)。要启用它，请在你的 `gradle.properties` 文件中设置以下编译器选项：
  
```none
kotlin.native.binary.gc=cms
```

### 禁用垃圾回收

建议保持 GC 启用状态。然而，在某些情况下，例如出于测试目的或如果你遇到问题且程序生命周期较短，你可以禁用它。为此，请在你的 `gradle.properties` 文件中设置以下二进制选项：

```none
kotlin.native.binary.gc=noop
```

> 启用此选项后，GC 不会回收 Kotlin 对象，因此只要程序运行，内存消耗就会持续增长。请注意不要耗尽系统内存。
>
{style="warning"}

## 内存消耗

Kotlin/Native 使用它自己的[内存分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)。它将系统内存划分为页，允许以连续顺序独立清除。每次分配都成为页内的一个内存块，并且页会跟踪块大小。不同页类型针对各种分配大小进行了优化。内存块的连续排列确保高效地迭代所有已分配块。

当线程分配内存时，它会根据分配大小搜索合适的页。线程维护一组用于不同大小类别的页。通常，给定大小的当前页可以容纳分配。如果不能，线程会从共享分配空间请求不同的页。此页可能已经可用、需要清除或必须首先创建。

Kotlin/Native 内存分配器具有防止内存分配突然激增的保护。它防止出现变异器开始快速分配大量垃圾而 GC 线程无法跟上，导致内存使用量无休止地增长的情况。在这种情况下，GC 会强制进入 Stop-the-world 阶段，直到迭代完成。

你可以自行监控内存消耗，检查内存泄漏，并调整内存消耗。

### 监控内存消耗

要调试内存问题，你可以检查内存管理器指标。此外，还可以在 Apple 平台跟踪 Kotlin 的内存消耗。

#### 检查内存泄漏

要访问内存管理器指标，请调用 `kotlin.native.internal.GC.lastGCInfo()`。此方法返回垃圾回收器上次运行的统计信息。这些统计信息可用于：

*   调试使用全局变量时的内存泄漏
*   运行测试时检查泄漏

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
    // 如果你移除下一行，测试将失败
    global.clear()
}

@Test
fun test() {
    val before = getUsage()
    // 使用单独的函数是为了确保所有临时对象都被清除
    run()
    val after = getUsage()
    assertEquals(before, after)
}
```

#### 在 Apple 平台跟踪内存消耗

在 Apple 平台上调试内存问题时，你可以查看 Kotlin 代码保留了多少内存。Kotlin 的份额使用标识符进行标记，并可以通过 Xcode Instruments 中的 VM Tracker 等工具进行跟踪。

此特性仅适用于默认的 Kotlin/Native 内存分配器，且 _所有_ 以下条件均满足时：

*   **标记已启用**。内存应使用有效的标识符进行标记。Apple 建议使用 240 到 255 之间的数字；默认值为 246。

    如果你设置了 `kotlin.native.binary.mmapTag=0` Gradle 属性，则标记被禁用。

*   **使用 mmap 进行分配**。分配器应使用 `mmap` 系统调用将文件映射到内存中。

    如果你设置了 `kotlin.native.binary.disableMmap=true` Gradle 属性，则默认分配器使用 `malloc` 而不是 `mmap`。

*   **分页已启用**。应启用分配的分页（缓冲）。

    如果你设置了 [`kotlin.native.binary.pagedAllocator=false`](#disable-allocator-paging) Gradle 属性，则内存改为按对象进行保留。

### 调整内存消耗

如果你遇到意外的高内存消耗，请尝试以下解决方案：

#### 更新 Kotlin

将 Kotlin 更新到最新版本。我们正在不断改进内存管理器，因此即使是简单的编译器更新也可能改进内存消耗。

#### 禁用分配器分页
<primary-label ref="experimental-opt-in"/>

你可以禁用分配的分页（缓冲），以便内存分配器按对象保留内存。在某些情况下，这可能有助于你满足严格的内存限制或减少应用程序启动时的内存消耗。

为此，请在你的 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.pagedAllocator=false
```

> 禁用分配器分页后，[在 Apple 平台跟踪内存消耗](#track-memory-consumption-on-apple-platforms)将不可能。
> 
{style="note"}

#### 启用 Latin-1 字符串支持
<primary-label ref="experimental-opt-in"/>

默认情况下，Kotlin 中的字符串使用 UTF-16 编码存储，其中每个字符由两个字节表示。在某些情况下，这会导致字符串在二进制文件中占用的空间是源代码的两倍，并且读取数据占用两倍的内存。

为了减小应用程序的二进制大小并调整内存消耗，你可以启用 Latin-1 编码字符串的支持。[Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 编码仅用一个字节表示前 256 个 Unicode 字符。

要启用它，请在你的 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.latin1Strings=true
```

启用 Latin-1 支持后，只要所有字符都在其范围内，字符串就会以 Latin-1 编码存储。否则，将使用默认的 UTF-16 编码。

> 尽管此特性是实验性的，但 cinterop 扩展函数 [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html)、
> [`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 和
> [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 的效率会降低。
> 每次调用它们都可能触发自动字符串转换为 UTF-16。
> 
{style="note"}

如果这些选项都没有帮助，请在 [YouTrack](https://kotl.in/issue) 中创建一个问题。

## 后台的单元测试

在单元测试中，没有任何东西处理主线程队列，因此不要使用 `Dispatchers.Main`，除非它被模拟了。可以通过调用 `kotlinx-coroutines-test` 中的 `Dispatchers.setMain` 来模拟它。

如果你不依赖 `kotlinx.coroutines` 或者 `Dispatchers.setMain` 由于某种原因对你不起作用，请尝试以下变通方法来实现测试启动器：

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

*   [从传统内存管理器迁移](native-migration-guide.md)
*   [检查与 Swift/Objective-C ARC 集成的具体细节](native-arc-integration.md)