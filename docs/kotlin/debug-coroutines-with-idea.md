<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 使用 IntelliJ IDEA 调试协程 – 教程)

本教程演示了如何创建 Kotlin 协程并使用 IntelliJ IDEA 调试它们。

本教程假定你已对[协程](coroutines-guide.md)概念有预备知识。

## 创建协程

1.  在 IntelliJ IDEA 中打开一个 Kotlin 项目。如果你没有项目，请[创建一个](jvm-get-started.md#create-a-project)。
2.  要在 Gradle 项目中使用 `kotlinx.coroutines` 库，请将以下依赖项添加到 `build.gradle(.kts)` 中：

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
   
3.  打开 `src/main/kotlin` 目录中的 `Main.kt` 文件。

    `src` 目录包含 Kotlin 源文件和资源。`Main.kt` 文件包含将打印 `Hello World!` 的示例代码。

4.  更改 `main()` 函数中的代码：

    *   使用 [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 代码块来包裹一个协程。
    *   使用 [`async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 函数创建计算延迟值 `a` 和 `b` 的协程。
    *   使用 [`await()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html) 函数等待计算结果。
    *   使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函数向输出打印计算状态和乘法结果。

    ```kotlin
    import kotlinx.coroutines.*
    
    fun main() = runBlocking<Unit> {
        val a = async {
            println("I'm computing part of the answer")
            6
        }
        val b = async {
            println("I'm computing another part of the answer")
            7
        }
        println("The answer is ${a.await() * b.await()}")
    }
    ```

5.  通过点击 **构建项目** 来构建代码。

    ![构建应用程序](flow-build-project.png)

## 调试协程

1.  在 `println()` 函数调用的行上设置断点：

    ![构建控制台应用程序](coroutine-breakpoint.png)

2.  通过点击屏幕顶部运行配置旁边的 **调试** 来在调试模式下运行代码。

    ![构建控制台应用程序](flow-debug-project.png)

    **调试** 工具窗口出现：
    *   **帧** 选项卡包含调用栈。
    *   **变量** 选项卡包含当前上下文中的变量。
    *   **协程** 选项卡包含运行中或挂起中的协程的信息。它显示有三个协程。
    第一个协程处于 **RUNNING** (运行中) 状态，另外两个处于 **CREATED** (已创建) 状态。

    ![调试协程](coroutine-debug-1.png)

3.  通过点击 **调试** 工具窗口中的 **恢复程序** 来恢复调试器会话：

    ![调试协程](coroutine-debug-2.png)
    
    现在 **协程** 选项卡显示以下内容：
    *   第一个协程处于 **SUSPENDED** (挂起) 状态 – 它正在等待这些值以便它可以将它们相乘。
    *   第二个协程正在计算 `a` 值 – 它处于 **RUNNING** (运行中) 状态。
    *   第三个协程处于 **CREATED** (已创建) 状态，并且没有计算 `b` 值。

4.  通过点击 **调试** 工具窗口中的 **恢复程序** 来恢复调试器会话：

    ![构建控制台应用程序](coroutine-debug-3.png)

    现在 **协程** 选项卡显示以下内容：
    *   第一个协程处于 **SUSPENDED** (挂起) 状态 – 它正在等待这些值以便它可以将它们相乘。
    *   第二个协程已经计算出其值并消失了。
    *   第三个协程正在计算 `b` 值 – 它处于 **RUNNING** (运行中) 状态。

使用 IntelliJ IDEA 调试器，你可以深入探查每个协程以调试你的代码。

### 被优化掉的变量

如果你使用 `suspend` 函数，在调试器中，你可能会在变量名旁边看到“was optimized out”文本：

![变量 "a" 被优化掉](variable-optimised-out.png){width=480}

此文本意味着变量的生命周期被缩短，并且该变量不再存在了。
调试含有被优化掉的变量的代码是困难的，因为你无法看到它们的值。
你可以通过 `-Xdebug` 编译器选项禁用此行为。

> __切勿在生产环境中使用此标志__：`-Xdebug` [可能导致内存泄漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}