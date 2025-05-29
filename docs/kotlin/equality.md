[//]: # (title: 相等性)

在 Kotlin 中，存在两种类型的相等性：

* _结构化_ 相等性 (`==`) - 对 `equals()` 函数的检查
* _引用_ 相等性 (`===`) - 对两个引用指向同一对象的检查

## 结构化相等性

结构化相等性验证两个对象是否具有相同的内容或结构。结构化相等性通过 `==` 运算符及其对应的否定运算符 `!=` 来检查。根据约定，像 `a == b` 这样的表达式会被转换为：

```kotlin
a?.equals(b) ?: (b === null)
```

如果 `a` 不为 `null`，它会调用 `equals(Any?)` 函数。否则（即 `a` 为 `null`），它会检查 `b` 是否引用相等地指向 `null`：

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

请注意，在明确与 `null` 比较时，优化代码没有意义：`a == null` 会自动转换为 `a === null`。

在 Kotlin 中，所有类都从 `Any` 类继承了 `equals()` 函数。默认情况下，`equals()` 函数实现[引用相等性](#referential-equality)。然而，Kotlin 中的类可以重写 `equals()` 函数以提供自定义的相等性逻辑，从而实现结构化相等性。

值类（Value classes）和数据类（data classes）是两种特殊的 Kotlin 类型，它们会自动重写 `equals()` 函数。这就是为什么它们默认实现结构化相等性的原因。

然而，对于数据类，如果 `equals()` 函数在父类中被标记为 `final`，则其行为保持不变。

明显地，非数据类（即未用 `data` 修饰符声明的类）默认不重写 `equals()` 函数。相反，非数据类实现从 `Any` 类继承的引用相等性行为。为了实现结构化相等性，非数据类需要自定义相等性逻辑来重写 `equals()` 函数。

要提供自定义的相等性检查实现，请重写 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 函数：

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
> 重写 `equals()` 函数时，您还应该重写 [`hashCode()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)，以保持相等性与哈希之间的一致性，并确保这些函数的正确行为。
>
{style="note"}

具有相同名称和不同签名（例如 `equals(other: Foo)`）的函数不会影响使用 `==` 和 `!=` 运算符进行的相等性检查。

结构化相等性与 `Comparable<...>` 接口定义的比较无关，因此只有自定义的 `equals(Any?)` 实现可能会影响运算符的行为。

## 引用相等性

引用相等性验证两个对象的内存地址，以确定它们是否是同一个实例。

引用相等性通过 `===` 运算符及其对应的否定运算符 `!==` 来检查。当且仅当 `a` 和 `b` 指向同一个对象时，`a === b` 评估为 `true`：

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

对于在运行时由基本类型表示的值（例如 `Int`），`===` 相等性检查等同于 `==` 检查。

> 引用相等性在 Kotlin/JS 中的实现有所不同。有关相等性的更多信息，请参阅 [Kotlin/JS](js-interop.md#equality) 文档。
>
{style="tip"}

## 浮点数相等性

当相等性检查的操作数在静态上已知为 `Float` 或 `Double`（可空或不可空）时，检查遵循 [IEEE 754 浮点运算标准](https://en.wikipedia.org/wiki/IEEE_754)。

对于未被静态类型化为浮点数的运算数，其行为有所不同。在这些情况下，会实现结构化相等性。因此，对未被静态类型化为浮点数的运算数进行的检查与 IEEE 标准不同。在这种情况下：

* `NaN` 等于其自身
* `NaN` 大于任何其他元素（包括 `POSITIVE_INFINITY`）
* `-0.0` 不等于 `0.0`

有关更多信息，请参阅[浮点数比较](numbers.md#floating-point-numbers-comparison)。

## 数组相等性

要比较两个数组是否包含相同元素且顺序一致，请使用 [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)。

有关更多信息，请参阅[比较数组](arrays.md#compare-arrays)。