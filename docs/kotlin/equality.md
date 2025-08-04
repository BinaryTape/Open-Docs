[//]: # (title: 相等性)

在 Kotlin 中，存在两种类型的相等性：

*   _结构相等性_ (`==`) - 对 `equals()` 函数的检测
*   _引用相等性_ (`===`) - 检测两个引用是否指向同一个对象

## 结构相等性

结构相等性验证两个对象是否具有相同的内容或结构。结构相等性通过 `==` 操作符及其取反操作符 `!=` 进行检测。
按照惯例，像 `a == b` 这样的表达式会被转换为：

```kotlin
a?.equals(b) ?: (b === null)
```

如果 `a` 不是 `null`，它会调用 `equals(Any?)` 函数。否则（`a` 是 `null`），它会检测 `b` 是否与 `null` 引用相等：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

请注意，在显式地与 `null` 进行比较时，优化代码没有意义：
`a == null` 会被自动转换为 `a === null`。

在 Kotlin 中，所有类都从 `Any` 类继承了 `equals()` 函数。默认情况下，`equals()` 函数实现了[引用相等性](#referential-equality)。然而，Kotlin 中的类可以覆盖 `equals()` 函数以提供自定义的相等性逻辑，并通过这种方式实现结构相等性。

值类和数据类是两种特定的 Kotlin 类型，它们会自动覆盖 `equals()` 函数。因此，它们默认实现了结构相等性。

然而，对于数据类，如果 `equals()` 函数在父类中被标记为 `final`，则其行为保持不变。

与之不同的是，非数据类（即未用 `data` 修饰符声明的类）默认不覆盖 `equals()` 函数。相反，非数据类实现了从 `Any` 类继承的引用相等性行为。要实现结构相等性，非数据类需要自定义相等性逻辑来覆盖 `equals()` 函数。

要提供自定义的相等性检测实现，请覆盖 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 函数：

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // 比较属性以实现结构相等性
        return this.x == other.x && this.y == other.y
    }
}
```
> 当覆盖 `equals()` 函数时，您还应该覆盖 [`hashCode()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)，以保持相等性和哈希之间的行为一致性，并确保这些函数正确运行。
>
{style="note"}

具有相同名称和其他签名（例如 `equals(other: Foo)`）的函数不会影响使用操作符 `==` 和 `!=` 的相等性检测。

结构相等性与 `Comparable<...>` 接口定义的比较无关，因此只有自定义的 `equals(Any?)` 实现才能影响操作符的行为。

## 引用相等性

引用相等性通过验证两个对象的内存地址来确定它们是否是同一个实例。

引用相等性通过 `===` 操作符及其取反操作符 `!==` 进行检测。当且仅当 `a` 和 `b` 指向同一个对象时，`a === b` 求值为 true：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对于运行时由原生类型（例如 `Int`）表示的值，`===` 相等性检测等同于 `==` 检测。

> 引用相等性在 Kotlin/JS 中实现方式不同。关于相等性的更多信息，请参阅 [Kotlin/JS](js-interop.md#equality) 文档。
>
{style="tip"}

## 浮点数相等性

当相等性检测的操作数在静态已知为 `Float` 或 `Double` 类型时（可空或不可空），该检测遵循 [IEEE 754 浮点数算术标准](https://en.wikipedia.org/wiki/IEEE_754)。

对于未静态类型化为浮点数的其他操作数，其行为不同。在这些情况下，会实现结构相等性。因此，使用未静态类型化为浮点数的操作数进行的检测与 IEEE 标准不同。在这种场景下：

*   `NaN` 等于自身
*   `NaN` 大于任何其他元素（包括 `POSITIVE_INFINITY`）
*   `-0.0` 不等于 `0.0`

关于更多信息，请参阅 [浮点数比较](numbers.md#floating-point-numbers-comparison)。

## 数组相等性

要比较两个数组是否包含相同顺序的相同元素，请使用 [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)。

关于更多信息，请参阅 [比较数组](arrays.md#compare-arrays)。