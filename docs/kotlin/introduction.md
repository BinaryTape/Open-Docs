[//]: # (title: 编写你的第一个 Lincheck 测试)

本教程演示如何编写你的第一个 Lincheck 测试、设置 Lincheck 框架并使用其基本 API。你将创建一个包含错误并发计数器实现的 IntelliJ IDEA 项目，并为其编写测试，随后查找并分析该 bug。

## 创建项目

在 IntelliJ IDEA 中打开现有 Kotlin 项目或[创建一个新项目](https://kotlinlang.org/docs/jvm-get-started.html)。创建项目时，请使用 Gradle 构建系统。

## 添加所需的依赖项

1. 打开 `build.gradle(.kts)` 文件并确保已将 `mavenCentral()` 添加到仓库列表中。
2. 将以下依赖项添加到 Gradle 配置中：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheck 依赖项
       testImplementation("org.jetbrains.lincheck:lincheck:%lincheckVersion%")
       // 此依赖项允许你使用 kotlin.test 和 JUnit：
       testImplementation("junit:junit:4.13")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   repositories {
       mavenCentral()
   }
   
   dependencies {
       // Lincheck 依赖项
       testImplementation "org.jetbrains.lincheck:lincheck:%lincheckVersion%"
       // 此依赖项允许你使用 kotlin.test 和 JUnit：
       testImplementation "junit:junit:4.13"
   }
   ```
   </tab>
   </tabs>

## 编写并发计数器并运行测试

1. 在 `src/test/kotlin` 目录中，创建一个 `BasicCounterTest.kt` 文件，并添加以下代码，其中包含一个有 bug 的并发计数器及其 Lincheck 测试：

   ```kotlin
   import org.jetbrains.lincheck.*
   import org.jetbrains.lincheck.datastructures.*
   import org.junit.*

   class Counter {
       @Volatile
       private var value = 0

       fun inc(): Int = ++value
       fun get() = value
   }

   class BasicCounterTest {
       private val c = Counter() // 初始状态
   
       // Counter 上的操作
       @Operation
       fun inc() = c.inc()
   
       @Operation
       fun get() = c.get()
   
       @Test // JUnit
       fun stressTest() = StressOptions().check(this::class) // 魔力按钮
   }
   ```

   此 Lincheck 测试会自动： 
   * 使用指定的 `inc()` 和 `get()` 操作生成多个随机并发场景。
   * 为每个生成的场景执行大量调用。
   * 验证每次调用结果是否正确。

2. 运行上述测试，你将看到以下错误：

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   ```

   在这里，Lincheck 发现了一个违反计数器原子性的执行——两个并发增量以相同的结果 `1` 结束。这意味着丢失了一次增量，计数器的行为是不正确的。

## 跟踪无效执行

除了显示无效的执行结果外，Lincheck 还可以提供导致错误的交织。此功能可通过 [模型检查 (model checking)](testing-strategies.md#model-checking) 测试策略访问，该策略会检查受限上下文切换次数下的众多执行。

1. 要切换测试策略，请将 `options` 类型从 `StressOptions()` 替换为 `ModelCheckingOptions()`。更新后的 `BasicCounterTest` 类如下所示：

   ```kotlin
   import org.jetbrains.lincheck.*
   import org.jetbrains.lincheck.datastructures.*
   import org.junit.*
   
   class Counter {
       @Volatile
       private var value = 0

       fun inc(): Int = ++value
       fun get() = value
   }

   class BasicCounterTest {
       private val c = Counter()
   
       @Operation
       fun inc() = c.inc()
   
       @Operation
       fun get() = c.get()
   
       @Test
       fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
   }
   ```

2. 再次运行测试。你将获得导致错误结果的执行跟踪：

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   
   The following interleaving leads to the error:
   | --------------------------------------------------------------------- |
   | Thread 1 |                          Thread  2                         |
   | --------------------------------------------------------------------- |
   |          | inc()                                                      |
   |          |   inc(): 1 at BasicCounterTest.inc(BasicCounterTest.kt:18) |
   |          |     value.READ: 0 at Counter.inc(BasicCounterTest.kt:10)   |
   |          |     switch                                                 |
   | inc(): 1 |                                                            |
   |          |     value.WRITE(1) at Counter.inc(BasicCounterTest.kt:10)  |
   |          |     value.READ: 1 at Counter.inc(BasicCounterTest.kt:10)   |
   |          |   result: 1                                                |
   | --------------------------------------------------------------------- |
   ```

   根据跟踪，发生了以下事件：

   * **T2**：第二个线程开始 `inc()` 操作，读取当前计数器值（`value.READ: 0`）并暂停。
   * **T1**：第一个线程执行 `inc()`，返回 `1` 并结束。
   * **T2**：第二个线程恢复并增加先前获得的计数器值，错误地将计数器更新为 `1`。

> [获取完整代码](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/BasicCounterTest.kt)。
>
{style="note"}

## 测试 Java 标准库

现在让我们在标准 Java 的 `ConcurrentLinkedDeque` 类中寻找一个 bug。下面的 Lincheck 测试发现了一个在双端队列头部删除和添加元素之间的竞态：

```kotlin
import java.util.concurrent.*
import org.jetbrains.lincheck.*
import org.jetbrains.lincheck.datastructures.*
import org.junit.*

class ConcurrentDequeTest {
    private val deque = ConcurrentLinkedDeque<Int>()

    @Operation
    fun addFirst(e: Int) = deque.addFirst(e)

    @Operation
    fun addLast(e: Int) = deque.addLast(e)

    @Operation
    fun pollFirst() = deque.pollFirst()

    @Operation
    fun pollLast() = deque.pollLast()

    @Operation
    fun peekFirst() = deque.peekFirst()

    @Operation
    fun peekLast() = deque.peekLast()

    @Test
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

运行 `modelCheckingTest()`。测试将失败并显示以下输出：

```text
= Invalid execution results =
| ---------------------------------------- |
|      Thread 1     |       Thread 2       |
| ---------------------------------------- |
| addLast(22): void |                      |
| ---------------------------------------- |
| pollFirst(): 22   | addFirst(8): void    |
|                   | peekLast(): 22 [-,1] |
| ---------------------------------------- |

---
水平线 | ----- | 以上的所有操作都发生在横线以下的操作之前
---
"[..]" 方括号中的值表示在当前操作开始时，每个并行线程中已完成操作的数量
---

The following interleaving leads to the error:
| --------------------------------------------------------------------------------------------------------------------------------- |
|                                                Thread 1                                                    |       Thread 2       |
| --------------------------------------------------------------------------------------------------------------------------------- |
| pollFirst()                                                                                                |                      |
|   pollFirst(): 22 at ConcurrentDequeTest.pollFirst(ConcurrentDequeTest.kt:17)                              |                      |
|     first(): Node@1 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:915)                     |                      |
|     item.READ: null at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:917)                     |                      |
|     next.READ: Node@2 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:925)                   |                      |
|     item.READ: 22 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:917)                       |                      |
|     prev.READ: null at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:919)                     |                      |
|     switch                                                                                                 |                      |
|                                                                                                            | addFirst(8): void    |
|                                                                                                            | peekLast(): 22       |
|     compareAndSet(Node@2,22,null): true at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:920) |                      |
|     unlink(Node@2) at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:921)                      |                      |
|   result: 22                                                                                               |                      |
| --------------------------------------------------------------------------------------------------------------------------------- |
```

> [获取完整代码](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test-lincheck-integration/org/jetbrains/lincheck_test/guide/ConcurrentLinkedDequeTest.kt)。
>
{style="note"}

## 下一步

选择[你的测试策略并配置测试执行](testing-strategies.md)。

## 另请参阅

* [如何生成操作实参](operation-arguments.md)
* [常见的算法约束](constraints.md)
* [检查非阻塞进度保证](progress-guarantees.md)
* [定义算法的顺序规范](sequential-specification.md)