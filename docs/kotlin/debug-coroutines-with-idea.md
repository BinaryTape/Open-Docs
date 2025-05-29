<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 使用 IntelliJ IDEA 调试协程 – 教程)

本教程演示如何创建 Kotlin 协程并使用 IntelliJ IDEA 调试它们。

本教程假定您已了解[协程](coroutines-guide.md)概念。

## 创建协程

1. 在 IntelliJ IDEA 中打开一个 Kotlin 项目。如果您没有项目，请[创建一个](jvm-get-started.md#create-a-project)。
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
   
3. 打开 `src/main/kotlin` 中的 `Main.kt` 文件。

    `src` 目录包含 Kotlin 源文件和资源。`Main.kt` 文件包含将打印 `Hello World!` 的示例代码。

4. 更改 `main()` 函数中的代码：

    * 使用 [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 块来包裹协程。
    * 使用 [`async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 函数创建计算延迟值 `a` 和 `b` 的协程。
    * 使用 [`await()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html) 函数等待计算结果。
    * 使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函数将计算状态和乘法结果打印到输出。

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

5. 点击 **Build Project** (构建项目) 来构建代码。

    ![Build an application](flow-build-project.png)

## 调试协程

1. 在包含 `println()` 函数调用的行设置断点：

    ![Build a console application](coroutine-breakpoint.png)

2. 点击屏幕顶部的运行配置旁边的 **Debug** (调试) 按钮，以调试模式运行代码。

    ![Build a console application](flow-debug-project.png)

    **Debug** (调试) 工具窗口出现：
    * Tab 页 **Frames** (帧) 包含调用堆栈。
    * Tab 页 **Variables** (变量) 包含当前上下文中的变量。
    * Tab 页 **Coroutines** (协程) 包含有关运行中或已挂起的协程的信息。它显示有三个协程。
    第一个协程处于 **RUNNING** (运行中) 状态，其他两个处于 **CREATED** (已创建) 状态。

    ![Debug the coroutine](coroutine-debug-1.png)

3. 点击 **Debug** (调试) 工具窗口中的 **Resume Program** (恢复程序) 来恢复调试会话：

    ![Debug the coroutine](coroutine-debug-2.png)
    
    现在 **Coroutines** (协程) tab 页显示如下：
    * 第一个协程处于 **SUSPENDED** (已挂起) 状态 – 它正在等待值以便可以进行乘法运算。
    * 第二个协程正在计算 `a` 值 – 它处于 **RUNNING** (运行中) 状态。
    * 第三个协程处于 **CREATED** (已创建) 状态，并且未计算 `b` 的值。

4. 点击 **Debug** (调试) 工具窗口中的 **Resume Program** (恢复程序) 来恢复调试会话：

    ![Build a console application](coroutine-debug-3.png)

    现在 **Coroutines** (协程) tab 页显示如下：
    * 第一个协程处于 **SUSPENDED** (已挂起) 状态 – 它正在等待值以便可以进行乘法运算。
    * 第二个协程已计算出其值并消失了。
    * 第三个协程正在计算 `b` 的值 – 它处于 **RUNNING** (运行中) 状态。

使用 IntelliJ IDEA 调试器，您可以深入探究每个协程来调试您的代码。

### 优化掉的变量

如果您使用 `suspend` 函数，在调试器中，您可能会在变量名旁边看到“was optimized out” (已优化出) 文本：

![Variable "a" was optimized out](variable-optimised-out.png){width=480}

此文本表示变量的生命周期已缩短，并且该变量不再存在。
由于您看不到变量的值，因此调试包含优化变量的代码很困难。
您可以使用 `-Xdebug` 编译器选项禁用此行为。

> __切勿在生产环境中使用此标志__: `-Xdebug` 可能[导致内存泄漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}