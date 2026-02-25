<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 使用 IntelliJ IDEA 调试协程 – 教程)

本教程演示如何创建 Kotlin 协程并使用 IntelliJ IDEA 对其进行调试。

本教程假设您已预先了解[协程](coroutines-guide.md)的概念。

## 创建协程

1. 在 IntelliJ IDEA 中打开一个 Kotlin 项目。如果您还没有项目，请[创建一个](jvm-get-started.md#create-a-project)。
2. 要在 Gradle 项目中使用 `kotlinx.coroutines` 库，请将以下依赖项添加到 `build.gradle(.kts)` 中：

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

    `src` 目录包含 Kotlin 源代码文件和资源。`Main.kt` 文件包含将打印 `Hello World!` 的示例代码。

4. 更改 `main()` 函数中的代码：

    * 使用 [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 代码块来包装协程。
    * 使用 [`async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 函数创建协程以计算延迟值 `a` 和 `b`。
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

5. 点击 **Build Project** (构建项目) 构建代码。

    ![构建应用程序](flow-build-project.png)

## 调试协程

1. 在包含 `println()` 函数调用的行设置断点：

    ![构建控制台应用程序](coroutine-breakpoint.png)

2. 点击屏幕顶部运行配置旁的 **Debug** (调试)，以调试模式运行代码。

    ![构建控制台应用程序](flow-debug-project.png)

    **Debug** 工具窗口出现： 
    * **Frames** 选项卡包含调用堆栈。
    * **Variables** 选项卡包含当前上下文中的变量。
    * **Coroutines** 选项卡包含有关正在运行或已挂起协程的信息。它显示有三个协程。
    第一个的状态为 **RUNNING**，另外两个的状态为 **CREATED**。

    ![调试协程](coroutine-debug-1.png)

3. 点击 **Debug** 工具窗口中的 **Resume Program** (恢复程序) 来恢复调试器会话：

    ![调试协程](coroutine-debug-2.png)
    
    现在 **Coroutines** 选项卡显示如下内容：
    * 第一个协程的状态为 **SUSPENDED** – 它正在等待数值以便进行乘法运算。
    * 第二个协程正在计算 `a` 的值 – 它的状态为 **RUNNING**。
    * 第三个协程的状态为 **CREATED**，且尚未开始计算 `b` 的值。

4. 点击 **Debug** 工具窗口中的 **Resume Program** (恢复程序) 来恢复调试器会话：

    ![构建控制台应用程序](coroutine-debug-3.png)

    现在 **Coroutines** 选项卡显示如下内容：
    * 第一个协程的状态为 **SUSPENDED** – 它正在等待数值以便进行乘法运算。
    * 第二个协程已计算出它的值并消失。
    * 第三个协程正在计算 `b` 的值 – 它的状态为 **RUNNING**。

使用 IntelliJ IDEA 调试器，您可以深入了解每个协程以调试代码。

### 被优化的变量

如果您使用 `suspend` 函数，在调试器中，您可能会在变量名旁边看到 “was optimized out” 文本：

![变量 "a" 已被优化](variable-optimised-out.png){width=480}

此文本表示变量的生存期已缩短，该变量已不再存在。调试包含优化变量的代码非常困难，因为您看不见它们的值。您可以使用 `-Xdebug` 编译器选项禁用此行为。

> __切勿在生产环境中使用此标志__：`-Xdebug` 可能会[导致内存泄漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}