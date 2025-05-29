[//]: # (title: 压力测试和模型检测)

Lincheck 提供了两种测试策略：压力测试 (stress testing) 和模型检测 (model checking)。使用我们在 [上一步](introduction.md) 的 `BasicCounterTest.kt` 文件中编写的 `Counter`，了解这两种方法的工作原理：

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

按照以下步骤，为 `Counter` 创建一个并发压力测试：

1. 创建 `CounterTest` 类。
2. 在此类中，添加 `Counter` 类型的字段 `c`，并在构造函数中创建其实例。
3. 列出计数器操作并用 `@Operation` 注解标记它们，将其实现委托给 `c`。
4. 使用 `StressOptions()` 指定压力测试策略。
5. 调用 `StressOptions.check()` 函数来运行测试。

结果代码如下所示：

```kotlin
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 初始状态
    
    // 对计数器进行的操作
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // 运行测试
    fun stressTest() = StressOptions().check(this::class)
}
```

### 压力测试的工作原理 {initial-collapse-state="collapsed" collapsible="true"}

首先，Lincheck 使用 `@Operation` 标记的操作生成一组并发场景 (concurrent scenarios)。然后它启动原生线程 (native threads)，并在开始时同步它们，以确保操作同时启动。最后，Lincheck 会在这些原生线程上多次执行每个场景，期望遇到产生不正确结果的交错 (interleaving)。

下图显示了 Lincheck 如何执行生成场景的高层示意图：

![Stress execution of the Counter](counter-stress.png){width=700}

## 模型检测

关于压力测试的主要问题是，你可能需要花费数小时才能理解如何重现发现的 bug。为了帮助解决此问题，Lincheck 支持有界模型检测 (bounded model checking)，它会自动提供一个交错来重现 bug。

模型检测测试的构建方式与压力测试相同。只需将指定测试策略的 `StressOptions()` 替换为 `ModelCheckingOptions()` 即可。

### 编写模型检测测试

要将压力测试策略更改为模型检测，请在你的测试中将 `StressOptions()` 替换为 `ModelCheckingOptions()`：

```kotlin
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 初始状态

    // 对计数器进行的操作
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // 运行测试
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

### 模型检测的工作原理 {initial-collapse-state="collapsed" collapsible="true"}

复杂并发算法中的大多数 bug 可以通过经典的交错来重现，即在不同线程之间切换执行。此外，弱内存模型的模型检测器非常复杂，因此 Lincheck 在 _顺序一致性内存模型_ (sequential consistency memory model) 下使用有界模型检测。

简而言之，Lincheck 分析所有交错，从一次上下文切换 (context switch) 开始，然后是两次，持续该过程直到检查指定数量的交错。此策略允许以最少的上下文切换次数找到不正确的调度，从而使后续的 bug 调查更容易。

为了控制执行，Lincheck 会在测试代码中插入特殊的切换点 (switch points)。这些点标识了可以执行上下文切换的位置。本质上，这些是共享内存访问 (shared memory accesses)，例如 JVM 中的字段和数组元素读写，以及 `wait/notify` 和 `park/unpark` 调用。为了插入切换点，Lincheck 使用 ASM 框架即时转换测试代码，在现有代码中添加内部函数调用。

由于模型检测策略控制执行，Lincheck 可以提供导致无效交错的跟踪 (trace)，这在实践中非常有帮助。你可以在 [使用 Lincheck 编写第一个测试](introduction.md#trace-the-invalid-execution) 教程中看到 `Counter` 不正确执行的跟踪示例。

## 哪种测试策略更好？

_模型检测策略_ 更适合在顺序一致性内存模型下查找 bug，因为它能确保更好的覆盖率，并在发现错误时提供失败的执行跟踪。

尽管 _压力测试_ 不保证任何覆盖率，但对于检查由低级效应（例如遗漏的 `volatile` 修饰符）引入的 bug 仍然很有帮助。压力测试对于发现需要大量上下文切换才能重现的罕见 bug 也非常有帮助，并且由于模型检测策略当前的限制，无法分析所有这些 bug。

## 配置测试策略

要配置测试策略，请在 `<TestingMode>Options` 类中设置选项。

1. 为 `CounterTest` 设置场景生成和执行的选项：

    ```kotlin
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.check
    import org.jetbrains.kotlinx.lincheck.strategy.stress.*
    import org.junit.*
    
    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
    
        @Test
        fun stressTest() = StressOptions() // 压力测试选项：
            .actorsBefore(2) // 并行部分前的操作数量
            .threads(2) // 并行部分中的线程数量
            .actorsPerThread(2) // 并行部分中每个线程的操作数量
            .actorsAfter(1) // 并行部分后的操作数量
            .iterations(100) // 生成 100 个随机并发场景
            .invocationsPerIteration(1000) // 运行每个生成的场景 1000 次
            .check(this::class) // 运行测试
    }
    ```

2. 再次运行 `stressTest()`，Lincheck 将生成与以下类似的场景：

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

   这里，并行部分前有两个操作，每个操作有两个线程，之后最后有一个操作。

你可以以同样的方式配置模型检测测试。

## 场景最小化

你可能已经注意到，检测到的错误通常用比测试配置中指定的更小的场景表示。Lincheck 试图最小化错误，在不导致测试失败的前提下积极移除操作。

这是上面计数器测试的最小化场景：

```text
= Invalid execution results =
| ------------------- |
| Thread 1 | Thread 2 |
| ------------------- |
| inc()    | inc()    |
| ------------------- |
```

由于分析较小的场景更容易，因此默认启用场景最小化。要禁用此功能，请将 `minimizeFailedScenario(false)` 添加到 `[Stress, ModelChecking]Options` 配置中。

## 记录数据结构状态

另一个有用的调试功能是 _状态记录_ (state logging)。当分析导致错误的交错时，你通常会在纸上绘制数据结构的变化，并在每个事件后更改状态。为了自动化此过程，你可以提供一个特殊方法，该方法返回数据结构的 `String` 表示，以便 Lincheck 在修改数据结构的交错中，在每个事件后打印状态表示。

为此，请定义一个不带参数且用 `@StateRepresentation` 注解标记的方法。该方法应该是线程安全的、非阻塞的，并且永不修改数据结构。

1. 在 `Counter` 示例中，`String` 表示只是计数器的值。因此，要在跟踪中打印计数器状态，请将 `stateRepresentation()` 函数添加到 `CounterTest` 中：

    ```kotlin
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.check
    import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
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

2. 现在运行 `modelCheckingTest()` 并检查在修改计数器状态的切换点打印的 `Counter` 状态（它们以 `STATE:` 开头）：

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

在压力测试的情况下，Lincheck 会在场景的并行部分之前和之后以及结束时打印状态表示。

> * 获取 [这些示例的完整代码](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/CounterTest.kt)
> * 查看更多 [测试示例](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide)
>
{style="note"}

## 下一步

了解如何 [配置传递给操作的参数](operation-arguments.md) 以及何时这会有用。