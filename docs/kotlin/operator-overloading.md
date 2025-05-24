---
title: 运算符重载
---
Kotlin 允许你为类型上预定义的一组运算符提供自定义实现。这些运算符具有预定义的符号表示形式（如 `+` 或 `*`）和优先级。要实现一个运算符，请为相应的类型提供具有特定名称的[成员函数](functions#member-functions)或[扩展函数](extensions)。对于二元运算，此类型将成为左侧类型；对于一元运算，此类型将成为参数类型。

要重载运算符，请使用 `operator` 修饰符标记相应的函数：

```kotlin
interface IndexedContainer {
    operator fun get(index: Int)
}
```
当[重写](inheritance#overriding-methods)你的运算符重载时，你可以省略 `operator`：

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

此表说明，当编译器处理表达式（例如 `+a`）时，它会执行以下步骤：

* 确定 `a` 的类型，假设为 `T`。
* 查找接收者 `T` 的具有 `operator` 修饰符且没有参数的 `unaryPlus()` 函数，这意味着成员函数或扩展函数。
* 如果该函数不存在或不明确，则会发生编译错误。
* 如果该函数存在并且其返回类型为 `R`，则表达式 `+a` 的类型为 `R`。

:::note
这些操作以及所有其他操作都针对[基本类型](basic-types)进行了优化，并且不会为它们引入函数调用的开销。

:::

例如，以下是如何重载一元负号运算符：

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // prints "Point(x=-10, y=-20)"
}
```

### 递增和递减

| 表达式 | 转换为 |
|------------|---------------|
| `a++` | `a.inc()` + 见下文 |
| `a--` | `a.dec()` + 见下文 |

`inc()` 和 `dec()` 函数必须返回一个值，该值将分配给使用 `++` 或 `--` 运算的变量。它们不应改变调用 `inc` 或 `dec` 的对象。

编译器执行以下步骤来解析*后缀*形式的运算符，例如 `a++`：

* 确定 `a` 的类型，假设为 `T`。
* 查找适用于 `T` 类型接收者的具有 `operator` 修饰符且没有参数的 `inc()` 函数。
* 检查该函数的返回类型是否为 `T` 的子类型。

计算表达式的效果是：

* 将 `a` 的初始值存储到临时存储 `a0`。
* 将 `a0.inc()` 的结果赋值给 `a`。
* 返回 `a0` 作为表达式的结果。

对于 `a--`，这些步骤完全类似。

对于*前缀*形式 `++a` 和 `--a`，解析的工作方式相同，效果是：

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

对于此表中的运算，编译器只解析*转换为*列中的表达式。

下面是一个 `Counter` 类示例，该类从给定值开始，并且可以使用重载的 `+` 运算符递增：

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

对于 `in` 和 `!in`，过程相同，但参数的顺序相反。

### 索引访问运算符

| 表达式 | 转换为 |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

方括号被转换为对具有适当数量参数的 `get` 和 `set` 的调用。

### 调用运算符 (invoke operator)

| 表达式 | 转换为 |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

圆括号被转换为对具有适当数量参数的 `invoke` 的调用。

### 增强赋值

| 表达式 | 转换为 |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)` |

对于赋值运算，例如 `a += b`，编译器执行以下步骤：

* 如果右列中的函数可用：
  * 如果相应的二元函数（即 `plusAssign()` 的 `plus()`）也可用，并且 `a` 是一个可变变量，并且 `plus` 的返回类型是 `a` 类型的子类型，则报告错误（不明确）。
  * 确保其返回类型为 `Unit`，否则报告错误。
  * 为 `a.plusAssign(b)` 生成代码。
* 否则，尝试为 `a = a + b` 生成代码（这包括类型检查：`a + b` 的类型必须是 `a` 的子类型）。

:::note
赋值在 Kotlin 中*不是*表达式。

:::

### 相等和不等运算符

| 表达式 | 转换为 |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

这些运算符仅适用于函数 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html)，可以重写该函数以提供自定义相等性检查实现。 任何其他具有相同名称的函数（例如 `equals(other: Foo)`）将不会被调用。

:::note
`===` 和 `!==`（身份检查）不可重载，因此不存在任何约定。

:::

`==` 运算很特殊：它被转换为一个复杂的表达式，用于筛选 `null`。`null == null` 始终为真，并且对于非 null 的 `x`，`x == null` 始终为假，并且不会调用 `x.equals()`。

### 比较运算符

| 表达式 | 转换为 |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

所有比较都转换为对 `compareTo` 的调用，`compareTo` 必须返回 `Int`。

### 属性委托运算符

`provideDelegate`、`getValue` 和 `setValue` 运算符函数在[委托属性](delegated-properties)中描述。

## 命名函数的中缀调用

你可以使用[中缀函数调用](functions#infix-notation)来模拟自定义中缀运算。