[//]: # (title: 区间与数列)

区间和数列在 Kotlin 中定义了值序列，支持区间操作符、迭代、自定义步长值以及等差数列。

## 区间 {id="range"}

Kotlin 允许你使用来自 `kotlin.ranges` 包的 [`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html) 和 [`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html) 函数，轻松创建值区间。

区间表示一个具有明确起始和结束的有序值集合。默认情况下，它在每个步长上以 1 递增。例如，`1..4` 代表数字 1、2、3 和 4。

要创建：

*   闭合区间，调用带 `..` 操作符的 `.rangeTo()` 函数。这包括起始值和结束值。
*   开放区间，调用带 `..<` 操作符的 `.rangeUntil()` 函数。这包括起始值但不包括结束值。

例如：

```kotlin
fun main() {
//sampleStart
    // 闭合区间：包括 1 和 4
    println(4 in 1..4)
    // true
    
    // 开放区间：包括 1，不包括 4
    println(4 in 1..<4)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-rangeto-rangeuntil"}

区间对于迭代 `for` 循环特别有用：

```kotlin
fun main() {
//sampleStart
    for (i in 1..4) print(i)
    // 1234
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-for-loop"}

要以倒序迭代数字，请使用 [`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html) 函数而不是 `..`。

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 4321
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-downto"}

你也可以使用 [`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html) 函数，以自定义步长迭代数字，而不是默认的 1 递增量：

```kotlin
fun main() {
//sampleStart
    for (i in 0..8 step 2) print(i)
    println()
    // 02468
    for (i in 0..<8 step 2) print(i)
    println()
    // 0246
    for (i in 8 downTo 0 step 2) print(i)
    // 86420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-step"}

## 数列

整型区间，例如 `Int`、`Long` 和 `Char`，可以被视为 [等差数列](https://en.wikipedia.org/wiki/Arithmetic_progression)。在 Kotlin 中，这些数列由特殊类型定义：[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html)、[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html) 和 [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)。

数列有三个基本属性：`first` 元素、`last` 元素和一个非零的 `step`。第一个元素是 `first`，后续元素是前一个元素加上一个 `step`。以正步长对数列的迭代等同于 Java/JavaScript 中的带索引的 `for` 循环。

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

当你通过迭代区间隐式地创建一个数列时，该数列的 `first` 和 `last` 元素是区间的端点，并且 `step` 为 1。

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 12345678910
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions"}

要定义自定义数列步长，请在区间上使用 `step` 函数。

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 1357
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-step"}

数列的 `last` 元素按此方式计算：
*   对于正步长：不大于结束值的最大值，且满足 `(last - first) % step == 0`。
*   对于负步长：不小于结束值的最小值，且满足 `(last - first) % step == 0`。

因此，`last` 元素并非总是与指定的结束值相同。

```kotlin

fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // `last` 元素是 7
    // 147
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-last"}

数列实现了 `Iterable<N>`，其中 `N` 分别是 `Int`、`Long` 或 `Char`，因此你可以在各种 [集合函数](collection-operations.md) 中使用它们，例如 `map`、`filter` 等等。

```kotlin

fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-filter"}