[//]: # (title: 区间与等差数列)

Kotlin 中的区间与等差数列定义了值的序列，支持区间运算符、迭代、自定义步长值和等差数列。

## 区间 {id="range"}

Kotlin 允许你使用 `kotlin.ranges` 包中的 [`rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html) 和 [`rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html) 函数轻松创建值区间。

区间表示一个有序的值集合，具有定义的起始值和结束值。默认情况下，它每步递增 1。例如，`1..4` 表示数字 1、2、3 和 4。

要创建：

*   一个闭合区间，使用 `..` 运算符调用 `.rangeTo()` 函数。这包括起始值和结束值。
*   一个半开区间，使用 `..<` 运算符调用 `.rangeUntil()` 函数。这包括起始值但不包括结束值。

例如：

```kotlin
fun main() {
//sampleStart
    // Closed-ended range: includes both 1 and 4
    println(4 in 1..4)
    // true
    
    // Open-ended range: includes 1, excludes 4
    println(4 in 1..<4)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-rangeto-rangeuntil"}

区间在 `for` 循环中迭代时特别有用：

```kotlin
fun main() {
//sampleStart
    for (i in 1..4) print(i)
    // 1234
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-for-loop"}

要以倒序迭代数字，请使用 [`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html) 函数代替 `..`。

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 4321
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-downto"}

你还可以使用 [`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html) 函数以自定义步长迭代数字，而不是默认的步长 1：

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

## 等差数列

诸如 `Int`、`Long` 和 `Char` 等整数类型 (integral types) 的区间可以被视为 [等差数列](https://en.wikipedia.org/wiki/Arithmetic_progression)。在 Kotlin 中，这些等差数列由特殊类型定义：[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html)、[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html) 和 [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)。

等差数列有三个基本属性：`first` 元素、`last` 元素和一个非零的 `step`。第一个元素是 `first`，后续元素是前一个元素加上 `step`。以正步长对等差数列进行迭代等同于 Java/JavaScript 中的带索引 `for` 循环。

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

当你通过迭代区间隐式创建等差数列时，该等差数列的 `first` 和 `last` 元素是区间的端点，并且 `step` 为 1。

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 12345678910
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions"}

要定义自定义等差数列步长，请在区间上使用 `step` 函数。

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 1357
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-step"}

等差数列的 `last` 元素按以下方式计算：
*   对于正步长：不大于结束值的最大值，使得 `(last - first) % step == 0`。
*   对于负步长：不小于结束值的最小值，使得 `(last - first) % step == 0`。

因此，`last` 元素不总是与指定的结束值相同。

```kotlin

fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // the last element is 7
    // 147
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-last"}

等差数列实现了 `Iterable<N>`，其中 `N` 分别是 `Int`、`Long` 或 `Char`，因此你可以在各种 [集合函数](collection-operations.md) 中使用它们，例如 `map`、`filter` 等。

```kotlin

fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-filter"}