[//]: # (title: 运算符重载)

Kotlin 允许你为类型上预定义的一组运算符提供自定义实现。这些运算符拥有预定义的符号表示（例如 `+` 或 `*`）和优先级。要实现一个运算符，需为你所对应的类型提供一个具有特定名称的[成员函数](functions.md#member-functions)或[扩展函数](extensions.md)。此类型将成为二元操作的左侧类型，以及一元操作的参数类型。

要重载一个运算符，请使用 `operator` 修饰符标记相应的函数：

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
当你[覆盖](inheritance.md#overriding-methods)你的运算符重载时，可以省略 `operator`：

```kotlin
class OrdersList: IndexedContainer {
    override fun get(index: Int) { /*...*/ }   
}
```

## 一元操作

### 一元前缀运算符

| 表达式 | 翻译为 |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

此表表示当编译器处理 `+a` 这样的表达式时，它会执行以下步骤：

* 确定 `a` 的类型，假设为 `T`。
* 查找一个对接收者 `T` (即成员函数或扩展函数) 而言，带有 `operator` 修饰符且无参数的 `unaryPlus()` 函数。
* 如果该函数不存在或存在歧义，则会引发编译错误。
* 如果该函数存在且其返回类型为 `R`，则表达式 `+a` 的类型为 `R`。

> 这些操作，以及所有其他操作，都针对[基本类型](basic-types.md)进行了优化，并且不会为它们引入函数调用的开销。
>
{style="note"}

例如，以下是如何重载一元减号运算符：

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // 打印 "Point(x=-10, y=-20)"
}
```
{kotlin-runnable="true"}

### 递增和递减

| 表达式 | 翻译为 |
|------------|---------------|
| `a++` | `a.inc()` + 参见下文 |
| `a--` | `a.dec()` + 参见下文 |

`inc()` 和 `dec()` 函数必须返回一个值，该值将被赋值给使用 `++` 或 `--` 运算符的变量。它们不应修改调用 `inc` 或 `dec` 的对象。

编译器对*后缀*形式（例如 `a++`）的运算符解析执行以下步骤：

* 确定 `a` 的类型，假设为 `T`。
* 查找一个具有 `operator` 修饰符且无参数的 `inc()` 函数，该函数适用于类型为 `T` 的接收者。
* 检查函数的返回类型是否是 `T` 的子类型。

计算表达式的效果是：

* 将 `a` 的初始值存储到临时存储 `a0` 中。
* 将 `a0.inc()` 的结果赋值给 `a`。
* 将 `a0` 作为表达式的结果返回。

对于 `a--`，步骤完全类似。

对于*前缀*形式 `++a` 和 `--a`，解析方式相同，效果是：

* 将 `a.inc()` 的结果赋值给 `a`。
* 将 `a` 的新值作为表达式的结果返回。

## 二元操作

### 算术运算符 

| 表达式 | 翻译为 |
| -----------|-------------- |
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `a % b` | `a.rem(b)` |
| `a..b` | `a.rangeTo(b)` |
| `a..<b` | `a.rangeUntil(b)` |

对于此表中的操作，编译器仅解析 *翻译为* 列中的表达式。

下面是一个 `Counter` 类示例，它从给定值开始，并可以使用重载的 `+` 运算符进行递增：

```kotlin
data class Counter(val dayIndex: Int) {
    operator fun plus(increment: Int): Counter {
        return Counter(dayIndex + increment)
    }
}
```

### in 运算符

| 表达式 | 翻译为 |
| -----------|-------------- |
| `a in b` | `b.contains(a)` |
| `a !in b` | `!b.contains(a)` |

对于 `in` 和 `!in`，过程相同，但参数的顺序是相反的。

### 索引访问运算符

| 表达式 | 翻译为 |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

方括号被翻译为对 `get` 和 `set` 的调用，并带上适当数量的参数。

### invoke 运算符

| 表达式 | 翻译为 |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

圆括号被翻译为对 `invoke` 的调用，并带上适当数量的参数。

### 复合赋值

| 表达式 | 翻译为 |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

对于赋值操作，例如 `a += b`，编译器执行以下步骤：

* 如果右侧列中的函数可用：
  * 如果相应的二元函数（例如 `plusAssign()` 对应的 `plus()`）也可用，且 `a` 是一个可变变量，并且 `plus` 的返回类型是 `a` 类型的子类型，则报告错误（歧义）。
  * 确保其返回类型为 `Unit`，否则报告错误。
  * 生成 `a.plusAssign(b)` 的代码。
* 否则，尝试生成 `a = a + b` 的代码（这包括类型检查：`a + b` 的类型必须是 `a` 的子类型）。

> 赋值在 Kotlin 中*不是*表达式。
>
{style="note"}

### 相等和不等运算符

| 表达式 | 翻译为 |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

这些运算符仅与函数 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 一起使用，该函数可以被覆盖以提供自定义的相等性检查实现。任何其他同名函数（例如 `equals(other: Foo)`）都不会被调用。

> `===` 和 `!==`（同一性检查）不可重载，因此它们没有约定。
>
{style="note"}

`==` 操作很特殊：它被翻译成一个复杂的表达式，用于筛选 `null` 值。
`null == null` 总是为真，而非空 `x` 的 `x == null` 总是为假，并且不会调用 `x.equals()`。

### 比较运算符

| 表达式 | 翻译为 |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

所有比较都被翻译为对 `compareTo` 的调用，该函数要求返回 `Int` 类型。

### 属性委托运算符

`provideDelegate`、`getValue` 和 `setValue` 运算符函数在[委托属性](delegated-properties.md)中进行了描述。

## 具名函数的中缀调用

你可以通过使用[中缀函数调用](functions.md#infix-notation)来模拟自定义的中缀操作。