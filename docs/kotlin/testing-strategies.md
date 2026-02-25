[//]: # (title: 压力测试与模型检查)

Lincheck 提供两种测试策略：压力测试和模型检查。通过在[上一步](introduction.md)中编写的 `BasicCounterTest.kt` 文件里的 `Counter` 示例，了解这两种方法背后的原理：

```kotlin
class Counter {
    @Volatile
    private var value = 0

    fun inc(): Int = ++value
    fun get() = value
}
```

## 压力测试

### 编写压力测试

按照以下步骤为 `Counter` 创建并发压力测试：

1. 创建 `CounterTest` 类。
2. 在该类中，添加 `Counter` 类型的字段 `c`，并在构造函数中创建一个实例。
3. 列出计数器操作并使用 `@Operation` 注解进行标记，将它们的实现委托给 `c`。
4. 使用 `StressOptions()` 指定压力测试策略。
5. 调用 `StressOptions.check()` 函数来运行测试。

生成的代码如下所示：

```kotlin
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 初始状态
    
    // Counter 上的操作
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // 运行测试
    fun stressTest() = StressOptions().check(this::class)
}
```

### 压力测试的工作原理 {initial-collapse-state="collapsed" collapsible="true"}

首先，Lincheck 使用标记了 `@Operation` 的操作生成一组并发场景。然后，它启动原生线程，并在开始时对它们进行同步，以保证操作同时开始。最后，Lincheck 在这些原生线程上多次执行每个场景，期望命中产生错误结果的交错。

下图显示了 Lincheck 如何执行生成场景的高级方案：

![Counter 的压力执行](counter-stress.png){width=700}

## 模型检查

压力测试的主要顾虑在于，你可能会花费数小时试图理解如何复现发现的错误。为了帮助你解决这个问题，Lincheck 支持边界模型检查 (bounded model checking)，它可以自动提供用于复现错误的交错。

模型检查测试的构建方式与压力测试相同。只需将指定测试策略的 `StressOptions()` 替换为 `ModelCheckingOptions()` 即可。

### 编写模型检查测试

要将压力测试策略更改为模型检查，请在测试中将 `StressOptions()` 替换为 `ModelCheckingOptions()`：

```kotlin
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 初始状态

    // Counter 上的操作
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // 运行测试
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

### 模型检查的工作原理 {initial-collapse-state="collapsed" collapsible="true"}

复杂并发算法中的大多数错误都可以通过经典的交错（将执行从一个线程切换到另一个线程）来复现。此外，弱内存模型的模型检查器非常复杂，因此 Lincheck 在 *顺序一致性内存模型* 下使用边界模型检查。

简而言之，Lincheck 会分析所有交错，从一个上下文切换开始，然后是两个，持续该过程直到检查了指定数量的交错。这种策略允许以尽可能少的上下文切换次数找到不正确的调度，从而使进一步的错误调查变得更加容易。

为了控制执行，Lincheck 在测试代码中插入了特殊的切换点。这些点标识了可以执行上下文切换的位置。从本质上讲，这些是共享内存访问，例如 JVM 中的字段和数组元素读取或更新，以及 `wait`/`notify` 和 `park`/`unpark` 调用。为了插入切换点，Lincheck 使用 ASM 框架动态地转换测试代码，在现有代码中添加内部函数调用。

由于模型检查策略可以控制执行，Lincheck 可以提供导致无效交错的跟踪，这在实践中非常有用。你可以在[使用 Lincheck 编写你的第一个测试](introduction.md#trace-the-invalid-execution)教程中看到 `Counter` 错误执行的跟踪示例。

## 哪种测试策略更好？

对于在顺序一致性内存模型下查找错误，*模型检查策略* 更为理想，因为它能确保更好的覆盖率，并在发现错误时提供失败执行的跟踪。

虽然 *压力测试* 不保证任何覆盖率，但检查由底层效应（例如遗漏 `volatile` 修饰符）引入的算法错误仍然很有帮助。压力测试对于发现那些需要多次上下文切换才能复现的罕见错误也有很大帮助，而由于当前模型检查策略的限制，分析所有这些错误是不可能的。

## 配置测试策略

要配置测试策略，请在 `<TestingMode>Options` 类中设置选项。

1. 为 `CounterTest` 设置场景生成和执行的选项：

    ```kotlin
    import org.jetbrains.lincheck.*
    import org.jetbrains.lincheck.datastructures.*
    import org.junit.*
    
    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
    
        @Test
        fun stressTest() = StressOptions() // 压力测试选项：
            .actorsBefore(2) // 并行部分之前的操作数量
            .threads(2) // 并行部分中的线程数量
            .actorsPerThread(2) // 并行部分每个线程中的操作数量
            .actorsAfter(1) // 并行部分之后的操作数量
            .iterations(100) // 生成 100 个随机并发场景
            .invocationsPerIteration(1000) // 每个生成的场景运行 1000 次
            .check(this::class) // 运行测试
    }
    ```

2. 再次运行 `stressTest()`，Lincheck 将生成类似于下方的场景：

   ```text 
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc()    |          |
   | inc()    |          |
   | ------------------- |
   | get()    | inc()    |
   | inc()    | get()    |
   | ------------------- |
   | inc()    |          |
   | ------------------- |
   ```

   这里，在并行部分之前有两个操作，两个线程各有两个操作，最后跟着一个操作。

你可以按同样的方式配置模型检查测试。

## 场景最小化

你可能已经注意到，检测到的错误通常用比测试配置中指定的更小的场景来表示。Lincheck 会尝试最小化错误，在保持测试失败的情况下主动移除操作。

以下是上述计数器测试的最小化场景：

```text
= Invalid execution results =
| ------------------- |
| Thread 1 | Thread 2 |
| ------------------- |
| inc()    | inc()    |
| ------------------- |
```

由于分析较小的场景更容易，场景最小化默认是启用的。要禁用此功能，请在 `[Stress, ModelChecking]Options` 配置中添加 `minimizeFailedScenario(false)`。

## 记录数据结构状态

另一个对调试非常有用的功能是 *状态日志记录*。在分析导致错误的交错时，你通常会在纸上画出数据结构的变化，在每个事件后更改状态。为了使这一过程自动化，你可以提供一个返回数据结构 `String` 表示的特殊方法，这样 Lincheck 就会在交错中修改数据结构的每个事件后打印状态表示。

为此，定义一个不带参数并使用 `@StateRepresentation` 注解标记的方法。该方法应该是线程安全的、非阻塞的，并且永远不要修改数据结构。

1. 在 `Counter` 示例中，`String` 表示仅仅是计数器的值。因此，要在跟踪中打印计数器状态，请将 `stateRepresentation()` 函数添加到 `CounterTest`：

    ```kotlin
    import org.jetbrains.lincheck.*
    import org.jetbrains.lincheck.datastructures.*
    import org.junit.Test

    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
        
        @StateRepresentation
        fun stateRepresentation() = c.get().toString()
        
        @Test
        fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
    }
    ```

2. 现在运行 `modelCheckingTest()` 并检查在修改计数器状态的切换点处打印的 `Counter` 状态（它们以 `STATE:` 开头）：

    ```text
    = Invalid execution results =
    | ------------------- |
    | Thread 1 | Thread 2 |
    | ------------------- |
    | STATE: 0            |
    | ------------------- |
    | inc(): 1 | inc(): 1 |
    | ------------------- |
    | STATE: 1            |
    | ------------------- |
    
    The following interleaving leads to the error:
    | -------------------------------------------------------------------- |
    | Thread 1 |                         Thread 2                          |
    | -------------------------------------------------------------------- |
    |          | inc()                                                     |
    |          |   inc(): 1 at CounterTest.inc(CounterTest.kt:10)          |
    |          |     value.READ: 0 at Counter.inc(BasicCounterTest.kt:10)  |
    |          |     switch                                                |
    | inc(): 1 |                                                           |
    | STATE: 1 |                                                           |
    |          |     value.WRITE(1) at Counter.inc(BasicCounterTest.kt:10) |
    |          |     STATE: 1                                              |
    |          |     value.READ: 1 at Counter.inc(BasicCounterTest.kt:10)  |
    |          |   result: 1                                               |
    | -------------------------------------------------------------------- |
    ```

在压力测试的情况下，Lincheck 会在场景并行部分的前后以及结束时打印状态表示。

> * 获取这些[示例的完整代码](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/CounterTest.kt)
> * 查看更多[测试示例](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/lincheck_test/guide)
>
{style="note"}

## 下一步

了解如何[配置传递给操作的实参](operation-arguments.md)以及它在何时会有所帮助。