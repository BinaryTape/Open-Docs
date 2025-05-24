---
title: 範圍（Ranges）與數列（Progressions）
---
範圍（Ranges）和級數（progressions）定義了 Kotlin 中的值序列，支援範圍運算符、迭代、自定義步長值和算術級數。

## 範圍（Ranges）

Kotlin 讓您可以使用 `kotlin.ranges` 包中的 [`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html)
和 [`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html) 函數輕鬆創建值的範圍。

範圍表示具有已定義的開始和結束的有序值集合。 預設情況下，它在每個步驟中遞增 1。
例如，`1..4` 表示數字 1、2、3 和 4。

要創建：

*   閉區間範圍（closed-ended range），使用 `..` 運算符調用 `.rangeTo()` 函數。 這包括開始值和結束值。
*   開區間範圍（open-ended range），使用 `..<` 運算符調用 `.rangeUntil()` 函數。 這包括開始值，但不包括結束值。

例如：

```kotlin
fun main() {

    // 閉區間範圍：包括 1 和 4
    println(4 in 1..4)
    // true
    
    // 開區間範圍：包括 1，不包括 4
    println(4 in 1..&lt;4)
    // false

}
```

範圍對於在 `for` 迴圈中迭代特別有用：

```kotlin
fun main() {

    for (i in 1..4) print(i)
    // 1234

}
```

要按相反的順序迭代數字，請使用 [`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html)
函數而不是 `..`。

```kotlin
fun main() {

    for (i in 4 downTo 1) print(i)
    // 4321

}
```

您還可以通過使用 [`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html) 函數，使用自定義步長來迭代數字，而不是預設的增量 1：

```kotlin
fun main() {

    for (i in 0..8 step 2) print(i)
    println()
    // 02468
    for (i in 0..&lt;8 step 2) print(i)
    println()
    // 0246
    for (i in 8 downTo 0 step 2) print(i)
    // 86420

}
```

## 級數（Progression）

整數類型（如 `Int`、`Long` 和 `Char`）的範圍可以被視為
[算術級數](https://en.wikipedia.org/wiki/Arithmetic_progression)（arithmetic progressions）。
在 Kotlin 中，這些級數由特殊類型定義：[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html)、
[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html) 和
[`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)。

級數具有三個基本屬性：`first` 元素、`last` 元素和非零 `step`。
第一個元素是 `first`，後續元素是前一個元素加上 `step`。
使用正步長（positive step）迭代級數等效於 Java/JavaScript 中的索引 `for` 迴圈。

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

當您通過迭代範圍隱式創建級數時，此級數的 `first` 和 `last` 元素是範圍的端點，`step` 為 1。

```kotlin
fun main() {

    for (i in 1..10) print(i)
    // 12345678910

}
```

要定義自定義級數步長，請在範圍上使用 `step` 函數。

```kotlin

fun main() {

    for (i in 1..8 step 2) print(i)
    // 1357

}
```

級數的 `last` 元素按以下方式計算：

*   對於正步長：不大於結束值的最大值，使得 `(last - first) % step == 0`。
*   對於負步長：不小於結束值的最小值，使得 `(last - first) % step == 0`。

因此，`last` 元素並不總是與指定的結束值相同。

```kotlin

fun main() {

    for (i in 1..9 step 3) print(i) // 最後一個元素是 7
    // 147

}
```

級數實現了 `Iterable<N>`，其中 `N` 分別是 `Int`、`Long` 或 `Char`，因此您可以在各種
[集合函數](collection-operations)（collection functions）中使用它們，如 `map`、`filter` 和其他函數。

```kotlin

fun main() {

    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]

}
```
```