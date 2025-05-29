[//]: # (title: 返回与跳转)

Kotlin 有三种结构化跳转表达式：

*   `return` 默认从最近的封闭函数或[匿名函数](lambdas.md#anonymous-functions)返回。
*   `break` 终止最近的封闭循环。
*   `continue` 继续最近的封闭循环的下一步。

所有这些表达式都可以作为更大表达式的一部分使用：

```kotlin
val s = person.name ?: return
```

这些表达式的类型是 [Nothing 类型](exceptions.md#the-nothing-type)。

## Break 和 Continue 标签

Kotlin 中的任何表达式都可以用_标签_标记。
标签的形式是标识符后跟 `@` 符号，例如 `abc@` 或 `fooBar@`。
要标记表达式，只需在其前面添加一个标签。

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

现在，你可以用标签限定 `break` 或 `continue`：

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

用标签限定的 `break` 会跳到标记该标签的循环之后的执行点。
用标签限定的 `continue` 会继续该循环的下一次迭代。

> 在某些情况下，你可以在不显式定义标签的情况下_非局部地_应用 `break` 和 `continue`。
> 这种非局部用法在封闭的[内联函数](inline-functions.md#break-and-continue)中使用的 lambda 表达式中是有效的。
>
{style="note"}

## 返回到标签

在 Kotlin 中，函数可以使用函数字面量、局部函数和对象表达式进行嵌套。
限定的 `return` 允许你从外部函数返回。

最重要的用例是从 lambda 表达式返回。要从 lambda 表达式返回，
请对其添加标签并限定 `return`：

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // local return to the caller of the lambda - the forEach loop
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

现在，它只从 lambda 表达式返回。通常使用_隐式标签_更方便，因为此类标签
与传递 lambda 的函数同名。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // local return to the caller of the lambda - the forEach loop
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

或者，你可以用[匿名函数](lambdas.md#anonymous-functions)替换 lambda 表达式。
匿名函数中的 `return` 语句将从匿名函数本身返回。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // local return to the caller of the anonymous function - the forEach loop
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

请注意，前三个示例中局部返回的使用类似于常规循环中 `continue` 的使用。

没有直接等效的 `break`，但可以通过添加另一个嵌套 lambda 并从中非局部返回来模拟它：

```kotlin
//sampleStart
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // non-local return from the lambda passed to run
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

当返回一个值时，解析器优先考虑限定返回：

```kotlin
return@a 1
```

这意味着“在标签 `@a` 处返回 `1`”，而不是“返回一个带标签的表达式 `(@a 1)`”。

> 在某些情况下，你可以在不使用标签的情况下从 lambda 表达式返回。这种_非局部_返回位于 lambda 中，但会退出封闭的[内联函数](inline-functions.md#returns)。
>
{style="note"}