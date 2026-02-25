[//]: # (title: 區間與數列)

區間 (Ranges) 與數列 (progressions) 定義了 Kotlin 中的值序列，支援區間運算子、迭代、自訂步長以及等差數列。

## 區間 {id="range"}

Kotlin 讓您可以使用 `kotlin.ranges` 套件中的 [`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html) 與 [`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html) 函式輕鬆建立值區間。

區間表示一組具有定義起始和結束值的有序值集合。預設情況下，每一步都會遞增 1。例如，`1..4` 代表數字 1、2、3 和 4。

若要建立：

* 閉區間 (closed-ended range)，請搭配 `..` 運算子呼叫 `.rangeTo()` 函式。這會包含起始值和結束值。
* 開區間 (open-ended range)，請搭配 `..<` 運算子呼叫 `.rangeUntil()` 函式。這會包含起始值但不包含結束值。

例如：

```kotlin
fun main() {
//sampleStart
    // 閉區間：包含 1 和 4
    println(4 in 1..4)
    // true
    
    // 開區間：包含 1，不包含 4
    println(4 in 1..<4)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-rangeto-rangeuntil"}

區間對於在 `for` 迴圈中進行迭代特別有用：

```kotlin
fun main() {
//sampleStart
    for (i in 1..4) print(i)
    // 1234
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-for-loop"}

若要以反序迭代數字，請使用 [`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html) 函式而非 `..`。

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 4321
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-downto"}

您也可以使用 [`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html) 函式以自訂步長迭代數字，而非預設的遞增 1：

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

## 數列

`Int`、`Long` 和 `Char` 等整數型別的區間可以被視為 [等差數列](https://en.wikipedia.org/wiki/Arithmetic_progression)。在 Kotlin 中，這些數列是由特殊型別定義的：[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html)、[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html) 和 [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)。

數列具有三個基本屬性：`first` 元素、`last` 元素和一個非零的 `step`。第一個元素是 `first`，後續元素是前一個元素加上 `step`。以正步長迭代數列相當於 Java/JavaScript 中的索引 `for` 迴圈。

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

當您透過迭代區間隱式建立數列時，該數列的 `first` 和 `last` 元素是區間的端點，且 `step` 為 1。

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 12345678910
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions"}

若要定義自訂數列步長，請在區間上使用 `step` 函式。

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 1357
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-step"}

數列的 `last` 元素計算方式如下：
* 正步長：不大於結束值且滿足 `(last - first) % step == 0` 的最大值。
* 負步長：不小於結束值且滿足 `(last - first) % step == 0` 的最小值。

因此，`last` 元素並不總是與指定的結束值相同。

```kotlin

fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // last 元素為 7
    // 147
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-last"}

數列實作了 `Iterable<N>`（其中 `N` 分別為 `Int`、`Long` 或 `Char`），因此您可以在各種 [集合函式](collection-operations.md)（如 `map`、`filter` 等）中使用它們。

```kotlin

fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-filter"}