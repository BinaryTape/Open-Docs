[//]: # (title: 範圍與進程)

在 Kotlin 中，範圍（Ranges）和進程（Progressions）定義了數值序列，支援範圍運算子、迭代、自訂步長值以及等差進程。

## 範圍 {id="range"}

Kotlin 讓您可以使用來自 `kotlin.ranges` 封裝的 [`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html) 和 [`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html) 函式輕鬆建立數值範圍。

範圍表示一個具有明確起始和結束的有序數值集合。預設情況下，它在每個步驟中遞增 1。
例如，`1..4` 代表數值 1、2、3 和 4。

若要建立：

*   閉合範圍 (closed-ended range)，請使用 `..` 運算子呼叫 `.rangeTo()` 函式。這包括起始值和結束值。
*   開放範圍 (open-ended range)，請使用 `..<` 運算子呼叫 `.rangeUntil()` 函式。這包括起始值但不包括結束值。

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

範圍對於迭代 `for` 迴圈特別有用：

```kotlin
fun main() {
//sampleStart
    for (i in 1..4) print(i)
    // 1234
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-for-loop"}

若要以相反順序迭代數值，請使用 [`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html) 函式而非 `..`。

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 4321
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-downto"}

您也可以使用 [`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html) 函式以自訂步長來迭代數值，而非預設的遞增 1：

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

## 進程

整數類型（例如 `Int`、`Long` 和 `Char`）的範圍可以被視為 [等差進程](https://en.wikipedia.org/wiki/Arithmetic_progression)。
在 Kotlin 中，這些進程由特殊類型定義：[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html)、[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html) 和 [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)。

進程有三個基本屬性：`first` 元素、`last` 元素和一個非零的 `step` 步長。
第一個元素是 `first`，後續元素是前一個元素加上 `step` 步長。
以正數步長迭代進程，等同於 Java/JavaScript 中的帶索引 `for` 迴圈。

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

當您透過迭代範圍隱式建立進程時，此進程的 `first` 和 `last` 元素是該範圍的端點，而 `step` 步長為 1。

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 12345678910
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions"}

若要定義自訂的進程步長，請在範圍上使用 `step` 函式。

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 1357
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-step"}

進程的 `last` 元素如此計算：
*   對於正數步長：不大於結束值且滿足 `(last - first) % step == 0` 的最大值。
*   對於負數步長：不小於結束值且滿足 `(last - first) % step == 0` 的最小值。

因此，`last` 元素不總是與指定的結束值相同。

```kotlin

fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // the last element is 7
    // 147
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-last"}

進程實作了 `Iterable<N>`，其中 `N` 分別是 `Int`、`Long` 或 `Char`，因此您可以在各種[集合函式](collection-operations.md)中使用它們，例如 `map`、`filter` 等。

```kotlin

fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-filter"}