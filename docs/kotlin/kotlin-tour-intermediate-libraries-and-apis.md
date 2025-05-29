[//]: # (title: 中级: 库与 API)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接收者的 Lambda 表达式</a><br />
        <img src="icon-4-done.svg" width="20" alt="第四步" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类与接口</a><br />
        <img src="icon-5-done.svg" width="20" alt="第五步" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-done.svg" width="20" alt="第六步" /> <a href="kotlin-tour-intermediate-open-special-classes.md">open 和特殊类</a><br />
        <img src="icon-7-done.svg" width="20" alt="第七步" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-done.svg" width="20" alt="第八步" /> <a href="kotlin-tour-intermediate-null-safety.md">空安全</a><br />
        <img src="icon-9.svg" width="20" alt="第九步" /> <strong>库与 API</strong><br /></p>
</tldr>

为了充分利用 Kotlin，请使用现有的库和 API，这样您可以花更多时间编码，减少重复造轮子的时间。

库分发可重用代码，简化了常见任务。在库中，有将相关类、函数和实用工具进行分组的包和对象。库以一组函数、类或属性的形式暴露 API (应用程序编程接口)，供开发者在其代码中使用。

![Kotlin 库和 API](kotlin-library-diagram.svg){width=600}

让我们探索 Kotlin 的可能性。

## 标准库

Kotlin 有一个标准库，它提供了基本类型、函数、集合和实用工具，使您的代码简洁且富有表达力。标准库的大部分内容（[`kotlin` 包](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/)中的所有内容）在任何 Kotlin 文件中都可随时使用，无需显式导入：

```kotlin
fun main() {
    val text = "emosewa si niltoK"
    
   // Use the reversed() function from the standard library
    val reversedText = text.reversed()

    // Use the print() function from the standard library
    print(reversedText)
    // Kotlin is awesome
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-stdlib"}

然而，标准库的某些部分在使用前需要导入。例如，如果您想使用标准库的时间测量功能，则需要导入 [`kotlin.time` 包](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)。

在文件顶部，添加 `import` 关键字，后跟您需要的包：

```kotlin
import kotlin.time.*
```

星号 `*` 是一个通配符导入，它告诉 Kotlin 导入包中的所有内容。您不能将星号 `*` 与伴生对象一起使用。相反，您需要显式声明要使用的伴生对象成员。

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

*   导入 `Duration` 类及其伴生对象的 `hours` 和 `minutes` 扩展属性。
*   使用 `minutes` 属性将 `30` 转换为 30 分钟的 `Duration`。
*   使用 `hours` 属性将 `0.5` 转换为 30 分钟的 `Duration`。
*   检查两个 `Duration` 是否相等并打印结果。

### 动手实现前先搜索

在您决定编写自己的代码之前，请检查标准库，看看您要找的功能是否已经存在。以下是标准库已经为您提供了许多类、函数和属性的领域列表：

*   [集合](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/)
*   [序列](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.sequences/)
*   [字符串操作](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/)
*   [时间管理](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)

要了解标准库中的其他内容，请查阅其 [API 参考](https://kotlinlang.org/api/core/kotlin-stdlib/)。

## Kotlin 库

标准库涵盖了许多常见用例，但也有一些它未能解决。幸运的是，Kotlin 团队和社区的其他成员已经开发了广泛的库来补充标准库。例如，[`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 可帮助您跨不同平台管理时间。

您可以在我们的 [搜索平台](https://klibs.io/) 上找到有用的库。要使用它们，您需要采取额外的步骤，例如添加依赖项或插件。每个库都有一个 GitHub 仓库，其中包含如何在 Kotlin 项目中包含它的说明。

添加库后，您可以导入其中的任何包。以下是导入 `kotlinx-datetime` 包以查找纽约当前时间的示例：

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

*   导入 `kotlinx.datetime` 包。
*   使用 `Clock.System.now()` 函数创建 `Instant` 类的一个实例，其中包含当前时间，并将结果赋值给 `now` 变量。
*   打印当前时间。
*   使用 `TimeZone.of()` 函数查找纽约的时区，并将结果赋值给 `zone` 变量。
*   调用包含当前时间的实例上的 `.toLocalDateTime()` 函数，并将纽约时区作为参数。
*   将结果赋值给 `localDateTime` 变量。
*   打印根据纽约时区调整后的时间。

> 要更详细地探索此示例中使用的函数和类，请查阅 [API 参考](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/)。
>
{style="tip"}

## API 选择加入 (Opt-in)

库作者可能会将某些 API 标记为在使用前需要选择加入。他们通常在 API 仍在开发中且将来可能会更改时这样做。如果您不选择加入，您将看到类似以下的警告或错误：

```text
This declaration needs opt-in. Its usage should be marked with '@...' or '@OptIn(...)'
```

要选择加入，请编写 `@OptIn`，后跟包含对 API 进行分类的类名的括号，再后跟两个冒号 `::` 和 `class`。

例如，标准库中的 `uintArrayOf()` 函数属于 `@ExperimentalUnsignedTypes`，如 [API 参考](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-u-int-array.html) 所示：

```kotlin
@ExperimentalUnsignedTypes
inline fun uintArrayOf(vararg elements: UInt): UIntArray
```

在您的代码中，选择加入看起来像这样：

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
```

以下是选择加入以使用 `uintArrayOf()` 函数创建无符号整数数组并修改其中一个元素的示例：

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
fun main() {
    // Create an unsigned integer array
    val unsignedArray: UIntArray = uintArrayOf(1u, 2u, 3u, 4u, 5u)

    // Modify an element
    unsignedArray[2] = 42u
    println("Updated array: ${unsignedArray.joinToString()}")
    // Updated array: 1, 2, 42, 4, 5
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-apis"}

这是最简单的选择加入方式，但还有其他方式。要了解更多信息，请参阅 [选择加入要求](opt-in-requirements.md)。

## 练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="libraries-exercise-1"}

您正在开发一个金融应用程序，帮助用户计算其投资的未来价值。计算复利的公式是：

<math>A = P \times (1 + \displaystyle\frac{r}{n})^{nt}</math>

其中：

*   `A` 是计息后累积的金额（本金 + 利息）。
*   `P` 是本金（初始投资）。
*   `r` 是年利率（小数）。
*   `n` 是每年复利的次数。
*   `t` 是资金投资的时间（以年为单位）。

更新代码以：

1.  从 [`kotlin.math` 包](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.math/) 导入必要的函数。
2.  为 `calculateCompoundInterest()` 函数添加函数体，计算应用复利后的最终金额。

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

您想测量程序中执行多个数据处理任务所需的时间。更新代码以添加来自 [`kotlin.time`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/) 包的正确导入语句和函数：

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

最新 Kotlin 版本中有一个新的标准库功能。您想尝试一下，但它需要选择加入。此功能属于 [`@ExperimentalStdlibApi`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-experimental-stdlib-api/)。在您的代码中，选择加入应该如何表示？

|---|---|
```kotlin
@OptIn(ExperimentalStdlibApi::class)
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-libraries-solution-3"}

## 接下来是什么？

恭喜！您已完成中级教程！接下来，请查看我们针对流行 Kotlin 应用程序的教程：

*   [使用 Spring Boot 和 Kotlin 创建后端应用程序](jvm-create-project-with-spring-boot.md)
*   从零开始创建 Android 和 iOS 跨平台应用程序，并：
    *   [共享业务逻辑同时保持 UI 原生](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
    *   [共享业务逻辑和 UI](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)