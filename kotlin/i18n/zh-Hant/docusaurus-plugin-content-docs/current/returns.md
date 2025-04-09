---
title: "返回與跳轉 (Returns and jumps)"
---
Kotlin 有三種結構跳躍表達式 (structural jump expressions)：

* 預設情況下，`return` 從最近的封閉函數或 [匿名函數](lambdas#anonymous-functions) 返回。
* `break` 終止最近的封閉迴圈。
* `continue` 繼續執行最近的封閉迴圈的下一步。

所有這些表達式都可以用作較大表達式的一部分：

```kotlin
val s = person.name ?: return
```

這些表達式的類型是 [Nothing type](exceptions#the-nothing-type)。

## Break 和 Continue 標籤 (labels)

Kotlin 中的任何表達式都可以用 _標籤 (label)_ 標記。
標籤 (label) 的形式為識別符號後跟 `@` 符號，例如 `abc@` 或 `fooBar@`。
要標記表達式，只需在其前面添加標籤 (label) 即可。

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

現在，您可以使用標籤 (label) 限定 `break` 或 `continue`：

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

帶有標籤 (label) 限定的 `break` 跳轉到標記有該標籤 (label) 的迴圈之後的執行點。
`continue` 繼續執行該迴圈的下一次迭代。

:::note
在某些情況下，您可以 *非本地地 (non-locally)* 應用 `break` 和 `continue`，而無需顯式定義標籤 (label)。
這種非本地用法在封閉 [inline functions](inline-functions#break-and-continue) 中使用的 lambda 表達式中有效。

:::

## Return 到標籤 (labels)

在 Kotlin 中，可以使用函數字面值 (function literals)、本地函數 (local functions) 和物件表達式 (object expressions) 巢狀函數。
限定的 `return` 允許您從外部函數返回。

最重要的用例是從 lambda 表達式返回。要從 lambda 表達式返回，請
標記它並限定 `return`：

```kotlin

fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // local return to the caller of the lambda - the forEach loop
        print(it)
    }
    print(" done with explicit label")
}

fun main() {
    foo()
}
```

現在，它僅從 lambda 表達式返回。通常，使用 _隱式標籤 (implicit labels)_ 更方便，因為此類標籤 (label)
與 lambda 傳遞到的函數具有相同的名稱。

```kotlin

fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // local return to the caller of the lambda - the forEach loop
        print(it)
    }
    print(" done with implicit label")
}

fun main() {
    foo()
}
```

或者，您可以將 lambda 表達式替換為 [匿名函數](lambdas#anonymous-functions)。
匿名函數中的 `return` 語句將從匿名函數本身返回。

```kotlin

fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // local return to the caller of the anonymous function - the forEach loop
        print(value)
    })
    print(" done with anonymous function")
}

fun main() {
    foo()
}
```

請注意，前三個範例中本地返回的使用方式與常規迴圈中 `continue` 的使用方式相似。

沒有 `break` 的直接等效項，但可以通過添加另一個巢狀 lambda 並從中非本地返回來模擬它：

```kotlin

fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // non-local return from the lambda passed to run
            print(it)
        }
    }
    print(" done with nested loop")
}

fun main() {
    foo()
}
```

當返回一個值時，解析器 (parser) 優先選擇限定的 return：

```kotlin
return@a 1
```

這表示 "在標籤 (label) `@a` 處返回 `1`"，而不是 "返回標記的表達式 `(@a 1)`"。

:::note
在某些情況下，您可以從 lambda 表達式返回而無需使用標籤 (label)。這種 *非本地 (non-local)* 返回位於
lambda 中，但會退出封閉的 [inline function](inline-functions#returns)。

:::