---
title: "高階函數與 Lambda"
---
Kotlin 函數是 [頭等函數](https://en.wikipedia.org/wiki/First-class_function)，這意味著它們可以儲存在變數和資料結構中，並且可以作為引數傳遞給其他 [高階函數](#higher-order-functions) 以及從其他高階函數回傳。[lambda 運算式](#lambda-expressions-and-anonymous-functions)。 您可以對函數執行其他非函數值可能執行的任何操作。

為了方便起見，Kotlin 作為靜態型別程式語言，使用一系列 [函數類型](#function-types) 來表示函數，並提供一組專用的語言結構，例如 [lambda 運算式](#lambda-expressions-and-anonymous-functions)。

## 高階函數 (Higher-order functions)

高階函數是將函數作為參數或回傳函數的函數。

[函數式程式設計慣用語 `fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function)) 是集合的一個很好的高階函數範例。 它採用初始累積值和組合函數，並透過連續地將目前累積值與每個集合元素組合來建構其回傳值，每次都取代累積值：

```kotlin
fun <T, R> Collection<T>.fold(
    initial: R, 
    combine: (acc: R, nextElement: T) `->` R
): R {
    var accumulator: R = initial
    for (element: T in this) {
        accumulator = combine(accumulator, element)
    }
    return accumulator
}
```

在上面的程式碼中，`combine` 參數具有 [函數類型](#function-types) `(R, T) `->` R`，因此它接受一個接受兩個類型為 `R` 和 `T` 的引數並回傳類型為 `R` 的值的函數。 它在 `for` 迴圈內 [調用](#invoking-a-function-type-instance)，然後將回傳值賦給 `accumulator`。

若要呼叫 `fold`，您需要將 [函數類型的實例](#instantiating-a-function-type) 作為引數傳遞給它，並且 lambda 運算式 ([在下面有更詳細的描述](#lambda-expressions-and-anonymous-functions)) 廣泛用於高階函數呼叫站點：

```kotlin
fun main() {

    val items = listOf(1, 2, 3, 4, 5)
    
    // Lambdas are code blocks enclosed in curly braces.
    items.fold(0, { 
        // When a lambda has parameters, they go first, followed by '`->`'
        acc: Int, i: Int `->` 
        print("acc = $acc, i = $i, ") 
        val result = acc + i
        println("result = $result")
        // The last expression in a lambda is considered the return value:
        result
    })
    
    // Parameter types in a lambda are optional if they can be inferred:
    val joinedToString = items.fold("Elements:", { acc, i `->` acc + " " + i })
    
    // Function references can also be used for higher-order function calls:
    val product = items.fold(1, Int::times)

    println("joinedToString = $joinedToString")
    println("product = $product")
}
```

## 函數類型 (Function types)

Kotlin 使用函數類型（例如 `(Int) `->` String`）來處理函數的宣告：`val onClick: () `->` Unit = ...`。

這些類型具有與函數簽章相對應的特殊表示法 - 它們的參數和回傳值：

* 所有函數類型都有一個帶括號的參數類型列表和一個回傳類型：`(A, B) `->` C` 表示一種代表接受類型為 `A` 和 `B` 的兩個引數並回傳類型為 `C` 的值的函數的類型。 參數類型列表可以為空，如 `() `->` A` 中所示。 [`Unit` 回傳類型](functions#unit-returning-functions) 不能省略。

* 函數類型可以選擇性地具有額外的 *接收者 (receiver)* 類型，該類型在表示法中的點之前指定：類型 `A.(B) `->` C` 表示可以在接收者物件 `A` 上呼叫的函數，其中包含參數 `B` 並回傳值 `C`。 [帶接收者的函數文字](#function-literals-with-receiver) 通常與這些類型一起使用。

* [暫停函數 (Suspending functions)](coroutines-basics#extract-function-refactoring) 屬於一種特殊的函數類型，它們的表示法中帶有 *suspend* 修飾符，例如 `suspend () `->` Unit` 或 `suspend A.(B) `->` C`。

函數類型表示法可以選擇性地包含函數參數的名稱：`(x: Int, y: Int) `->` Point`。 這些名稱可用於記錄參數的含義。

若要指定函數類型是 [可為空 (nullable)](null-safety#nullable-types-and-non-nullable-types)，請使用括號，如下所示：`((Int, Int) `->` Int)?`。

函數類型也可以使用括號組合：`(Int) `->` ((Int) `->` Unit)`。

:::note
箭頭表示法是右結合的，`(Int) `->` (Int) `->` Unit` 等同於先前的範例，但不等同於 `((Int) `->` (Int)) `->` Unit`。

:::

您也可以使用 [類型別名 (type alias)](type-aliases) 為函數類型提供替代名稱：

```kotlin
typealias ClickHandler = (Button, ClickEvent) `->` Unit
```

### 實例化函數類型 (Instantiating a function type)

有多種方法可以取得函數類型的實例：

* 使用函數文字中的程式碼區塊，採用以下形式之一：
    * [lambda 運算式](#lambda-expressions-and-anonymous-functions)：`{ a, b `->` a + b }`，
    * [匿名函數](#anonymous-functions)：`fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

  [帶接收者的函數文字](#function-literals-with-receiver) 可以用作帶接收者的函數類型的值。

* 使用對現有宣告的可呼叫參考：
    * 最上層、區域、成員或擴充功能 [函數](reflection#function-references)：`::isOdd`、`String::toInt`，
    * 最上層、成員或擴充功能 [屬性](reflection#property-references)：`List<Int>::size`，
    * [建構子 (constructor)](reflection#constructor-references)：`::Regex`

  這些包括 [繫結的可呼叫參考 (bound callable references)](reflection#bound-function-and-property-references)，這些參考指向特定實例的成員：`foo::toString`。

* 使用實作函數類型作為介面的自訂類別的實例：

```kotlin
class IntTransformer: (Int) `->` Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) `->` Int = IntTransformer()
```

如果有足夠的資訊，編譯器可以推斷變數的函數類型：

```kotlin
val a = { i: Int `->` i + 1 } // 推斷的類型是 (Int) `->` Int
```

帶有和不帶有接收者的函數類型的 *非文字 (Non-literal)* 值可以互換，因此接收者可以代替第一個參數，反之亦然。 例如，類型為 `(A, B) `->` C` 的值可以在預期類型為 `A.(B) `->` C` 的值的地方傳遞或賦值，反之亦然：

```kotlin
fun main() {

    val repeatFun: String.(Int) `->` String = { times `->` this.repeat(times) }
    val twoParameters: (String, Int) `->` String = repeatFun // OK
    
    fun runTransformation(f: (String, Int) `->` String): String {
        return f("hello", 3)
    }
    val result = runTransformation(repeatFun) // OK

    println("result = $result")
}
```

:::note
預設情況下，會推斷沒有接收者的函數類型，即使變數是使用對擴充功能函數的參考初始化的。 若要變更該設定，請明確指定變數類型。

:::

### 調用函數類型實例 (Invoking a function type instance)

可以使用其 [`invoke(...)` 運算子](operator-overloading#invoke-operator) 來調用函數類型的值：`f.invoke(x)` 或僅僅 `f(x)`。

如果該值具有接收者類型，則接收者物件應作為第一個引數傳遞。 調用帶有接收者的函數類型的值的另一種方法是在其前面加上接收者物件，就像該值是 [擴充功能函數](extensions) 一樣：`1.foo(2)`。

範例：

```kotlin
fun main() {

    val stringPlus: (String, String) `->` String = String::plus
    val intPlus: Int.(Int) `->` Int = Int::plus
    
    println(stringPlus.invoke("`<-`", "`->`"))
    println(stringPlus("Hello, ", "world!"))
    
    println(intPlus.invoke(1, 1))
    println(intPlus(1, 2))
    println(2.intPlus(3)) // 類似擴充功能的呼叫 (extension-like call)

}
```

### Inline 函數 (Inline functions)

有時，使用 [inline 函數](inline-functions) 對於高階函數來說是有益的，它可以提供靈活的控制流程。

## Lambda 運算式和匿名函數 (Lambda expressions and anonymous functions)

Lambda 運算式和匿名函數是 *函數文字 (function literals)*。 函數文字是未宣告但立即作為運算式傳遞的函數。 請考慮以下範例：

```kotlin
max(strings, { a, b `->` a.length < b.length })
```

函數 `max` 是一個高階函數，因為它採用函數值作為其第二個引數。 第二個引數本身就是一個函數，稱為函數文字，它等同於以下已命名的函數：

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### Lambda 運算式語法 (Lambda expression syntax)

lambda 運算式的完整語法形式如下：

```kotlin
val sum: (Int, Int) `->` Int = { x: Int, y: Int `->` x + y }
```

* Lambda 運算式始終以大括號括起來。
* 完整語法形式中的參數宣告位於大括號內，並且具有選擇性的類型註解。
* 主體位於 `->` 之後。
* 如果 lambda 的推斷回傳類型不是 `Unit`，則 lambda 主體內的最後一個（或可能是單個）運算式將被視為回傳值。

如果您省略所有選擇性的註解，則剩下的內容如下所示：

```kotlin
val sum = { x: Int, y: Int `->` x + y }
```

### 傳遞尾隨 Lambda (Passing trailing lambdas)

根據 Kotlin 慣例，如果函數的最後一個參數是函數，則可以將作為對應引數傳遞的 lambda 運算式放置在括號之外：

```kotlin
val product = items.fold(1) { acc, e `->` acc * e }
```

此語法也稱為 *尾隨 lambda (trailing lambda)*。

如果 lambda 是該呼叫中唯一的引數，則可以完全省略括號：

```kotlin
run { println("...") }
```

### it：單一參數的隱含名稱 (it: implicit name of a single parameter)

lambda 運算式只有一個參數的情況非常常見。

如果編譯器可以在沒有任何參數的情況下解析簽章，則不需要宣告參數，並且可以省略 `->`。 參數將以名稱 `it` 隱含宣告：

```kotlin
ints.filter { it > 0 } // 此文字的類型為 '(it: Int) `->` Boolean'
```

### 從 Lambda 運算式回傳值 (Returning a value from a lambda expression)

您可以使用 [限定回傳 (qualified return)](returns#return-to-labels) 語法從 lambda 明確地回傳一個值。 否則，會隱含地回傳最後一個運算式的值。

因此，以下兩個程式碼片段是等效的：

```kotlin
ints.filter {
    val shouldFilter = it > 0
    shouldFilter
}

ints.filter {
    val shouldFilter = it > 0
    return@filter shouldFilter
}
```

此慣例以及 [在括號外傳遞 lambda 運算式](#passing-trailing-lambdas) 允許 [LINQ 樣式](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/) 程式碼：

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 用於未使用變數的底線 (Underscore for unused variables)

如果 lambda 參數未使用，您可以用底線代替其名稱：

```kotlin
map.forEach { (_, value) `->` println("$value!") }
```

### Lambda 中的解構 (Destructuring in lambdas)

Lambda 中的解構被描述為 [解構宣告](destructuring-declarations#destructuring-in-lambdas) 的一部分。

### 匿名函數 (Anonymous functions)

上面的 lambda 運算式語法缺少一件事 - 指定函數的回傳類型的能力。 在大多數情況下，這是沒有必要的，因為可以自動推斷回傳類型。 但是，如果您確實需要明確地指定它，您可以使用替代語法：*匿名函數 (anonymous function)*。

```kotlin
fun(x: Int, y: Int): Int = x + y
```

匿名函數看起來很像常規函數宣告，只是省略了它的名稱。 它的主體可以是運算式（如上所示）或區塊：

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

參數和回傳類型的指定方式與常規函數相同，只是如果可以從上下文中推斷出參數類型，則可以省略參數類型：

```kotlin
ints.filter(fun(item) = item > 0)
```

匿名函數的回傳類型推斷與常規函數的回傳類型推斷的工作方式相同：對於具有運算式主體的匿名函數，會自動推斷回傳類型，但對於具有區塊主體的匿名函數，必須明確指定回傳類型（或假定為 `Unit`）。

:::note
將匿名函數作為參數傳遞時，請將它們放在括號內。 允許您將函數留在括號外的速記語法僅適用於 lambda 運算式。

:::

lambda 運算式和匿名函數之間的另一個差異是 [非本地回傳 (non-local returns)](inline-functions#returns) 的行為。 沒有標籤的 `return` 陳述式始終從使用 `fun` 關鍵字宣告的函數回傳。 這表示 lambda 運算式中的 `return` 將從封閉函數回傳，而匿名函數中的 `return` 將從匿名函數本身回傳。

### 閉包 (Closures)

Lambda 運算式或匿名函數（以及 [區域函數](functions#local-functions) 和 [物件運算式](object-declarations#object-expressions)）可以存取其 *閉包 (closure)*，其中包括在外部範圍中宣告的變數。 在閉包中捕獲的變數可以在 lambda 中修改：

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

### 帶接收者的函數文字 (Function literals with receiver)

帶有接收者的 [函數類型](#function-types)（例如 `A.(B) `->` C`）可以使用特殊形式的函數文字來實例化 - 帶接收者的函數文字。

如上所述，Kotlin 提供了 [呼叫函數類型實例](#invoking-a-function-type-instance) 的能力，同時提供 *接收者物件 (receiver object)*。

在函數文字的主體內，傳遞給呼叫的接收者物件會變成 *隱含 (implicit)* `this`，因此您可以存取該接收者物件的成員，而無需任何額外的限定詞，或者使用 [`this` 運算式](this-expressions) 存取接收者物件。

此行為與 [擴充功能函數](extensions) 的行為類似，擴充功能函數也允許您存取函數主體內的接收者物件的成員。

以下是帶有接收者的函數文字及其類型的範例，其中在接收者物件上呼叫 `plus`：

```kotlin
val sum: Int.(Int) `->` Int = { other `->` plus(other) }
```

匿名函數語法允許您直接指定函數文字的接收者類型。 如果您需要宣告帶有接收者的函數類型的變數，然後在以後使用它，這可能會很有用。

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

當可以從上下文中推斷出接收者類型時，Lambda 運算式可以用作帶有接收者的函數文字。 它們最重要的用法範例之一是 [類型安全建構器 (type-safe builders)](type-safe-builders)：

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() `->` Unit): HTML {
    val html = HTML()  // 建立接收者物件 (create the receiver object)
    html.init()        // 將接收者物件傳遞給 lambda (pass the receiver object to the lambda)
    return html
}

html {       // 帶有接收者的 lambda 從此處開始 (lambda with receiver begins here)
    body()   // 呼叫接收者物件上的方法 (calling a method on the receiver object)
}
```