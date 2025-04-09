---
title: 相等性
---
在 Kotlin 中，有两种类型的相等性：

* _结构相等_ (`==`) - 检查 `equals()` 函数
* _引用相等_ (`===`) - 检查两个引用是否指向同一个对象

## 结构相等

结构相等验证两个对象是否具有相同的内容或结构。结构相等通过 `==` 操作及其否定形式 `!=` 进行检查。
按照约定，像 `a == b` 这样的表达式会被转换为：

```kotlin
a?.equals(b) ?: (b === null)
```

如果 `a` 不为 `null`，它会调用 `equals(Any?)` 函数。否则（`a` 为 `null`），它会检查 `b` 是否与 `null` 在引用上相等：

```kotlin
fun main() {
    var a = "hello"
    var b = "hello"
    var c = null
    var d = null
    var e = d

    println(a == b)
    // true
    println(a == c)
    // false
    println(c == e)
    // true
}
```

请注意，在显式与 `null` 进行比较时，优化代码是没有意义的：`a == null` 将自动转换为 `a === null`。

在 Kotlin 中，`equals()` 函数由 `Any` 类中的所有类继承。默认情况下，`equals()` 函数实现[引用相等](#referential-equality)。但是，Kotlin 中的类可以重写 `equals()` 函数以提供自定义的相等逻辑，并以这种方式实现结构相等。

值类（Value classes）和数据类（data classes）是两种特定的 Kotlin 类型，它们会自动重写 `equals()` 函数。
这就是为什么它们默认实现结构相等。

但是，对于数据类，如果 `equals()` 函数在父类中被标记为 `final`，则其行为保持不变。

不同的是，非数据类（未使用 `data` 修饰符声明的类）默认不重写 `equals()` 函数。相反，非数据类实现从 `Any` 类继承的引用相等行为。
要实现结构相等，非数据类需要自定义相等逻辑来重写 `equals()` 函数。

要提供自定义的相等性检查实现，请重写
[`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 函数：

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // Compares properties for structural equality
        return this.x == other.x && this.y == other.y
    }
}
``` 
:::note
当重写 equals() 函数时，您还应该重写 [hashCode() 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)，
以保持相等性和哈希之间的一致性，并确保这些函数的正确行为。

:::

具有相同名称和其他签名（例如 `equals(other: Foo)`）的函数不会影响使用
运算符 `==` 和 `!=` 的相等性检查。

结构相等与 `Comparable<...>` 接口定义的比较无关，因此只有自定义的 `equals(Any?)` 实现可能会影响运算符的行为。

## 引用相等

引用相等验证两个对象的内存地址，以确定它们是否是同一个实例。

引用相等通过 `===` 操作及其否定形式 `!==` 进行检查。当且仅当 `a` 和 `b` 指向同一对象时，`a === b` 的计算结果为 true：

```kotlin
fun main() {
    var a = "Hello"
    var b = a
    var c = "world"
    var d = "world"

    println(a === b)
    // true
    println(a === c)
    // false
    println(c === d)
    // true

}
```

对于运行时由基本类型表示的值
（例如，`Int`），`===` 相等性检查等同于 `==` 检查。

:::tip
引用相等的实现在 Kotlin/JS 中有所不同。有关相等性的更多信息，请参见 [Kotlin/JS](js-interop#equality) 文档。

:::

## 浮点数相等

当相等性检查的操作数静态已知为 `Float` 或 `Double`（可空或不可空）时，该检查遵循
[IEEE 754 浮点算术标准](https://en.wikipedia.org/wiki/IEEE_754)。

对于未静态类型化为浮点数的操作数，其行为有所不同。在这些情况下，
实现结构相等。因此，使用未静态类型化为浮点数的操作数的检查与
IEEE 标准不同。在这种情况下：

* `NaN` 等于自身
* `NaN` 大于任何其他元素（包括 `POSITIVE_INFINITY`）
* `-0.0` 不等于 `0.0`

有关更多信息，请参见[浮点数比较](numbers#floating-point-numbers-comparison)。

## 数组相等

要比较两个数组是否具有相同顺序的相同元素，请使用 [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)。

有关更多信息，请参见[比较数组](arrays#compare-arrays)。