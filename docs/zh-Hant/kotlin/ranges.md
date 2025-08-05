[//]: # (title: 範圍與進程)

Kotlin 中的範圍與進程定義了值的序列，支援範圍運算子、迭代、自訂步長值以及算術進程。

## 範圍 {id="range"}

Kotlin 讓您能使用來自 `kotlin.ranges` 套件的 [`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html) 和 [`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html) 函式輕鬆建立值的範圍。

範圍表示一組有序的值，具有定義的起點和終點。預設情況下，它在每一步遞增 1。例如，`1..4` 代表數字 1、2、3 和 4。

若要建立：

* 封閉式範圍，請呼叫帶有 `..` 運算子的 `.rangeTo()` 函式。這包含起始值和結束值。
* 開放式範圍，請呼叫帶有 `..<` 運算子的 `.rangeUntil()` 函式。這包含起始值但不包含結束值。

例如：

```kotlin
fun main() {
//sampleStart
    // 封閉式範圍：包含 1 和 4
    println(4 in 1..4)
    // true
    
    // 開放式範圍：包含 1，排除 4
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

若要以反向順序迭代數字，請使用 [`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html) 函式而不是 `..`。

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 4321
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-downto"}

您也可以透過使用 [`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html) 函式以自訂步長迭代數字，而不是預設的遞增 1：

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

諸如 `Int`、`Long` 和 `Char` 等整數類型的範圍可以被視為 [算術進程](https://en.wikipedia.org/wiki/Arithmetic_progression)。在 Kotlin 中，這些進程由特殊類型定義：[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html)、[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html) 和 [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)。

進程有三個基本屬性：`first` 元素、`last` 元素和非零的 `step`。第一個元素是 `first`，後續元素是前一個元素加上一個 `step`。以正步長迭代進程等同於 Java/JavaScript 中帶索引的 `for` 迴圈。

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

當您透過迭代範圍隱式建立進程時，這個進程的 `first` 和 `last` 元素是該範圍的端點，且 `step` 為 1。

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 12345678910
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions"}

若要定義自訂進程步長，請在範圍上使用 `step` 函式。

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 1357
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-step"}

進程的 `last` 元素是這樣計算的：
* 對於正步長：不大於結束值的最大值，使得 `(last - first) % step == 0`。
* 對於負步長：不小於結束值的最小值，使得 `(last - first) % step == 0`。

因此，`last` 元素不一定與指定的結束值相同。

```kotlin

fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // `last` 元素為 7
    // 147
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-last"}

進程實作 `Iterable<N>`，其中 `N` 分別是 `Int`、`Long` 或 `Char`，因此您可以在各種 [集合函式](collection-operations.md) 中使用它們，例如 `map`、`filter` 等。

```kotlin

fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-filter"}