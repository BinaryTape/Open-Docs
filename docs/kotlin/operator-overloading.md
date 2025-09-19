[//]: # (title: 操作符重载)

Kotlin 允许你为类型上预定义的操作符集提供自定义实现。这些操作符具有预定义的符号表示（如 `+` 或 `*`）和优先级。要实现一个操作符，需为对应类型提供一个具有特定名称的[成员函数](functions.md#member-functions)或[扩展函数](extensions.md)。该类型会成为二元操作的左侧类型以及一元操作的实参类型。

要重载一个操作符，请使用 `operator` 修饰符标记相应的函数：

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
当[覆盖](inheritance.md#overriding-methods)你的操作符重载时，你可以省略 `operator`：

```kotlin
class OrdersList: IndexedContainer {
    override fun get(index: Int) { /*...*/ }   
}
```

## 一元操作

### 一元前缀操作符

| 表达式 | 转换为 |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

该表表示，当编译器处理例如表达式 `+a` 时，它会执行以下步骤：

* 确定 `a` 的类型，假设为 `T`。
* 查找一个带有 `operator` 修饰符且无形参的 `unaryPlus()` 函数，适用于接收者 `T`，这意味着它是一个成员函数或扩展函数。
* 如果该函数不存在或有歧义，则会报告编译错误。
* 如果该函数存在且其返回类型为 `R`，则表达式 `+a` 的类型为 `R`。

> 这些操作以及所有其他操作都针对[基本类型](basic-types.md)进行了优化，并且不会为它们引入函数调用的开销。
>
{style="note"}

作为一个示例，以下是如何重载一元负号操作符的方法：

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // prints "Point(x=-10, y=-20)"
}
```
{kotlin-runnable="true"}

### 递增和递减

| 表达式 | 转换为 |
|------------|---------------|
| `a++` | `a.inc()` + 见下文 |
| `a--` | `a.dec()` + 见下文 |

`inc()` 和 `dec()` 函数必须返回一个值，该值将赋值给使用 `++` 或 `--` 操作的变量。它们不应修改调用 `inc` 或 `dec` 的对象。

编译器会针对*后缀*形式的操作符解析执行以下步骤，例如 `a++`：

* 确定 `a` 的类型，假设为 `T`。
* 查找一个带有 `operator` 修饰符且无形参的 `inc()` 函数，适用于 `T` 类型的接收者。
* 检测该函数的返回类型是 `T` 的子类型。

计算该表达式的效果是：

* 将 `a` 的初始值存储到临时存储 `a0` 中。
* 将 `a0.inc()` 的结果赋值给 `a`。
* 将 `a0` 作为表达式的结果返回。

对于 `a--`，步骤完全类似。

对于*前缀*形式 `++a` 和 `--a`，解析方式相同，效果是：

* 将 `a.inc()` 的结果赋值给 `a`。
* 将 `a` 的新值作为表达式的结果返回。

## 二元操作

### 算术操作符 

| 表达式 | 转换为 |
| -----------|-------------- |
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `a % b` | `a.rem(b)` |
| `a..b` | `a.rangeTo(b)` |
| `a..<b` | `a.rangeUntil(b)` |

对于此表中的操作，编译器仅解析“转换为”列中的表达式。

下面是一个 `Counter` 类示例，它从给定值开始，并可以使用重载的 `+` 操作符进行递增：

```kotlin
data class Counter(val dayIndex: Int) {
    operator fun plus(increment: Int): Counter {
        return Counter(dayIndex + increment)
    }
}
```

### `in` 操作符

| 表达式 | 转换为 |
| -----------|-------------- |
| `a in b` | `b.contains(a)` |
| `a !in b` | `!b.contains(a)` |

对于 `in` 和 `!in`，过程相同，但实参顺序颠倒。

### 索引访问操作符

| 表达式 | 转换为 |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

方括号会转换为对 `get` 和 `set` 的调用，并带上相应数量的实参。

### `invoke` 操作符

| 表达式 | 转换为 |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

圆括号会转换为对 `invoke` 的调用，并带上相应数量的实参。

### 增广赋值

| 表达式 | 转换为 |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

对于赋值操作，例如 `a += b`，编译器会执行以下步骤：

* 如果右侧列的函数可用：
  * 如果对应的二元函数（即 `plusAssign()` 对应的 `plus()`）也可用，并且 `a` 是一个可变变量，且 `plus` 的返回类型是 `a` 类型的子类型，则报告错误（歧义）。
  * 确保其返回类型为 `Unit`，否则报告错误。
  * 为 `a.plusAssign(b)` 生成代码。
* 否则，尝试为 `a = a + b` 生成代码（这包括一个类型检测：`a + b` 的类型必须是 `a` 的子类型）。

> 赋值在 Kotlin 中*不是*表达式。
>
{style="note"}

### 相等和不相等操作符

| 表达式 | 转换为 |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

这些操作符仅与函数 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 配合使用，该函数可以被覆盖以提供自定义的相等性检测实现。任何其他同名函数（例如 `equals(other: Foo)`）都不会被调用。
当 `==` 表达式中两个操作数均不直接与 `null` 比较且比较的不是两个浮点类型时，Kotlin 会调用 `.equals()`。否则，Kotlin 使用 `===` 进行直接的 `null` 比较，并通过数值比较非空的浮点值。

> `===` 和 `!==`（恒等检测）不可重载，因此没有适用于它们的约定。
>
{style="note"}

`==` 操作是特殊的：它会转换为一个复杂的表达式，用于筛选 `null` 值。`null == null` 始终为 true，而对于非空的 `x`，`x == null` 始终为 false，并且不会调用 `x.equals()`。

### 比较操作符

| 表达式 | 转换为 |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

所有比较都会转换为对 `compareTo` 的调用，该函数要求返回 `Int`。

### 属性委托操作符

`provideDelegate`、`getValue` 和 `setValue` 操作符函数在[委托属性](delegated-properties.md)中进行了描述。

## 命名函数的中缀调用

你可以通过使用[中缀函数调用](functions.md#infix-notation)来模拟自定义的中缀操作。