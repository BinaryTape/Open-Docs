[//]: # (title: Return 與跳轉)

Kotlin 有三種結構化跳轉表達式：

*   `return` 預設從最接近的封裝函數或[匿名函數](lambdas.md#anonymous-functions)返回。
*   `break` 終止最接近的封裝迴圈。
*   `continue` 繼續到最接近的封裝迴圈的下一個步驟。

所有這些表達式都可以作為更大表達式的一部分使用：

```kotlin
val s = person.name ?: return
```

這些表達式的類型是 [Nothing 類型](exceptions.md#the-nothing-type)。

## Break 與 Continue 標籤

Kotlin 中的任何表達式都可以被標記為一個 _標籤_。
標籤的形式是識別符號後跟 `@` 符號，例如 `abc@` 或 `fooBar@`。
要為表達式標記，只需在其前面添加一個標籤即可。

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

現在，你可以使用標籤限定 `break` 或 `continue`：

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

帶有標籤限定的 `break` 會跳轉到標記該標籤的迴圈結束後的執行點。
`continue` 則會繼續到該迴圈的下一次疊代。

> 在某些情況下，你可以 _非局部地_ 應用 `break` 和 `continue` 而無需明確定義標籤。
> 這種非局部的用法在用於封裝[內聯函數](inline-functions.md#break-and-continue)的 Lambda 表達式中是有效的。
>
{style="note"}

## Return 到標籤

在 Kotlin 中，函數可以使用函數字面量、局部函數和物件表達式進行巢狀定義。
限定 `return` 允許你從外部函數返回。

最重要的用例是從 Lambda 表達式返回。要從 Lambda 表達式返回，請為其標記並限定 `return`：

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

現在，它只從 Lambda 表達式返回。通常，使用 _隱式標籤_ 更方便，因為這種標籤的名稱與傳遞 Lambda 的函數名稱相同。

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

或者，你可以用[匿名函數](lambdas.md#anonymous-functions)替換 Lambda 表達式。
匿名函數中的 `return` 語句將從匿名函數本身返回。

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

請注意，前三個範例中局部 return 的使用方式，與常規迴圈中 `continue` 的使用方式相似。

`break` 沒有直接的等價物，但可以通過添加一個外部 `run` Lambda 並從中非局部返回來模擬：

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

此處的非局部 return 是可能的，因為巢狀的 `forEach()` Lambda 作為[內聯函數](inline-functions.md)運行。

當返回一個值時，解析器會優先處理限定 return：

```kotlin
return@a 1
```

這意味著「在標籤 `@a` 處返回 `1`」，而不是「返回一個帶標籤的表達式 `(@a 1)`」。

> 在某些情況下，你可以在不使用標籤的情況下從 Lambda 表達式返回。這種 _非局部_ return 位於 Lambda 中，但會退出封裝的[內聯函數](inline-functions.md#returns)。
>
{style="note"}