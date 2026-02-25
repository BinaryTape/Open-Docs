[//]: # (title: 运算符重载)

Kotlin 允许你为类型上预定义的一组运算符提供自定义实现。这些运算符具有预定义的符号表示（如 `+` 或 `*`）和优先级。要实现一个运算符，请为相应的类型提供一个具有特定名称的[成员函数](functions.md#member-functions)或[扩展方法](extensions.md)。该类型将成为二元运算的左侧类型以及一元运算的实参类型。

要重载运算符，需使用 `operator` 修饰符标记相应的函数：

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
在[重写](inheritance.md#overriding-methods)你的运算符重载时，可以省略 `operator`：

```kotlin
class OrdersList: IndexedContainer {
    override fun get(index: Int) { /*...*/ }   
}
```

## 一元运算

### 一元前缀运算符

| 表达式 | 转换为 |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

这张表说明，当编译器处理例如表达式 `+a` 时，它会执行以下步骤：

* 确定 `a` 的类型，假设为 `T`。
* 在接收者 `T` 中查找带有 `operator` 修饰符且无参数的函数 `unaryPlus()`，它可以是成员函数或扩展方法。
* 如果该函数不存在或存在歧义，则会导致编译错误。
* 如果该函数存在且其返回值类型为 `R`，则表达式 `+a` 的类型为 `R`。

> 这些运算以及所有其他运算，都针对[基本类型](types-overview.md)进行了优化，不会为它们引入函数调用的开销。
>
{style="note"}

例如，以下是你如何重载一元负号运算符：

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // 输出 "Point(x=-10, y=-20)"
}
```
{kotlin-runnable="true"}

### 自增与自减

| 表达式 | 转换为 |
|------------|---------------|
| `a++` | `a.inc()` + 详见下文 |
| `a--` | `a.dec()` + 详见下文 |

`inc()` 和 `dec()` 函数必须返回一个值，该值将被赋值给使用 `++` 或 `--` 运算的变量。它们不应修改调用 `inc` 或 `dec` 的对象。

编译器执行以下步骤来解析 *后缀* 形式的运算符，例如 `a++`：

* 确定 `a` 的类型，假设为 `T`。
* 查找带有 `operator` 修饰符且无参数的函数 `inc()`，该函数适用于类型为 `T` 的接收者。
* 检查函数的返回值类型是否是 `T` 的子类型。

计算表达式的效果是：

* 将 `a` 的初始值存储到临时存储区 `a0`。
* 将 `a0.inc()` 的结果赋值给 `a`。
* 返回 `a0` 作为表达式的结果。

对于 `a--`，其步骤完全类比。

对于 *前缀* 形式 `++a` 和 `--a`，解析方式相同，效果为：

* 将 `a.inc()` 的结果赋值给 `a`。
* 返回 `a` 的新值作为表达式的结果。

## 二元运算

### 算术运算符

| 表达式 | 转换为 |
| -----------|-------------- |
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `a % b` | `a.rem(b)` |
| `a..b` | `a.rangeTo(b)` |
| `a..<b` | `a.rangeUntil(b)` |

对于此表中的运算，编译器只是将表达式解析为“转换为”列中的调用。

下面是一个示例 `Counter` 类，它从给定值开始，并可以使用重载的 `+` 运算符进行递增：

```kotlin
data class Counter(val dayIndex: Int) {
    operator fun plus(increment: Int): Counter {
        return Counter(dayIndex + increment)
    }
}
```

### in 运算符

| 表达式 | 转换为 |
| -----------|-------------- |
| `a in b` | `b.contains(a)` |
| `a !in b` | `!b.contains(a)` |

对于 `in` 和 `!in`，处理过程相同，但实参的顺序相反。

### 索引访问运算符

| 表达式 | 转换为 |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

方括号会被转换为对 `get` 和 `set` 的调用，并带有相应数量的实参。

### invoke 运算符

| 表达式 | 转换为 |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

圆括号会被转换为对 `invoke` 的调用，并带有相应数量的实参。

### 复合赋值

| 表达式 | 转换为 |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

对于赋值运算，例如 `a += b`，编译器会执行以下步骤：

* 如果右列中的函数可用：
  * 如果相应的二元函数（即 `plusAssign()` 对应的 `plus()`）也可用，且 `a` 是一个可变变量，且 `plus` 的返回值类型是 `a` 类型的子类型，则报告错误（歧义）。
  * 确保其返回值类型为 `Unit`，否则报告错误。
  * 生成 `a.plusAssign(b)` 的代码。
* 否则，尝试生成 `a = a + b` 的代码（这包括类型检查：`a + b` 的类型必须是 `a` 的子类型）。

> 在 Kotlin 中，赋值**不是**表达式。
>
{style="note"}

### 相等与不等运算符

| 表达式 | 转换为 |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

这些运算符仅适用于函数 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html)，你可以重写该函数以提供自定义的相等性检查实现。任何其他同名函数（如 `equals(other: Foo)`）都会被忽略。

当 `==` 表达式中两个操作数都不直接与 `null` 比较，且比较的不是两个浮点类型时，Kotlin 会调用 `.equals()`。否则，对于直接的 `null` 比较，Kotlin 使用 `===`；对于非 null 的浮点值比较，则按数值进行。

> `===` 和 `!==`（引用相等检查）是不可重载的，因此它们没有约定。
>
{style="note"}

### 比较运算符

| 表达式 | 转换为 |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

所有比较都会转换为对 `compareTo` 的调用，该函数要求返回 `Int`。

### 属性委托运算符

`provideDelegate`、`getValue` 和 `setValue` 运算符函数在[委托属性](delegated-properties.md)中详细说明。

## 具名函数的中缀调用

你可以通过使用[中缀函数调用](functions.md#infix-notation)来模拟自定义的中缀运算。