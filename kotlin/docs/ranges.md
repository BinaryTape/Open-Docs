---
title: "区间 (Ranges) 和数列 (progressions)"
---
范围（Ranges）和数列（progressions）定义了 Kotlin 中的值序列，支持范围运算符、迭代、自定义步长值和算术数列。

## 范围（Ranges）

Kotlin 允许你使用 `kotlin.ranges` 包中的 [`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html) 和 [`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html) 函数轻松创建值范围。

范围表示具有定义的开始和结束的有序值集合。 默认情况下，它在每个步骤递增 1。 例如，`1..4` 表示数字 1、2、3 和 4。

要创建：

* 一个闭区间范围，调用带有 `..` 运算符的 `.rangeTo()` 函数。 这包括开始值和结束值。
* 一个半开区间范围，调用带有 `..<` 运算符的 `.rangeUntil()` 函数。 这包括起始值，但不包括结束值。

例如：

```kotlin
fun main() {

    // 闭区间范围：包括 1 和 4
    println(4 in 1..4)
    // true
    
    // 半开区间范围：包括 1，不包括 4
    println(4 in 1..&lt;4)
    // false

}
```

范围对于迭代 `for` 循环特别有用：

```kotlin
fun main() {

    for (i in 1..4) print(i)
    // 1234

}
```

要以相反的顺序迭代数字，请使用 [`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html) 函数而不是 `..`。

```kotlin
fun main() {

    for (i in 4 downTo 1) print(i)
    // 4321

}
```

你还可以使用 [`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html) 函数，以自定义步长迭代数字，而不是默认的增量 1：

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

## 数列（Progression）

整数类型（例如 `Int`、`Long` 和 `Char`）的范围可以被视为 [算术数列](https://en.wikipedia.org/wiki/Arithmetic_progression)。 在 Kotlin 中，这些数列由特殊类型定义：[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html)、[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html) 和 [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)。

数列具有三个基本属性：`first` 元素、`last` 元素和一个非零 `step`。 第一个元素是 `first`，后续元素是前一个元素加上一个 `step`。 使用正步长迭代数列等效于 Java/JavaScript 中的索引 `for` 循环。

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

当你通过迭代范围隐式创建数列时，此数列的 `first` 和 `last` 元素是范围的端点，`step` 为 1。

```kotlin
fun main() {

    for (i in 1..10) print(i)
    // 12345678910

}
```

要定义自定义数列步长，请在范围上使用 `step` 函数。

```kotlin

fun main() {

    for (i in 1..8 step 2) print(i)
    // 1357

}
```

数列的 `last` 元素按以下方式计算：
* 对于正步长：不大于结束值的最大值，使得 `(last - first) % step == 0`。
* 对于负步长：不小于结束值的最小值，使得 `(last - first) % step == 0`。

因此，`last` 元素并不总是与指定的结束值相同。

```kotlin

fun main() {

    for (i in 1..9 step 3) print(i) // 最后一个元素是 7
    // 147

}
```

数列实现了 `Iterable<N>`，其中 `N` 分别是 `Int`、`Long` 或 `Char`，因此你可以在各种[集合函数](collection-operations)中使用它们，例如 `map`、`filter` 等。

```kotlin

fun main() {

    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]

}
```