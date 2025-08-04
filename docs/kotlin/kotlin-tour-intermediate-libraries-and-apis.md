[//]: # (title: 中级：库与 API)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接收者的 lambda 表达式</a><br />
        <img src="icon-4-done.svg" width="20" alt="第四步" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类与接口</a><br />
        <img src="icon-5-done.svg" width="20" alt="第五步" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-done.svg" width="20" alt="第六步" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7-done.svg" width="20" alt="第七步" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-done.svg" width="20" alt="第八步" /> <a href="kotlin-tour-intermediate-null-safety.md">空安全</a><br />
        <img src="icon-9.svg" width="20" alt="第九步" /> <strong>库与 API</strong><br /></p>
</tldr>

为了最大限度地利用 Kotlin，请使用现有的库和 API，这样你就可以花更多时间编写代码，减少重复造轮子的时间。

库分发可复用代码，以简化常见任务。在库中，有用于对相关类、函数和实用工具进行分组的包和对象。库以一组函数、类或属性的形式公开 API（应用程序编程接口），供开发者在代码中使用。

![Kotlin 库与 API](kotlin-library-diagram.svg){width=600}

让我们探索一下 Kotlin 的可能性。

## 标准库

Kotlin 有一个标准库，提供基本类型、函数、集合和实用工具，让你的代码简洁而富有表现力。标准库的很大一部分（[`kotlin` 包](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/)中的所有内容）在任何 Kotlin 文件中都可随时使用，无需显式导入：

```kotlin
fun main() {
    val text = "emosewa si niltoK"
    
   // 使用标准库中的 reversed() 函数
    val reversedText = text.reversed()

    // 使用标准库中的 print() 函数
    print(reversedText)
    // Kotlin is awesome
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-stdlib"}

然而，标准库的某些部分在使用前需要在代码中导入。例如，如果你想使用标准库的时间测量特性，你需要导入 [`kotlin.time` 包](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)。

在文件顶部，添加 `import` 关键字，后跟你需要导入的包：

```kotlin
import kotlin.time.*
```

星号 `*` 是一个通配符导入，它告诉 Kotlin 导入该包中的所有内容。你不能将星号 `*` 用于伴生对象。相反，你需要显式声明你想使用的伴生对象成员。

例如：

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

fun main() {
    val thirtyMinutes: Duration = 30.minutes
    val halfHour: Duration = 0.5.hours
    println(thirtyMinutes == halfHour)
    // true
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-time"}

此示例：

* 导入 `Duration` 类及其伴生对象的 `hours` 和 `minutes` 扩展属性。
* 使用 `minutes` 属性将 `30` 转换为 30 分钟的 `Duration`。
* 使用 `hours` 属性将 `0.5` 转换为 30 分钟的 `Duration`。
* 检测两个 Duration 是否相等并打印结果。

> 关于本示例中使用的函数和类的更详细探查，请参见 [API 参考](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/)。
>
{style="tip"}

## Kotlin 库

标准库涵盖了许多常见用例，但也有一些它无法解决的问题。幸运的是，Kotlin 团队和社区的其他成员开发了各种各样的库来补充标准库。例如，[`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 帮助你跨不同平台管理时间。

你可以在我们的 [搜索平台](https://klibs.io/) 上找到有用的库。要使用它们，你需要采取额外步骤，例如添加依赖项或插件。每个库都有一个 GitHub 版本库，其中包含如何在你的 Kotlin 项目中包含它的说明。

一旦你添加了该库，你就可以导入其中的任何包。以下是导入 `kotlinx-datetime` 包以查找纽约当前时间的示例：

```kotlin
import kotlinx.datetime.*

fun main() {
    val now = Clock.System.now() // Get current instant
    println("Current instant: $now")

    val zone = TimeZone.of("America/New_York")
    val localDateTime = now.toLocalDateTime(zone)
    println("Local date-time in NY: $localDateTime")
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-datetime"}

此示例：

* 导入 `kotlinx.datetime` 包。
* 使用 `Clock.System.now()` 函数创建 `Instant` 类的实例，该实例包含当前时间，并将结果赋值给 `now` 变量。
* 打印当前时间。
* 使用 `TimeZone.of()` 函数查找纽约的时区，并将结果赋值给 `zone` 变量。
* 在包含当前时间的实例上调用 `.toLocalDateTime()` 函数，并将纽约时区作为实参。
* 将结果赋值给 `localDateTime` 变量。
* 打印根据纽约时区调整后的时间。

> 关于本示例中使用的函数和类的更详细探查，请参见 [API 参考](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/)。
>
{style="tip"}

## 选择启用 API

库作者可能会将某些 API 标记为需要选择启用，然后你才能在代码中使用它们。他们通常在 API 仍在开发中且未来可能会改变时这样做。如果你不选择启用，你会看到如下警告或错误：

```text
This declaration needs opt-in. Its usage should be marked with '@...' or '@OptIn(...)'
```

要选择启用，请编写 `@OptIn`，后跟圆括号，其中包含对 API 进行分类的类名，再后跟两个冒号 `::` 和 `class`。

例如，标准库中的 `uintArrayOf()` 函数属于 `@ExperimentalUnsignedTypes`，如 [API 参考](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-u-int-array.html) 中所示：

```kotlin
@ExperimentalUnsignedTypes
inline fun uintArrayOf(vararg elements: UInt): UIntArray
```

在你的代码中，选择启用看起来像这样：

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
```

下面是一个示例，它选择启用以使用 `uintArrayOf()` 函数创建无符号整数数组并修改其中一个元素：

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
fun main() {
    // 创建一个无符号整数数组
    val unsignedArray: UIntArray = uintArrayOf(1u, 2u, 3u, 4u, 5u)

    // 修改一个元素
    unsignedArray[2] = 42u
    println("Updated array: ${unsignedArray.joinToString()}")
    // Updated array: 1, 2, 42, 4, 5
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-apis"}

此示例：

* 创建了一个无符号整数数组。
* 修改了其中一个元素。

> 这是最简单的选择启用方式，但还有其他方式。关于选择启用要求，请参见 [选择启用要求](opt-in-requirements.md)。
>
{style="tip"}

## 练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="libraries-exercise-1"}

你正在开发一个金融应用程序，帮助用户计算他们投资的未来价值。计算复利的公式是：

<math>A = P \times (1 + \displaystyle\frac{r}{n})^{nt}</math>

其中：

* `A` 是计息后累计的金额（本金 + 利息）。
* `P` 是本金（初始投资）。
* `r` 是年利率（小数）。
* `n` 是每年复利的次数。
* `t` 是资金投资的年限（以年为单位）。

更新代码以：

1. 从 [`kotlin.math` 包](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.math/) 导入所需函数。
2. 为 `calculateCompoundInterest()` 函数添加函数体，计算应用复利后的最终金额。

|--|--|

```kotlin
// Write your code here

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    // Write your code here
}

fun main() {
    val principal = 1000.0
    val rate = 0.05
    val timesCompounded = 4
    val years = 5
    val amount = calculateCompoundInterest(principal, rate, timesCompounded, years)
    println("The accumulated amount is: $amount")
    // The accumulated amount is: 1282.0372317085844
}

```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-libraries-exercise-1"}

|---|---|
```kotlin
import kotlin.math.*

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    return P * (1 + r / n).pow(n * t)
}

fun main() {
    val principal = 1000.0
    val rate = 0.05
    val timesCompounded = 4
    val years = 5
    val amount = calculateCompoundInterest(principal, rate, timesCompounded, years)
    println("The accumulated amount is: $amount")
    // The accumulated amount is: 1282.0372317085844
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-libraries-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="libraries-exercise-2"}

你希望测量程序中执行多个数据处理任务所需的时间。更新代码，从 [`kotlin.time`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/) 包中添加正确的导入语句和函数：

|---|---|

```kotlin
// Write your code here

fun main() {
    val timeTaken = /* Write your code here */ {
    // Simulate some data processing
    val data = List(1000) { it * 2 }
    val filteredData = data.filter { it % 3 == 0 }

    // Simulate processing the filtered data
    val processedData = filteredData.map { it / 2 }
    println("Processed data")
}

println("Time taken: $timeTaken") // e.g. 16 ms
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-libraries-exercise-2"}

|---|---|
```kotlin
import kotlin.time.measureTime

fun main() {
    val timeTaken = measureTime {
        // Simulate some data processing
        val data = List(1000) { it * 2 }
        val filteredData = data.filter { it % 3 == 0 }

        // Simulate processing the filtered data
        val processedData = filteredData.map { it / 2 }
        println("Processed data")
    }

    println("Time taken: $timeTaken") // e.g. 16 ms
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-libraries-solution-2"}

### 练习 3 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-3"}

最新 Kotlin 版本中有一个新的标准库特性。你想尝试使用它，但它需要选择启用。该特性属于 [`@ExperimentalStdlibApi`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-experimental-stdlib-api/)。在你的代码中，选择启用应该是什么样子？

|---|---|
```kotlin
@OptIn(ExperimentalStdlibApi::class)
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-libraries-solution-3"}

## 下一步？

恭喜！你已完成中级教程！作为下一步，请查阅我们的热门 Kotlin 应用程序教程：

* [使用 Spring Boot 和 Kotlin 创建后端应用程序](jvm-create-project-with-spring-boot.md)
* 从头开始为 Android 和 iOS 创建跨平台应用程序，并：
    * [在保持 UI 原生的同时共享业务逻辑](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
    * [共享业务逻辑和 UI](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)