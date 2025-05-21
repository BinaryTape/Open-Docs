---
title: 返回值和跳转
---
Kotlin 有三种结构跳转表达式：

* `return` 默认从最近的封闭函数或[匿名函数](lambdas#anonymous-functions)返回。
* `break` 终止最近的封闭循环。
* `continue` 继续执行最近的封闭循环的下一次迭代。

所有这些表达式都可以用作更大表达式的一部分：

```kotlin
val s = person.name ?: return
```

这些表达式的类型是 [Nothing 类型](exceptions#the-nothing-type)。

## Break 和 continue 标签

Kotlin 中的任何表达式都可以用 _标签_ 标记。
标签的形式是标识符后跟 `@` 符号，例如 `abc@` 或 `fooBar@`。
要标记一个表达式，只需在其前面添加一个标签。

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

用标签限定的 `break` 会跳转到该标签标记的循环之后的执行点。
`continue` 则继续执行该循环的下一次迭代。

:::note
在某些情况下，你可以 *非局部地（non-locally）* 应用 `break` 和 `continue`，而无需显式定义标签。
这种非局部用法在封闭 [内联函数](inline-functions#break-and-continue) 中使用的 lambda 表达式中有效。

:::

## Return 到标签

在 Kotlin 中，可以使用函数字面值（function literals）、局部函数（local functions）和对象表达式（object expressions）嵌套函数。
带限定符的 `return` 允许你从外部函数返回。

最重要的用例是从 lambda 表达式返回。要从 lambda 表达式返回，
标记它并限定 `return`：

```kotlin

fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // 局部返回到 lambda 的调用者 - forEach 循环
        print(it)
    }
    print(" done with explicit label")
}

fun main() {
    foo()
}
```

现在，它仅从 lambda 表达式返回。通常，使用_隐式标签_更方便，因为这种标签
与传递 lambda 的函数同名。

```kotlin

fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // 局部返回到 lambda 的调用者 - forEach 循环
        print(it)
    }
    print(" done with implicit label")
}

fun main() {
    foo()
}
```

或者，你可以使用[匿名函数](lambdas#anonymous-functions)替换 lambda 表达式。
匿名函数中的 `return` 语句将从匿名函数本身返回。

```kotlin

fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 局部返回到匿名函数的调用者 - forEach 循环
        print(value)
    })
    print(" done with anonymous function")
}

fun main() {
    foo()
}
```

请注意，前三个示例中局部返回的使用类似于在常规循环中使用 `continue`。

没有与 `break` 的直接等效项，但是可以通过添加另一个嵌套 lambda 并从其中非局部返回来模拟它：

```kotlin

fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // 从传递给 run 的 lambda 非局部返回
            print(it)
        }
    }
    print(" done with nested loop")
}

fun main() {
    foo()
}
```

当返回一个值时，解析器会优先选择带限定符的 return：

```kotlin
return@a 1
```

这意味着 "在 `@a` 标签处返回 `1`"，而不是 "返回一个带标签的表达式 `(@a 1)`"。

:::note
在某些情况下，你可以在不使用标签的情况下从 lambda 表达式返回。这种 *非局部* 返回位于
lambda 中，但会退出封闭的 [内联函数](inline-functions#returns)。

:::