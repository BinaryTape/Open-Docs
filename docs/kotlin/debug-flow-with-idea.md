<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 使用 IntelliJ IDEA 调试 Kotlin Flow – 教程)

本教程演示了如何创建 Kotlin Flow 并使用 IntelliJ IDEA 进行调试。

本教程假定你已对 [协程](coroutines-guide.md) 和 [Kotlin Flow](flow.md#flows) 概念有所了解。

## 创建 Kotlin Flow

创建一个具有慢速发射器和慢速收集器的 Kotlin [Flow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow.html)：

1. 在 IntelliJ IDEA 中打开一个 Kotlin 项目。如果你没有项目，可以[创建一个](jvm-get-started.md#create-a-project)。
2. 要在 Gradle 项目中使用 `kotlinx.coroutines` 库，请将以下依赖项添加到 `build.gradle(.kts)`：
   
   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
   }
   ``` 
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
   }
   ```
   
   </tab>
   </tabs>
   
   对于其他构建系统，请参阅 [`kotlinx.coroutines` README](https://github.com/Kotlin/kotlinx.coroutines#using-in-your-projects) 中的说明。

3. 打开 `src/main/kotlin` 目录中的 `Main.kt` 文件。

    `src` 目录包含 Kotlin 源文件和资源。`Main.kt` 文件包含将打印 `Hello World!` 的示例代码。

4. 创建返回一个包含三个数字的 Flow 的 `simple()` 函数：

    * 使用 [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 函数来模拟 CPU 密集型的阻塞代码。它将协程挂起 100 毫秒，而不阻塞线程。
    * 在 `for` 循环中使用 [`emit()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow-collector/emit.html) 函数生成值。

    ```kotlin
    import kotlinx.coroutines.*
    import kotlinx.coroutines.flow.*
    import kotlin.system.*
 
    fun simple(): Flow<Int> = flow {
        for (i in 1..3) {
            delay(100)
            emit(i)
        }
    }
    ```

5. 更改 `main()` 函数中的代码：

    * 使用 [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 代码块来包裹一个协程。
    * 使用 [`collect()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect.html) 函数收集发射的值。
    * 使用 [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 函数来模拟 CPU 密集型代码。它将协程挂起 300 毫秒，而不阻塞线程。
    * 使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函数打印从 Flow 收集到的值。

    ```kotlin
    fun main() = runBlocking {
        simple()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

6. 点击 **Build Project** 构建代码。

    ![Build an application](flow-build-project.png)

## 调试协程

1. 在调用 `emit()` 函数的行设置断点：

    ![Build a console application](flow-breakpoint.png)

2. 点击屏幕顶部运行配置旁边的 **Debug**，以调试模式运行代码。

    ![Build a console application](flow-debug-project.png)

    **Debug** 工具窗口出现：
    * **Frames** 标签页包含调用栈。
    * **Variables** 标签页包含当前上下文中的变量。它告诉我们 Flow 正在发射第一个值。
    * **Coroutines** 标签页包含有关正在运行或已挂起的协程的信息。

    ![Debug the coroutine](flow-debug-1.png)

3. 通过点击 **Debug** 工具窗口中的 **Resume Program** 恢复调试会话。程序在同一断点处停止。

    ![Debug the coroutine](flow-resume-debug.png)

    现在 Flow 发射第二个值。

    ![Debug the coroutine](flow-debug-2.png)

### 被优化掉的变量

如果你使用 `suspend` 函数，在调试器中，你可能会在变量名称旁边看到“was optimized out”文本：

![Variable "a" was optimized out](variable-optimised-out.png)

此文本表示变量的生命周期已缩短，且该变量不再存在。
调试带有被优化掉的变量的代码很困难，因为你无法看到它们的值。
你可以使用 `-Xdebug` 编译器选项禁用此行为。

> __切勿在生产环境中使用此标志__：`-Xdebug` 可能[导致内存泄漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

## 添加并发运行的协程

1. 打开 `src/main/kotlin` 目录中的 `Main.kt` 文件。

2. 增强代码以并发运行发射器和收集器：

    * 添加对 [`buffer()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html) 函数的调用，以并发运行发射器和收集器。`buffer()` 会存储发射的值，并在一个单独的协程中运行 Flow 收集器。
 
    ```kotlin
    fun main() = runBlocking<Unit> {
        simple()
            .buffer()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

3. 点击 **Build Project** 构建代码。

## 调试带有两个协程的 Kotlin Flow

1. 在 `println(value)` 处设置一个新断点。

2. 点击屏幕顶部运行配置旁边的 **Debug**，以调试模式运行代码。

    ![Build a console application](flow-debug-3.png)

    **Debug** 工具窗口出现。

    在 **Coroutines** 标签页中，你可以看到有两个协程正在并发运行。由于 `buffer()` 函数，Flow 收集器和发射器在单独的协程中运行。
    `buffer()` 函数会缓冲从 Flow 发射的值。
    发射器协程处于 **RUNNING**（运行中）状态，而收集器协程处于 **SUSPENDED**（已挂起）状态。

3. 通过点击 **Debug** 工具窗口中的 **Resume Program** 恢复调试会话。

    ![Debugging coroutines](flow-debug-4.png)

    现在收集器协程处于 **RUNNING**（运行中）状态，而发射器协程处于 **SUSPENDED**（已挂起）状态。

    你可以深入探查每个协程来调试你的代码。