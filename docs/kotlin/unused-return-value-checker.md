[//]: # (title: 未使用的返回值检测器)

<primary-label ref="experimental-general"/>

> 这项特性计划在未来的 Kotlin 版本中得到稳定和改进。
> 我们非常感谢您在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719) 中提供反馈意见。
>
> 有关更多信息，请参见相关的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)。
>
{style="note"}

未使用的返回值检测器允许您检测_被忽略的结果_。
这些值是从产生非 `Unit`、`Nothing` 或 `Nothing?` 类型结果的表达式中返回的，并且它们没有被：

* 存储在变量或属性中。
* 返回或抛出。
* 作为实参传递给另一个函数。
* 在调用或安全调用中用作接收者。
* 在 `if`、`when` 或 `while` 等条件中被检测。
* 用作 lambda 表达式的最后一个语句。

该检测器不会报告 `++` 和 `--` 等增量操作的被忽略结果，也不会报告右侧退出当前函数的布尔短路（例如 `condition || return`）的被忽略结果。

您可以使用未使用的返回值检测器来捕获 bug，即当函数调用产生了有意义的结果，但该结果却被悄无声息地丢弃的情况。
这有助于防止意外行为，并使得此类问题更容易被追踪。

这里有一个示例，其中创建了一个字符串但从未使用，因此检测器会将其报告为被忽略的结果：

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // 检测器会报告一个警告，指出此结果被忽略：
        // "Unused return value of 'plus'."
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

## 配置未使用的返回值检测器

您可以使用 `-Xreturn-value-checker` 编译器选项来控制编译器如何报告被忽略的结果。

它有以下模式：

* `disable` 禁用未使用的返回值检测器（默认）。
* `check` 启用检测器，并报告 [标记函数](#mark-functions-to-check-ignored-results) 中被忽略结果的警告。
* `full` 启用检测器，将您的项目中所有函数视为 [已标记](#mark-functions-to-check-ignored-results)，并报告被忽略结果的警告。

> 所有标记函数都会以这种方式传播，并且如果在使用您的代码作为依赖项的项目中启用了该检测器，则会报告被忽略的结果。
>
{style="note"}

要在您的项目中启用未使用的返回值检测器，请将编译器选项添加到您的构建配置文件中：

<tabs>
<tab id="kotlin" title="Gradle">

```kotlin
// build.gradle(.kts)
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```
</tab>

<tab id="maven" title="Maven">

```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    ..
    <configuration>
        <args>
            <arg>-Xreturn-value-checker=check</arg>
        </args>
    </configuration>
</plugin>
```

</tab>
</tabs>

## 标记函数以检测被忽略的结果

当您将 [ `-Xreturn-value-checker` 编译器选项](#configure-the-unused-return-value-checker) 设置为 `check` 时，检测器仅报告来自已标记表达式的被忽略结果，就像 Kotlin 标准库中的大多数函数一样。

要标记您自己的代码，请使用 [`@MustUseReturnValues`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-must-use-return-value/) 注解。
您可以将其应用于文件、类或函数，具体取决于您希望检测器覆盖的作用域。

例如，您可以标记整个文件：

```kotlin
// 标记此文件中的所有函数和类，以便检测器报告未使用的返回值
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

或者特定的类：

```kotlin
// 标记此类的所有函数，以便检测器报告未使用的返回值
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```

> 您可以通过将 `-Xreturn-value-checker` 编译器选项设置为 `full` 来将检测器应用于您的整个项目。
> 使用此选项，您无需使用 `@MustUseReturnValues` 注解您的代码。
>
{style="note"}

## 抑制被忽略结果的报告

您可以通过使用 [`@IgnorableReturnValue`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-ignorable-return-value/) 注解来抑制特定函数上的报告。
在忽略结果常见且预期的函数上进行注解，例如 `MutableList.add`：

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

您可以在不注解函数本身的情况下抑制警告。
为此，请将结果赋值给一个带有下划线语法 (`_`) 的特殊未命名变量：

```kotlin
// 不可忽略的函数
fun computeValue(): Int = 42

fun main() {

    // 报告警告：结果被忽略
    computeValue()

    // 仅在此调用点使用特殊的未使用变量来抑制警告
    val _ = computeValue()
}
```

### 函数覆盖中的被忽略结果

当您覆盖函数时，覆盖函数会继承由基声明上的注解定义的报告规则。
这同样适用于基声明是 Kotlin 标准库或其他库依赖项的一部分的情况，因此检测器会报告像 `Any.hashCode()` 等函数覆盖的被忽略结果。

此外，您不能使用另一个 [要求其返回值被使用](#mark-functions-to-check-ignored-results) 的函数来覆盖使用 `@IgnorableReturnValue` 标记的函数。
但是，当其结果可以安全地被忽略时，您可以在带有 `@MustUseReturnValues` 注解的类或接口中，在覆盖函数上标记 `@IgnorableReturnValue`：

```kotlin
@MustUseReturnValues
interface Greeter {
    fun greet(name: String): String
}

object SilentGreeter : Greeter {
    @IgnorableReturnValue
    override fun greet(name: String): String = ""
}

fun check(g: Greeter) {
    // 报告警告：返回值未使用
    g.greet("John")

    // 没有警告
    SilentGreeter.greet("John")
}
```

## 与 Java 注解的互操作性

一些 Java 库使用不同注解的类似机制。
未使用的返回值检测器将以下注解视为等同于使用 `@MustUseReturnValues`：

* [`com.google.errorprone.annotations.CheckReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CheckReturnValue.html)
* [`edu.umd.cs.findbugs.annotations.CheckReturnValue`](https://findbugs.sourceforge.net/api/edu/umd/cs/findbugs/annotations/CheckReturnValue.html)
* [`org.jetbrains.annotations.CheckReturnValue`](https://javadoc.io/doc/org.jetbrains/annotations/latest/org/jetbrains/annotations/CheckReturnValue.html)
* [`org.springframework.lang.CheckReturnValue`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/lang/CheckReturnValue.html)
* [`org.jooq.CheckReturnValue`](https://www.jooq.org/javadoc/latest/org.jooq/org/jooq/CheckReturnValue.html)

它还将 [`com.google.errorprone.annotations.CanIgnoreReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CanIgnoreReturnValue.html) 视为等同于使用 `@IgnorableReturnValue`。