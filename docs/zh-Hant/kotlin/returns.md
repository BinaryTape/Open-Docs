[//]: # (title: 回傳與跳轉)

Kotlin 擁有三個結構化跳轉表達式：

*   `return` 預設會從最接近的函式或[匿名函式](lambdas.md#anonymous-functions)返回。
*   `break` 會終止最接近的迴圈。
*   `continue` 會繼續執行最接近迴圈的下一個步驟。

所有這些表達式都可以作為更大表達式的一部分使用：

```kotlin
val s = person.name ?: return
```

這些表達式的類型是 [Nothing 型別](exceptions.md#the-nothing-type)。

## break 和 continue 標籤

Kotlin 中的任何表達式都可以使用_標籤_來標記。
標籤的形式是一個識別符號後跟 `@` 符號，例如 `abc@` 或 `fooBar@`。
要標記一個表達式，只需在其前面添加一個標籤即可。

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

現在，你可以使用標籤來限定 `break` 或 `continue`：

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

使用標籤限定的 `break` 會跳轉到標記該標籤的迴圈執行點之後。
而 `continue` 則會繼續該迴圈的下一個迭代。

> 在某些情況下，您可以在不明確定義標籤的情況下，*非局部地*應用 `break` 和 `continue`。
> 此類非局部用法在用於封閉[內聯函式](inline-functions.md#break-and-continue)的 Lambda 表達式中是有效的。
>
{style="note"}

## 返回到標籤

在 Kotlin 中，函式可以使用函式字面值、局部函式和物件表達式來巢狀定義。
限定的 `return` 允許你從外部函式返回。

最重要的用例是從 Lambda 表達式返回。要從 Lambda 表達式返回，請為其標記並限定 `return`：

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // 對 lambda 的呼叫者進行局部返回 - 即 forEach 迴圈
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

現在，它只從 Lambda 表達式返回。通常使用_隱式標籤_會更方便，因為此類標籤的名稱與 Lambda 傳遞給的函式名稱相同。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // 對 lambda 的呼叫者進行局部返回 - 即 forEach 迴圈
        print(it)
    }
    print(" done with implicit label")
}
//end

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

或者，你可以將 Lambda 表達式替換為[匿名函式](lambdas.md#anonymous-functions)。
匿名函式中的 `return` 語句會從匿名函式本身返回。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 對匿名函式的呼叫者進行局部返回 - 即 forEach 迴圈
        print(value)
    })
    print(" done with anonymous function")
}
//end

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

請注意，前三個範例中局部返回的用法類似於常規迴圈中 `continue` 的用法。

沒有直接對應 `break` 的語法，但可以透過新增另一個巢狀 Lambda 並從中非局部返回來模擬它：

```kotlin
//sampleStart
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // 從傳遞給 run 的 lambda 進行非局部返回
            print(it)
        }
    }
    print(" done with nested loop")
}
//end

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

當返回一個值時，解析器會優先考慮限定的返回：

```kotlin
return@a 1
```

這表示「在標籤 `@a` 處返回 `1`」，而不是「返回一個標記的表達式 `(@a 1)`」。

> 在某些情況下，您可以在不使用標籤的情況下從 Lambda 表達式返回。此類*非局部*返回位於 Lambda 中，但會退出封閉的[內聯函式](inline-functions.md#returns)。
>
{style="note"}