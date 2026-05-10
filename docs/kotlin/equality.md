[//]: # (title: 相等)

在 Kotlin 中，有两种类型的相等：

* 结构相等 (`==`) - 检查 `equals()` 函数
* 引用相等 (`===`) - 检查两个引用是否指向同一个对象

## 结构相等

结构相等验证两个对象是否具有相同的内容或结构。结构相等通过 `==` 操作及其否定形式 `!=` 来检查。
按照约定，像 `a == b` 这样的表达式会被转换为：

```kotlin
a?.equals(b) ?: (b === null)
```

如果 `a` 不是 `null`，它会调用 `equals(Any?)` 函数。否则（`a` 为 `null`），它会检查 `b` 是否在引用上等于 `null`：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

请注意，在显式与 `null` 进行比较时，优化代码没有意义：`a == null` 会被自动转换为 `a === null`。

在 Kotlin 中，所有类都从 `Any` 类继承了 `equals()` 函数。默认情况下，`equals()` 函数实现[引用相等](#referential-equality)。然而，Kotlin 中的类可以重写 `equals()` 函数以提供自定义的相等逻辑，从而实现结构相等。

Value 类和数据类是两种特殊的 Kotlin 类型，它们会自动重写 `equals()` 函数。这就是为什么它们默认实现结构相等的原因。

然而，对于数据类，如果 `equals()` 函数在父类中被标记为 `final`，则其行为保持不变。

不同的是，非数据类（未声明 `data` 修饰符的类）默认不重写 `equals()` 函数。相反，非数据类实现从 `Any` 类继承的引用相等行为。要实现结构相等，非数据类需要自定义相等逻辑来重写 `equals()` 函数。

要提供自定义的 `equals` 检查实现，请重写 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 函数：

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // 比较属性以实现结构相等
        return this.x == other.x && this.y == other.y
    }
}
```
> 在重写 `equals()` 函数时，您还应该重写 [`hashCode() 函数`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)，以保持相等性与哈希之间的一致性，并确保这些函数的行为正确。
>
{style="note"}

具有相同名称但签名不同（如 `equals(other: Foo)`）的函数不会影响使用运算符 `==` 和 `!=` 进行的相等检查。

结构相等与由 `Comparable<...>` 接口定义的比较无关，因此只有自定义的 `equals(Any?)` 实现才会影响该运算符的行为。

## 引用相等

引用相等验证两个对象的内存地址，以确定它们是否为同一个实例。

引用相等通过 `===` 操作及其否定形式 `!==` 来检查。当且仅当 `a` 和 `b` 指向同一个对象时，`a === b` 的结果为 true：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

对于在运行时由原生类型表示的值（例如 `Int`），`===` 相等检查等同于 `==` 检查。

> 引用相等在 Kotlin/JS 中的实现方式有所不同。有关相等的更多信息，请参阅 [Kotlin/JS](js-interop.md#equality) 文档。
>
{style="tip"}

## 浮点数相等

当相等检查的操作数在静态上已知为 `Float` 或 `Double`（无论是否可为 null）时，该检查遵循 [IEEE 754 浮点运算标准](https://en.wikipedia.org/wiki/IEEE_754)。

对于操作数不是静态类型的浮点数的情况，其行为有所不同。在这些情况下，会应用结构相等。因此，操作数不是静态类型浮点数的检查与 IEEE 标准不同。在这种情况下：

* `NaN` 等于其自身
* `NaN` 大于任何其他元素（包括 `POSITIVE_INFINITY`）
* `-0.0` 不等于 `0.0`

有关更多信息，请参阅[浮点数比较](numbers.md#floating-point-numbers-comparison)。

## 数组相等

要比较两个数组是否以相同的顺序包含相同的元素，请使用 [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)。

有关更多信息，请参阅[比较数组](arrays.md#compare-arrays)。