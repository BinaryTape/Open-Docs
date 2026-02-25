[//]: # (title: 返回与跳转)

Kotlin 有三种结构化跳转表达式：

* `return` 默认从最内层包含它的函数或[匿名函数](lambdas.md#anonymous-functions)返回。
* `break` 终止最内层包含它的循环。
* `continue` 进入最内层包含它的循环的下一步（迭代）。

所有这些表达式都可以作为更大表达式的一部分使用：

```kotlin
val s = person.name ?: return
```

这些表达式的类型是 [Nothing 类型](exceptions.md#the-nothing-type)。

## Break 与 continue 标签

Kotlin 中的任何表达式都可以用_标签_（label）来标记。
标签的格式为标识符后跟 `@` 符号，例如 `abc@` 或 `fooBar@`。
要为表达式添加标签，只需在其前面添加一个标签即可。

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

现在，你可以使用标签来限定 `break` 或 `continue`：

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

带标签限定的 `break` 会跳转到该标签标记的循环之后的执行点。
`continue` 则推进到该循环的下一次迭代。

> 在某些情况下，你可以*非局部地*（non-locally）应用 `break` 和 `continue`，而无需显式定义标签。
> 这类非局部用法在被包含在[内联函数](inline-functions.md#break-and-continue)中的 lambda表达式中是有效的。
>
{style="note"}

## 返回至标签

在 Kotlin 中，可以使用函数字面量、局部函数和对象表达式来嵌套函数。
限定 `return` 允许你从外部函数返回。

最重要的用例是从 lambda表达式中返回。要从 lambda表达式返回，请对其添加标签并限定 `return`：

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // 局部返回至 lambda 表达式的调用者 —— forEach 循环
        print(it)
    }
    print(" done with explicit label")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

现在，它仅从 lambda表达式中返回。通常使用_隐式标签_会更方便，因为此类标签与传递 lambda 的函数同名。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // 局部返回至 lambda 表达式的调用者 —— forEach 循环
        print(it)
    }
    print(" done with implicit label")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

或者，你可以使用[匿名函数](lambdas.md#anonymous-functions)替代 lambda表达式。
匿名函数中的 `return` 语句将从匿名函数自身返回。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 局部返回至匿名函数的调用者 —— forEach 循环
        print(value)
    })
    print(" done with anonymous function")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

请注意，前三个示例中局部返回的使用与常规循环中 `continue` 的使用类似。

虽然没有直接对应 `break` 的等价物，但可以通过添加一个外层 `run` lambda 并从中进行非局部返回来模拟：

```kotlin
//sampleStart
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // 从传递给 run 的 lambda 进行非局部返回
            print(it)
        }
    }
    print(" done with nested loop")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此处的非局部返回之所以可行，是因为嵌套的 `forEach()` lambda 作为[内联函数](inline-functions.md)运行。

在返回一个值时，解析器会优先选择限定 return：

```kotlin
return@a 1
```

这意味着“在标签 `@a` 处返回 `1`”，而不是“返回一个带标签的表达式 `(@a 1)`”。

> 在某些情况下，你可以在不使用标签的情况下从 lambda表达式返回。此类*非局部*返回位于 lambda 中，但会退出包含它的[内联函数](inline-functions.md#returns)。
>
{style="note"}