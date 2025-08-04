[//]: # (title: 条件与循环)

## If 表达式

在 Kotlin 中，`if` 是一种表达式：它会返回一个值。
因此，Kotlin 没有三元操作符（`condition ? then : else`），因为普通的 `if` 就能很好地胜任这个角色。

```kotlin
fun main() {
    val a = 2
    val b = 3

    //sampleStart
    var max = a
    if (a < b) max = b

    // With else
    if (a > b) {
      max = a
    } else {
      max = b
    }

    // As expression
    max = if (a > b) a else b

    // You can also use `else if` in expressions:
    val maxLimit = 1
    val maxOrLimit = if (maxLimit > a) maxLimit else if (a > b) a else b
  
    println("max is $max")
    // max is 3
    println("maxOrLimit is $maxOrLimit")
    // maxOrLimit is 3
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-if-kotlin"}

`if` 表达式的分支可以是代码块。在这种情况下，最后一个表达式就是该代码块的值：

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

如果你将 `if` 作为表达式使用（例如，用于返回其值或将其赋值给一个变量），那么 `else` 分支是强制性的。

## When 表达式与语句

`when` 是一种条件表达式，它根据多个可能的值或条件来运行代码。它类似于 Java、C 及类似语言中的 `switch` 语句。例如：

```kotlin
fun main() {
    //sampleStart
    val x = 2
    when (x) {
        1 -> print("x == 1")
        2 -> print("x == 2")
        else -> print("x is neither 1 nor 2")
    }
    // x == 2
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-conditions-when-statement"}

`when` 会将其实参按顺序与所有分支进行匹配，直到某个分支条件得到满足。

你可以通过几种不同的方式使用 `when`。首先，你可以将 `when` 用作**表达式**或**语句**。作为表达式，`when` 会返回一个值供代码后续使用。作为语句，`when` 会完成一个动作，而不返回任何进一步使用的值：

<table>
   <tr>
       <td>表达式</td>
       <td>语句</td>
   </tr>
   <tr>
<td>

```kotlin
// Returns a string assigned to the 
// text variable
val text = when (x) {
    1 -> "x == 1"
    2 -> "x == 2"
    else -> "x is neither 1 nor 2"
}
```

</td>
<td>

```kotlin
// Returns nothing but triggers a 
// print statement
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> print("x is neither 1 nor 2")
}
```

</td>
</tr>
</table>

其次，你可以带主题（subject）使用 `when`，也可以不带主题使用。无论你是否带主题使用 `when`，你的表达式或语句行为都相同。我们建议尽可能带主题使用 `when`，因为这样可以清晰地表明你在检测什么，从而使你的代码更易于阅读和维护。

<table>
   <tr>
       <td>带主题 <code>x</code></td>
       <td>不带主题</td>
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

根据你使用 `when` 的方式，对是否需要覆盖所有可能的分支情况有不同的要求。

如果你将 `when` 用作语句，则不必覆盖所有可能的情况。在此示例中，有些情况没有被覆盖，因此什么也不会发生。但是，不会出现错误：

```kotlin
fun main() {
    //sampleStart
    val x = 3
    when (x) {
        // Not all cases are covered
        1 -> print("x == 1")
        2 -> print("x == 2")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

在 `when` 语句中，单个分支的值会被忽略。就像 `if` 一样，每个分支都可以是一个代码块，并且其值是该代码块中最后一个表达式的值。

如果你将 `when` 用作表达式，则必须覆盖所有可能的情况。换句话说，它必须是 _穷尽的_。第一个匹配分支的值将成为整个表达式的值。如果你没有覆盖所有情况，编译器会抛出错误。

如果你的 `when` 表达式有主题，你可以使用 `else` 分支来确保覆盖所有可能的情况，但这不是强制性的。例如，如果你的主题是 `Boolean`、[`enum` 类](enum-classes.md)、[`sealed` 类](sealed-classes.md)或其可空对应类型之一，你可以在没有 `else` 分支的情况下覆盖所有情况：

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
    // No else branch is needed because all cases are covered
    Bit.ZERO -> 0
    Bit.ONE -> 1
}
```

> 为了简化 `when` 表达式并减少重复，请尝试上下文敏感解析（目前处于预览阶段）。
> 此特性允许你在 `when` 表达式中，当已知预期类型时，在使用枚举条目或密封类成员时省略类型名称。
> 
> 关于更多信息，关于 [上下文敏感解析的预览](whatsnew22.md#preview-of-context-sensitive-resolution) 或相关的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md) 请参见。
> 
{style="tip"}

如果你的 `when` 表达式**没有**主题，你**必须**有一个 `else` 分支，否则编译器会抛出错误。当所有其他分支条件都不满足时，`else` 分支会被求值：

```kotlin
val message = when {
    a > b -> "a is greater than b"
    a < b -> "a is less than b"
    else -> "a is equal to b"
}
```

`when` 表达式和语句提供了不同的方式来简化你的代码、处理多个条件并执行类型检测。

你可以通过在单行中使用逗号组合多个条件来定义它们的共同行为：

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

你可以使用任意表达式（不限于常量）作为分支条件：

```kotlin
when (x) {
    s.toInt() -> print("s encodes x")
    else -> print("s does not encode x")
}
```

你还可以通过 `in` 或 `!in` 关键字检测一个值是否包含在[区间](ranges.md)或集合中：

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

此外，你还可以通过 `is` 或 `!is` 关键字检测一个值是否为特定类型。请注意，由于[智能类型转换](typecasts.md#smart-casts)，你可以直接访问该类型的成员函数和属性，而无需进行任何额外的检测。

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

你可以使用 `when` 来替代 `if`-`else` `if` 链。
如果没有主题，分支条件就只是布尔表达式。第一个条件为 `true` 的分支会运行：

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is odd")
}
```

你可以使用以下语法将主题捕获到一个变量中：

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success -> response.body
        is HttpError -> throw HttpException(response.status)
    }
```

作为主题引入的变量的作用域仅限于 `when` 表达式或语句的主体。

### when 表达式中的守卫条件

守卫条件允许你在 `when` 表达式的分支中包含多个条件，从而使复杂的控制流更加显式和简洁。你可以在带主题的 `when` 表达式或语句中使用守卫条件。

要在分支中包含守卫条件，请将其放置在主条件之后，用 `if` 分隔：

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // 仅包含主条件的分支。当 `animal` 是 `Dog` 时调用 `feedDog()`。
        is Animal.Dog -> feedDog()
        // 同时包含主条件和守卫条件的分支。当 `animal` 是 `Cat` 且不是 `mouseHunter` 时调用 `feedCat()`。
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // 如果以上条件均不匹配，则打印 "Unknown animal"
        else -> println("Unknown animal")
    }
}
```

在单个 `when` 表达式中，你可以结合使用带守卫条件和不带守卫条件的分支。带守卫条件的分支中的代码只有当主条件和守卫条件都求值为 true 时才会运行。如果主条件不匹配，守卫条件将不会被求值。

如果你在不带 `else` 分支的 `when` 语句中使用守卫条件，并且没有条件匹配，则任何分支都不会被执行。

否则，如果你在不带 `else` 分支的 `when` 表达式中使用守卫条件，编译器会要求你声明所有可能的情况，以避免运行时错误。

此外，守卫条件支持 `else if`：

```kotlin
when (animal) {
    // 检测 `animal` 是否为 `Dog`
    is Animal.Dog -> feedDog()
    // 守卫条件，检测 `animal` 是否为 `Cat` 且不是 `mouseHunter`
    is Animal.Cat if !animal.mouseHunter -> feedCat()
    // 如果以上条件均不匹配且 animal.eatsPlants 为 true，则调用 giveLettuce()
    else if animal.eatsPlants -> giveLettuce()
    // 如果以上条件均不匹配，则打印 "Unknown animal"
    else -> println("Unknown animal")
}
```

可以使用布尔操作符 `&&` (AND) 或 `||` (OR) 在单个分支中组合多个守卫条件。请使用圆括号将布尔表达式括起来以[避免混淆](coding-conventions.md#guard-conditions-in-when-expression)：

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

你可以在任何带有主题的 `when` 表达式或语句中使用守卫条件，但你使用逗号分隔多个条件的情况除外。例如，`0, 1 -> print("x == 0 or x == 1")`。

## For 循环

`for` 循环遍历任何提供迭代器的事物。这等同于 C# 等语言中的 `foreach` 循环。`for` 的语法如下：

```kotlin
for (item in collection) print(item)
```

`for` 的主体可以是一个代码块。

```kotlin
for (item: Int in ints) {
    // ...
}
```

如前所述，`for` 会遍历任何提供迭代器的事物。这意味着它：

* 拥有一个成员函数或扩展函数 `iterator()`，该函数返回 `Iterator<T>`，并且：
  * 拥有一个成员函数或扩展函数 `next()`
  * 拥有一个成员函数或扩展函数 `hasNext()`，该函数返回 `Boolean`。

所有这三个函数都需要标记为 `operator`。

要遍历数字[区间](ranges.md)，请使用区间表达式：

```kotlin
fun main() {
//sampleStart
    for (i in 1..3) {
        print(i)
    }
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // 1236420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

遍历区间或数组的 `for` 循环会被编译为基于索引的循环，而不会创建迭代器对象。

如果你想通过索引遍历数组或 `list`，可以这样做：

```kotlin
fun main() {
val array = arrayOf("a", "b", "c")
//sampleStart
    for (i in array.indices) {
        print(array[i])
    }
    // abc
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

另外，你可以使用 `withIndex` 库函数：

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")
//sampleStart
    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
    // the element at 0 is a
    // the element at 1 is b
    // the element at 2 is c
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## While 循环

`while` 和 `do-while` 循环在条件满足时持续处理其主体。
它们之间的区别在于条件检测的时机：
* `while` 会检测条件，如果条件满足，则处理主体，然后返回条件检测。
* `do-while` 会处理主体，然后检测条件。如果条件满足，循环将重复。因此，无论条件如何，`do-while` 的主体至少会运行一次。

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y 在此处可见！
```

## 循环中的 Break 与 Continue

Kotlin 支持循环中传统的 `break` 和 `continue` 操作符。关于更多信息，请参见 [返回与跳转](returns.md)。