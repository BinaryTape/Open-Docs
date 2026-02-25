[//]: # (title: 返回與跳轉)

Kotlin 有三種結構化的跳轉運算式：

* `return` 預設從最接近的封閉函式或 [匿名函式](lambdas.md#anonymous-functions) 返回。
* `break` 結束最接近的封閉迴圈。
* `continue` 進入最接近封閉迴圈的下一個反覆運算步驟。

所有這些運算式都可以作為大型運算式的一部分：

```kotlin
val s = person.name ?: return
```

這些運算式的型別是 [Nothing 型別](exceptions.md#the-nothing-type)。

## Break 與 continue 標籤

Kotlin 中的任何運算式都可以標記 *標籤* (label)。
標籤的格式為識別符號後跟 `@` 符號，例如 `abc@` 或 `fooBar@`。要為運算式加上標籤，只需在其前面新增一個標籤即可。

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

帶有標籤限定的 `break` 會跳轉至該標籤所標記的迴圈之後的執行點。
`continue` 則會進入該迴圈的下一個反覆運算。

> 在某些情況下，你可以 *非區域地* (non-locally) 套用 `break` 和 `continue` 而無需明確定義標籤。
> 此類非區域用法在用於封閉 [內嵌函式](inline-functions.md#break-and-continue) 的 Lambda 運算式中是有效的。
>
{style="note"}

## 返回至標籤

在 Kotlin 中，函式可以透過函式常值、區域函式和物件運算式進行巢狀。
限定的 `return` 允許你從外部函式返回。

最重要的使用案例是從 Lambda 運算式返回。要從 Lambda 運算式返回，請對其加上標籤並限定 `return`：

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // 區域返回至 Lambda 的呼叫者 - forEach 迴圈
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

現在，它僅從 Lambda 運算式返回。通常使用 *隱含標籤* 會更方便，因為此類標籤與傳遞 Lambda 的函式名稱相同。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // 區域返回至 Lambda 的呼叫者 - forEach 迴圈
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

或者，你可以使用 [匿名函式](lambdas.md#anonymous-functions) 來取代 Lambda 運算式。
匿名函式中的 `return` 陳述式將從匿名函式本身返回。

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 區域返回至匿名函式的呼叫者 - forEach 迴圈
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

請注意，前三個範例中區域返回的使用方式與一般迴圈中 `continue` 的使用方式類似。

對於 `break` 沒有直接的等價物，但可以透過新增一個外層的 `run` Lambda 並從中進行非區域返回來模擬：

```kotlin
//sampleStart
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // 從傳遞給 run 的 Lambda 進行非區域返回
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

此處的非區域返回是可行的，因為巢狀的 `forEach()` Lambda 扮演了 [內嵌函式](inline-functions.md) 的角色。

當傳回一個值時，剖析器會優先採用限定的返回：

```kotlin
return@a 1
```

這表示「在標籤 `@a` 處傳回 `1`」，而不是「傳回一個標記標籤的運算式 `(@a 1)`」。

> 在某些情況下，你可以從 Lambda 運算式返回而無需使用標籤。此類 *非區域* 返回位於 Lambda 中，但會退出封閉的 [內嵌函式](inline-functions.md#returns)。
>
{style="note"}