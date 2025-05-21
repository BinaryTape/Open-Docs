---
title: 条件语句和循环
---
## If 表达式

在 Kotlin 中，`if` 是一种表达式：它会返回一个值。
因此，这里没有三元运算符（`condition ? then : else`），因为普通的 `if` 在这个角色中也能很好地工作。

```kotlin
fun main() {
    val a = 2
    val b = 3

    var max = a
    if (a < b) max = b

    // 带 else
    if (a > b) {
      max = a
    } else {
      max = b
    }

    // 作为表达式
    max = if (a > b) a else b

    // 你也可以在表达式中使用 `else if`：
    val maxLimit = 1
    val maxOrLimit = if (maxLimit > a) maxLimit else if (a > b) a else b
  
    println("max is $max")
    // max is 3
    println("maxOrLimit is $maxOrLimit")
    // maxOrLimit is 3

}
```

`if` 表达式的分支可以是代码块。在这种情况下，最后一个表达式是代码块的值：

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

如果你使用 `if` 作为表达式，例如，用于返回它的值或将其赋值给一个变量，那么 `else` 分支是强制性的。

## When 表达式和语句

`when` 是一个条件表达式，它基于多个可能的值或条件运行代码。它类似于 Java、C 和类似语言中的 `switch` 语句。例如：

```kotlin
fun main() {

    val x = 2
    when (x) {
        1 `->` print("x == 1")
        2 `->` print("x == 2")
        else `->` print("x is neither 1 nor 2")
    }
    // x == 2

}
```

`when` 按照顺序将它的参数与所有分支进行匹配，直到满足某个分支条件。

你可以通过几种不同的方式使用 `when`。首先，你可以将 `when` 用作**表达式**或**语句**。
作为表达式，`when` 返回一个值，以便稍后在你的代码中使用。作为语句，`when` 完成一个动作，
而不返回任何进一步使用的内容：
<table>
<tr>
<td>
表达式
</td>
<td>
语句
</td>
</tr>
<tr>
<td>

```kotlin
// 返回一个字符串，并将其赋值给
// text 变量
val text = when (x) {
    1 `->` "x == 1"
    2 `->` "x == 2"
    else `->` "x is neither 1 nor 2"
}
```
</td>
<td>

```kotlin
// 不返回任何内容，但会触发一个
// print 语句
when (x) {
    1 `->` print("x == 1")
    2 `->` print("x == 2")
    else `->` print("x is neither 1 nor 2")
}
```
</td>
</tr>
</table>

其次，你可以使用带主语或不带主语的 `when`。无论你是否将主语与 `when` 一起使用，你的表达式或
语句的行为都相同。我们建议尽可能使用带主语的 `when`，因为它通过清楚地显示你要检查的内容，使你的代码更易于阅读
和维护。
<table>
<tr>
<td>
带主语 `x`
</td>
<td>
不带主语
</td>
</tr>
<tr>
<td>

```kotlin
when(x) { ... }
```
</td>
<td>

```kotlin
when { ... }
```
</td>
</tr>
</table>

根据你使用 `when` 的方式，对于是否需要在你的分支中覆盖所有可能的情况，有不同的要求。

如果你使用 `when` 作为语句，则不必覆盖所有可能的情况。在本例中，某些情况未被覆盖，
因此没有任何事情发生。但是，不会发生错误：

```kotlin
fun main() {

    val x = 3
    when (x) {
        // 并非所有情况都被覆盖
        1 `->` print("x == 1")
        2 `->` print("x == 2")
    }

}
```

在 `when` 语句中，单个分支的值将被忽略。与 `if` 类似，每个分支都可以是一个代码块，
并且它的值是该代码块中最后一个表达式的值。

如果你使用 `when` 作为表达式，则必须覆盖所有可能的情况。换句话说，它必须是_详尽的_。
第一个匹配的分支的值成为整个表达式的值。如果你没有覆盖所有情况，
编译器会抛出一个错误。

如果你的 `when` 表达式有一个主语，你可以使用一个 `else` 分支来确保所有可能的情况都被覆盖，但
它不是强制性的。例如，如果你的主语是一个 `Boolean`，[`enum` 类](enum-classes)，[`sealed` 类](sealed-classes)，
或它们的nullable副本之一，你可以在没有 `else` 分支的情况下覆盖所有情况：

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
  // 不需要 else 分支，因为所有情况都被覆盖
    Bit.ZERO `->` 0
    Bit.ONE `->` 1
}
```

如果你的 `when` 表达式**没有**主语，你**必须**有一个 `else` 分支，否则编译器会抛出一个错误。
当没有其他分支条件满足时，将评估 `else` 分支：

```kotlin
when {
    a > b `->` "a is greater than b"
    a < b `->` "a is less than b"
    else `->` "a is equal to b"
}
```

`when` 表达式和语句提供了不同的方式来简化你的代码、处理多个条件以及执行
类型检查。

你可以通过在一行中使用逗号组合它们的条件来为多个案例定义一个通用行为：

```kotlin
when (x) {
    0, 1 `->` print("x == 0 or x == 1")
    else `->` print("otherwise")
}
```

你可以使用任意表达式（不仅仅是常量）作为分支条件：

```kotlin
when (x) {
    s.toInt() `->` print("s encodes x")
    else `->` print("s does not encode x")
}
```

你还可以通过 `in` 或 `!in` 关键字检查一个值是否包含在 [范围](ranges) 或集合中：

```kotlin
when (x) {
    in 1..10 `->` print("x is in the range")
    in validNumbers `->` print("x is valid")
    !in 10..20 `->` print("x is outside the range")
    else `->` print("none of the above")
}
```

此外，你可以通过 `is` 或 `!is` 关键字检查一个值是否是特定类型。请注意，
由于 [智能转换](typecasts#smart-casts)，你可以访问该类型的成员函数和属性，而无需
任何额外的检查。

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String `->` x.startsWith("prefix")
    else `->` false
}
```

你可以使用 `when` 作为 `if`-`else` `if` 链的替代品。
如果没有主语，分支条件就只是布尔表达式。第一个条件为 `true` 的分支会运行：

```kotlin
when {
    x.isOdd() `->` print("x is odd")
    y.isEven() `->` print("y is even")
    else `->` print("x+y is odd")
}
```

你可以通过使用以下语法在变量中捕获主语：

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success `->` response.body
        is HttpError `->` throw HttpException(response.status)
    }
```

作为主语引入的变量的作用域仅限于 `when` 表达式或语句的主体。

### When 表达式中的守卫条件

:::note
守卫条件是一个 [实验性功能](components-stability#stability-levels-explained)，随时可能更改。
我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140/Guard-conditions-in-when-expressions-feedback) 中提供的反馈。

守卫条件允许你在 `when` 表达式的分支中包含多个条件，从而使复杂的控制流更加明确和简洁。
你可以在带有主语的 `when` 表达式或语句中使用守卫条件。

要在分支中包含守卫条件，请将其放在主要条件之后，用 `if` 分隔：

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // 仅包含主要条件的分支。当 `Animal` 是 `Dog` 时调用 `feedDog()`
        is Animal.Dog `->` feedDog()
        // 包含主要条件和守卫条件的分支。当 `Animal` 是 `Cat` 且不是 `mouseHunter` 时调用 `feedCat()`
        is Animal.Cat if !animal.mouseHunter `->` feedCat()
        // 如果以上条件均不匹配，则打印“Unknown animal”
        else `->` println("Unknown animal")
    }
}
```

在单个 `when` 表达式中，你可以组合包含和不包含守卫条件的分支。
只有当主要条件和守卫条件都评估为 true 时，才运行包含守卫条件的分支中的代码。
如果主要条件不匹配，则不评估守卫条件。

如果你在没有 `else` 分支的 `when` 语句中使用守卫条件，并且没有一个条件匹配，则不执行任何分支。

否则，如果你在没有 `else` 分支的 `when` 表达式中使用守卫条件，则编译器要求你声明所有可能的情况以避免运行时错误。

此外，守卫条件支持 `else if`：

```kotlin
when (animal) {
    // 检查 `animal` 是否为 `Dog`
    is Animal.Dog `->` feedDog()
    // 守卫条件，检查 `animal` 是否为 `Cat` 且不是 `mouseHunter`
    is Animal.Cat if !animal.mouseHunter `->` feedCat()
    // 如果以上条件均不匹配且 animal.eatsPlants 为 true，则调用 giveLettuce()
    else if animal.eatsPlants `->` giveLettuce()
    // 如果以上条件均不匹配，则打印“Unknown animal”
    else `->` println("Unknown animal")
}
```

使用布尔运算符 `&&`（AND）或 `||`（OR）在单个分支中组合多个守卫条件。
在布尔表达式周围使用括号以 [避免混淆](coding-conventions#guard-conditions-in-when-expression)：

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) `->` feedCat()
}
```

你可以在任何带有主语的 `when` 表达式或语句中使用守卫条件，除非你有用逗号分隔的多个条件。
例如，`0, 1 `->` print("x == 0 or x == 1")`。

要在 CLI 中启用守卫条件，请运行以下命令：

`kotlinc -Xwhen-guards main.kt`

要在 Gradle 中启用守卫条件，请将以下行添加到 `build.gradle.kts` 文件中：

`kotlin.compilerOptions.freeCompilerArgs.add("-Xwhen-guards")`

:::

## For 循环

`for` 循环遍历任何提供迭代器的东西。这等效于 C# 等语言中的 `foreach` 循环。
`for` 的语法如下：

```kotlin
for (item in collection) print(item)
```

`for` 的主体可以是一个代码块。

```kotlin
for (item: Int in ints) {
    // ...
}
```

如前所述，`for` 遍历任何提供迭代器的东西。这意味着它：

* 具有一个成员或扩展函数 `iterator()`，它返回 `Iterator<>`，其中：
  * 具有一个成员或扩展函数 `next()`
  * 具有一个成员或扩展函数 `hasNext()`，它返回 `Boolean`。

所有这三个函数都需要标记为 `operator`。

要遍历一个数字范围，请使用一个 [范围表达式](ranges)：

```kotlin
fun main() {

    for (i in 1..3) {
        print(i)
    }
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // 1236420

}
```

对范围或数组的 `for` 循环被编译为基于索引的循环，该循环不创建迭代器对象。

如果你想用索引遍历一个数组或列表，你可以这样做：

```kotlin
fun main() {
val array = arrayOf("a", "b", "c")

    for (i in array.indices) {
        print(array[i])
    }
    // abc

}
```

或者，你可以使用 `withIndex` 库函数：

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")

    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
    // the element at 0 is a
    // the element at 1 is b
    // the element at 2 is c

}
```

## While 循环

`while` 和 `do-while` 循环在其条件满足时连续处理其主体。
它们之间的区别在于条件检查时间：
* `while` 检查条件，如果满足条件，则处理主体，然后返回到条件检查。
* `do-while` 处理主体，然后检查条件。如果满足条件，则循环重复。因此，`do-while` 的主体
至少运行一次，无论条件如何。

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y 在这里可见！
```

## 循环中的 Break 和 Continue

Kotlin 支持循环中的传统 `break` 和 `continue` 运算符。请参阅 [返回和跳转](returns)。