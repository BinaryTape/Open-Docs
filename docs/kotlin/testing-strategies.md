[//]: # (title: 压力测试与模型检测)

Lincheck 提供了两种测试策略：压力测试和模型检测。使用我们在 [上一步](introduction.md) 中 `BasicCounterTest.kt` 文件里编写的 `Counter`，了解这两种方法的幕后原理：

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

按照以下步骤为 `Counter` 创建一个并发压力测试：

1.  创建 `CounterTest` 类。
2.  在该类中，添加 `Counter` 类型的字段 `c`，并在构造函数中创建其实例。
3.  列出计数器操作，并用 `@Operation` 注解标记它们，将其实现委托给 `c`。
4.  使用 `StressOptions()` 指定压力测试策略。
5.  调用 `StressOptions.check()` 函数运行测试。

最终代码如下所示：

```kotlin
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class CounterTest {
    private val c = Counter() // Initial state
    
    // Operations on the Counter
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // Run the test
    fun stressTest() = StressOptions().check(this::class)
}
```

### 压力测试的工作原理 {initial-collapse-state="collapsed" collapsible="true"}

首先，Lincheck 使用标有 `@Operation` 的操作生成一组并发场景。然后，它启动原生线程，并在开始时同步它们，以确保操作同时开始。最后，Lincheck 在这些原生线程上多次执行每个场景，期望命中一个产生错误结果的交错。

下图展示了 Lincheck 如何执行所生成场景的高层方案：

![Stress execution of the Counter](counter-stress.png){width=700}

## 模型检测

关于压力测试的主要顾虑是，你可能需要花费数小时来理解如何重现发现的错误。为了帮助你解决这个问题，Lincheck 支持有界模型检测，它会自动提供用于重现错误的交错。

模型检测测试的构建方式与压力测试相同。只需将指定测试策略的 `StressOptions()` 替换为 `ModelCheckingOptions()`。

### 编写模型检测测试

要将压力测试策略更改为模型检测，请在测试中将 `StressOptions()` 替换为 `ModelCheckingOptions()`：

```kotlin
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class CounterTest {
    private val c = Counter() // Initial state

    // Operations on the Counter
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // Run the test
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

### 模型检测的工作原理 {initial-collapse-state="collapsed" collapsible="true"}

复杂并发算法中的大多数错误都可以通过经典交错（即执行从一个线程切换到另一个线程）来重现。此外，弱内存模型的模型检测器非常复杂，因此 Lincheck 在 _顺序一致性内存模型_ 下使用有界模型检测。

简而言之，Lincheck 分析所有交错，从一次上下文切换开始，然后两次，继续该过程直到检查到指定数量的交错。此策略允许以最少可能的上下文切换次数查找不正确的调度，从而使后续的错误排查更简单。

为了控制执行，Lincheck 会在测试代码中插入特殊的切换点。这些点标识了可以执行上下文切换的位置。本质上，这些是共享内存访问，例如 JVM 中的字段和数组元素读取或更新，以及 `wait/notify` 和 `park/unpark` 调用。为了插入切换点，Lincheck 使用 ASM 框架动态转换测试代码，向现有代码中添加内部函数调用。

由于模型检测策略控制着执行，Lincheck 可以提供导致无效交错的跟踪，这在实践中非常有帮助。你可以在 [使用 Lincheck 编写你的第一个测试](introduction.md#trace-the-invalid-execution) 教程中看到 `Counter` 错误执行的跟踪示例。

## 哪种测试策略更好？

_模型检测策略_ 更适合在顺序一致内存模型下查找错误，因为它能确保更好的覆盖率，并且在发现错误时提供失败的执行跟踪。

尽管 _压力测试_ 不保证任何覆盖率，但它对于检测由低级效应（例如遗漏的 `volatile` 修饰符）引入的算法错误仍然有帮助。压力测试对于发现需要多次上下文切换才能重现的罕见错误也大有裨益，而且由于模型检测策略的当前限制，不可能全部分析这些错误。

## 配置测试策略

要配置测试策略，请在 `<TestingMode>Options` 类中设置选项。

1.  为 `CounterTest` 设置场景生成和执行的选项：

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
        fun stressTest() = StressOptions() // Stress testing options:
            .actorsBefore(2) // Number of operations before the parallel part
            .threads(2) // Number of threads in the parallel part
            .actorsPerThread(2) // Number of operations in each thread of the parallel part
            .actorsAfter(1) // Number of operations after the parallel part
            .iterations(100) // Generate 100 random concurrent scenarios
            .invocationsPerIteration(1000) // Run each generated scenario 1000 times
            .check(this::class) // Run the test
    }
    ```

2.  再次运行 `stressTest()`，Lincheck 将生成类似于下面的场景：

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

    这里，在并行部分之前有两个操作，有两个线程（每个线程有两个操作），之后以一个单独的操作结束。

你可以用相同的方式配置你的模型检测测试。

## 场景最小化

你可能已经注意到，检测到的错误通常用比测试配置中指定的更小的场景来表示。Lincheck 尝试最小化错误，在可能的情况下积极移除操作，以保持测试失败。

以下是上面计数器测试的最小化场景：

```text
= Invalid execution results =
| ------------------- |
| Thread 1 | Thread 2 |
| ------------------- |
| inc()    | inc()    |
| ------------------- |
```

由于分析较小的场景更容易，场景最小化默认是启用的。要禁用此特性，请向 `[Stress, ModelChecking]Options` 配置中添加 `minimizeFailedScenario(false)`。

## 记录数据结构状态

另一个有用的调试特性是 _状态记录_。在分析导致错误的交错时，你通常会在一张纸上绘制数据结构的变化，并在每个事件后改变状态。为了自动化此过程，你可以提供一个特殊方法，它返回数据结构的 `String` 表示，这样 Lincheck 就会在修改数据结构的交错中的每个事件后打印状态表示。

为此，请定义一个不接受实参且标有 `@StateRepresentation` 注解的方法。该方法应是线程安全的、非阻塞的，并且永不修改数据结构。

1.  在 `Counter` 示例中，`String` 表示就是计数器的值。因此，要在跟踪中打印计数器状态，请将 `stateRepresentation()` 函数添加到 `CounterTest`：

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

2.  现在运行 `modelCheckingTest()` 并检测在修改计数器状态的切换点打印的 `Counter` 状态（它们以 `STATE:` 开头）：

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

对于压力测试，Lincheck 会在场景的并行部分之前和之后，以及在末尾，打印状态表示。

> * 获取 [这些示例的完整代码](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/CounterTest.kt)
> * 查看更多 [测试示例](https://github.com/JetBrains/lincheck/tree/master/src/jvm/test/org/jetbrains/lincheck_test/guide)
>
{style="note"}

## 下一步

了解如何 [配置传递给操作的实参](operation-arguments.md) 以及何时有用。