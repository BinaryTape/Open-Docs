[//]: # (title: 返回与跳转)

Kotlin 有三种结构化跳转表达式：

*   `return` 默认从最近的封闭函数或[匿名函数](lambdas.md#anonymous-functions)返回。
*   `break` 终止最近的封闭循环。
*   `continue` 跳转到最近的封闭循环的下一步。

所有这些表达式都可以作为更大表达式的一部分使用：

```kotlin
val s = person.name ?: return
```

这些表达式的类型是 [Nothing 类型](exceptions.md#the-nothing-type)。

## Break 与 continue 标签

Kotlin 中的任何表达式都可以用_标签_标记。
标签的形式是一个标识符后跟 `@` 符号，例如 `abc@` 或 `fooBar@`。
要给表达式添加标签，只需在它前面加上一个标签。

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

使用标签限定的 `break` 会跳转到标记了该标签的循环之后的执行点。
一个 `continue` 则会跳转到该循环的下一次迭代。

> 在某些情况下，你可以在不显式定义标签的情况下*非局部地*应用 `break` 和 `continue`。
> 这种非局部用法在封闭的[内联函数](inline-functions.md#break-and-continue)中使用的 lambda 表达式中有效。
>
{style="note"}

## 返回到标签

在 Kotlin 中，函数可以使用函数字面量、局部函数和对象表达式进行嵌套。
限定 `return` 允许你从外部函数返回。

最重要的用例是从 lambda 表达式返回。要从 lambda 表达式返回，请给它加标签并限定 `return`：

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // 局部返回到 lambda 的调用者 - forEach 循环
        print(it)
    }
    print(" 完成，使用显式标签")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

现在，它只从 lambda 表达式返回。通常使用_隐式标签_更方便，因为这种标签与 lambda 传递的函数同名。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // 局部返回到 lambda 的调用者 - forEach 循环
        print(it)
    }
    print(" 完成，使用隐式标签")
}
//end

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
        if (value == 3) return  // 局部返回到匿名函数的调用者 - forEach 循环
        print(value)
    })
    print(" 完成，使用匿名函数")
}
//end

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

请注意，前面三个例子中局部返回的用法类似于常规循环中 `continue` 的用法。

没有直接等同于 `break` 的用法，但可以通过添加一个外部 `run` lambda 并从其中进行非局部返回来模拟它：

```kotlin
//sampleStart
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // 从传递给 run 的 lambda 进行非局部返回
            print(it)
        }
    }
    print(" 完成，使用嵌套循环")
}
//end

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

这里的非局部返回之所以可能，是因为嵌套的 `forEach()` lambda 充当了[内联函数](inline-functions.md)。

当返回一个值时，解析器优先考虑限定返回：

```kotlin
return@a 1
```

这意味着“在标签 `@a` 处返回 `1`”，而不是“返回一个带标签的表达式 `(@a 1)`”。

> 在某些情况下，你可以在不使用标签的情况下从 lambda 表达式返回。这种*非局部*返回位于 lambda 中，但会退出封闭的[内联函数](inline-functions.md#returns)。
>
{style="note"}