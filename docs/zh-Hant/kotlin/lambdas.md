[//]: # (title: 高階函式與 Lambda)

Kotlin 函式是[第一級](https://en.wikipedia.org/wiki/First-class_function)的，這表示它們可以儲存於變數和資料結構中，並且可以作為引數傳遞給其他[高階函式](#higher-order-functions)，或從中回傳。你可以對函式執行任何適用於其他非函式值的操作。

為此，Kotlin 作為一種靜態型別程式語言，使用一系列[函式類型](#function-types)來表示函式，並提供一組專用的語言建構，例如[Lambda 表達式](#lambda-expressions-and-anonymous-functions)。

## 高階函式

高階函式是將函式作為參數，或回傳函式的一種函式。

高階函式的一個好例子是集合的[函式式程式設計慣用語 `fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function))。它接受一個初始累加器值和一個組合函式，並透過將當前累加器值與每個集合元素依序組合來建構其回傳值，每次都替換累加器值：

```kotlin
fun <T, R> Collection<T>.fold(
    initial: R, 
    combine: (acc: R, nextElement: T) -> R
): R {
    var accumulator: R = initial
    for (element: T in this) {
        accumulator = combine(accumulator, element)
    }
    return accumulator
}
```

在上面的程式碼中，`combine` 參數具有[函式類型](#function-types) `(R, T) -> R`，因此它接受一個函式，該函式接收 `R` 和 `T` 兩種型別的兩個引數，並回傳 `R` 型別的值。它在 `for` 迴圈內部被[呼叫](#invoking-a-function-type-instance)，回傳值隨後被賦予 `accumulator`。

若要呼叫 `fold`，你需要傳遞[函式類型的一個實例](#instantiating-a-function-type)給它作為引數，而 Lambda 表達式（[詳情如下所述](#lambda-expressions-and-anonymous-functions)）在此目的下，於高階函式呼叫點被廣泛使用：

```kotlin
fun main() {
    //sampleStart
    val items = listOf(1, 2, 3, 4, 5)
    
    // Lambdas are code blocks enclosed in curly braces.
    items.fold(0, { 
        // When a lambda has parameters, they go first, followed by '->'
        acc: Int, i: Int -> 
        print("acc = $acc, i = $i, ") 
        val result = acc + i
        println("result = $result")
        // The last expression in a lambda is considered the return value:
        result
    })
    
    // Parameter types in a lambda are optional if they can be inferred:
    val joinedToString = items.fold("Elements:", { acc, i -> acc + " " + i })
    
    // Function references can also be used for higher-order function calls:
    val product = items.fold(1, Int::times)
    //sampleEnd
    println("joinedToString = $joinedToString")
    println("product = $product")
}
```
{kotlin-runnable="true"}

## 函式類型

Kotlin 使用函式類型（例如 `(Int) -> String`）來處理函式的宣告：`val onClick: () -> Unit = ...`。

這些類型具有與函式簽章（即它們的參數和回傳值）相對應的特殊符號：

*   所有函式類型都具有包含參數類型的圓括號列表和一個回傳類型：`(A, B) -> C` 表示一種函式類型，它接收 `A` 和 `B` 兩種型別的兩個引數，並回傳 `C` 型別的值。參數類型列表可以為空，如 `() -> A`。[`Unit` 回傳類型](functions.md#unit-returning-functions)不能省略。

*   函式類型可以選擇性地具有一個額外的 *接收者* 類型，它在符號中的點之前指定：類型 `A.(B) -> C` 表示可以在接收者物件 `A` 上呼叫，帶有一個參數 `B` 並回傳 `C` 值的功能。 [帶接收者的函式字面值](#function-literals-with-receiver)通常與這些類型一起使用。

*   [懸掛函式](coroutines-basics.md#extract-function-refactoring)屬於一種特殊的函式類型，其符號中帶有 `suspend` 修飾符，例如 `suspend () -> Unit` 或 `suspend A.(B) -> C`。

函式類型符號可以選擇性地包含函式參數的名稱：`(x: Int, y: Int) -> Point`。這些名稱可用於記錄參數的意義。

若要指定函式類型是[可為 null 的](null-safety.md#nullable-types-and-non-nullable-types)，請依照以下方式使用圓括號：`((Int, Int) -> Int)?`。

函式類型也可以使用圓括號組合：`(Int) -> ((Int) -> Unit)`。

> 箭頭符號是右結合的，`(Int) -> (Int) -> Unit` 等價於先前的範例，但不等價於 `((Int) -> (Int)) -> Unit`。
>
{style="note"}

你也可以透過使用[類型別名](type-aliases.md)來給函式類型一個替代名稱：

```kotlin
typealias ClickHandler = (Button, ClickEvent) -> Unit
```

### 實例化函式類型

有多種方式可以取得函式類型的一個實例：

*   在函式字面值中使用程式碼區塊，形式如下：
    *   [Lambda 表達式](#lambda-expressions-and-anonymous-functions)：`{ a, b -> a + b }`，
    *   [匿名函式](#anonymous-functions)：`fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

  [帶接收者的函式字面值](#function-literals-with-receiver)可以用作帶接收者的函式類型的值。

*   使用可呼叫參考指向現有宣告：
    *   頂層、局部、成員或擴充[函式](reflection.md#function-references)：`::isOdd`、`String::toInt`，
    *   頂層、成員或擴充[屬性](reflection.md#property-references)：`List<Int>::size`，
    *   [建構函式](reflection.md#constructor-references)：`::Regex`

  這包括指向特定實例成員的[綁定可呼叫參考](reflection.md#bound-function-and-property-references)：`foo::toString`。

*   使用實作函式類型作為介面的自訂類別實例：

```kotlin
class IntTransformer: (Int) -> Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) -> Int = IntTransformer()
```

如果有足夠的資訊，編譯器可以推斷變數的函式類型：

```kotlin
val a = { i: Int -> i + 1 } // 推斷的型別是 (Int) -> Int
```

帶有和不帶接收者的函式類型之 *非字面值* 是可互換的，因此接收者可以代表第一個參數，反之亦然。例如，` (A, B) -> C` 型別的值可以在預期 `A.(B) -> C` 型別值的地方傳遞或賦值，反之亦然：

```kotlin
fun main() {
    //sampleStart
    val repeatFun: String.(Int) -> String = { times -> this.repeat(times) }
    val twoParameters: (String, Int) -> String = repeatFun // OK
    
    fun runTransformation(f: (String, Int) -> String): String {
        return f("hello", 3)
    }
    val result = runTransformation(repeatFun) // OK
    //sampleEnd
    println("result = $result")
}
```
{kotlin-runnable="true"}

> 即使變數用擴充函式的參考初始化，預設情況下函式類型不帶接收者也會被推斷。
> 若要更改此行為，請明確指定變數類型。
>
{style="note"}

### 呼叫函式類型實例

函式類型的值可以透過使用其[`invoke(...)` 運算子](operator-overloading.md#invoke-operator)來呼叫：`f.invoke(x)` 或僅 `f(x)`。

如果值具有接收者類型，則應將接收者物件作為第一個引數傳遞。呼叫帶接收者的函式類型值的另一種方法是在其前面加上接收者物件，就像該值是[擴充函式](extensions.md)一樣：`1.foo(2)`。

範例：

```kotlin
fun main() {
    //sampleStart
    val stringPlus: (String, String) -> String = String::plus
    val intPlus: Int.(Int) -> Int = Int::plus
    
    println(stringPlus.invoke("<-", "->"))
    println(stringPlus("Hello, ", "world!"))
    
    println(intPlus.invoke(1, 1))
    println(intPlus(1, 2))
    println(2.intPlus(3)) // extension-like call
    //sampleEnd
}
```
{kotlin-runnable="true"}

### 行內函式

有時，對於高階函式來說，使用提供彈性控制流程的[行內函式](inline-functions.md)是有益的。

## Lambda 表達式與匿名函式

Lambda 表達式和匿名函式是 *函式字面值*。函式字面值是未經宣告但立即作為表達式傳遞的函式。考慮以下範例：

```kotlin
max(strings, { a, b -> a.length < b.length })
```

函式 `max` 是一個高階函式，因為它將一個函式值作為其第二個引數。這個第二個引數本身是一個函式表達式，稱為函式字面值，它等價於以下具名函式：

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### Lambda 表達式語法

Lambda 表達式的完整語法形式如下：

```kotlin
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
```

*   Lambda 表達式始終由花括號包圍。
*   完整語法形式中的參數宣告位於花括號內，並具有可選的型別註解。
*   主體位於 `->` 之後。
*   如果 Lambda 的推斷回傳型別不是 `Unit`，則 Lambda 主體內的最後一個（或可能是單一）表達式將被視為回傳值。

如果你省略所有可選註解，剩下的看起來像這樣：

```kotlin
val sum = { x: Int, y: Int -> x + y }
```

### 傳遞尾隨 Lambda

根據 Kotlin 慣例，如果函式的最後一個參數是函式，那麼作為相應引數傳遞的 Lambda 表達式可以放置在圓括號外部：

```kotlin
val product = items.fold(1) { acc, e -> acc * e }
```

這種語法也稱為 *尾隨 Lambda*。

如果 Lambda 是該呼叫中的唯一引數，則圓括號可以完全省略：

```kotlin
run { println("...") }
```

### it：單一參數的隱式名稱

Lambda 表達式只有一個參數的情況非常常見。

如果編譯器可以在沒有任何參數的情況下解析簽章，則無需宣告參數，並且 `->` 可以省略。該參數將以 `it` 的名稱隱式宣告：

```kotlin
ints.filter { it > 0 } // 此字面值型別為 '(it: Int) -> Boolean'
```

### 從 Lambda 表達式回傳值

你可以使用[限定回傳](returns.md#return-to-labels)語法從 Lambda 明確回傳一個值。否則，最後一個表達式的值將被隱式回傳。

因此，以下兩個程式碼片段是等價的：

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

這種慣例，連同[在圓括號外部傳遞 Lambda 表達式](#passing-trailing-lambdas)，允許產生 [LINQ 風格](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/)的程式碼：

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 未使用變數的底線

如果 Lambda 參數未使用，你可以放置一個底線來取代其名稱：

```kotlin
map.forEach { (_, value) -> println("$value!") }
```

### Lambda 中的解構

Lambda 中的解構作為[解構宣告](destructuring-declarations.md#destructuring-in-lambdas)的一部分進行了描述。

### 匿名函式

上述 Lambda 表達式語法缺少一件事——指定函式回傳類型的能力。在大多數情況下，這是非必要的，因為回傳類型可以自動推斷。然而，如果你確實需要明確指定它，你可以使用一種替代語法：*匿名函式*。

```kotlin
fun(x: Int, y: Int): Int = x + y
```

匿名函式看起來非常像常規函式宣告，只是其名稱被省略了。它的主體可以是表達式（如上所示）或程式碼區塊：

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

參數和回傳類型與常規函式以相同方式指定，只是如果參數類型可以從上下文推斷，則可以省略：

```kotlin
ints.filter(fun(item) = item > 0)
```

匿名函式的回傳類型推斷工作方式與普通函式相同：對於帶有表達式主體的匿名函式，回傳類型會自動推斷，但對於帶有程式碼區塊主體的匿名函式，則必須明確指定（或假定為 `Unit`）。

> 將匿名函式作為參數傳遞時，請將它們放置在圓括號內部。允許將函式留在圓括號外部的簡寫語法僅適用於 Lambda 表達式。
>
{style="note"}

Lambda 表達式和匿名函式之間的另一個區別是[非局部回傳](inline-functions.md#returns)的行為。沒有標籤的 `return` 語句總是從用 `fun` 關鍵字宣告的函式中回傳。這意味著 Lambda 表達式內的 `return` 將從封閉函式中回傳，而匿名函式內的 `return` 將從匿名函式本身回傳。

### 閉包

Lambda 表達式或匿名函式（以及[局部函式](functions.md#local-functions)和[物件表達式](object-declarations.md#object-expressions)）可以存取其 *閉包*，其中包含在外部作用域中宣告的變數。閉包中捕獲的變數可以在 Lambda 中被修改：

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

### 帶接收者的函式字面值

帶接收者的[函式類型](#function-types)，例如 `A.(B) -> C`，可以使用一種特殊形式的函式字面值——帶接收者的函式字面值來實例化。

如上所述，Kotlin 提供了[呼叫帶接收者的函式類型實例](#invoking-a-function-type-instance)的能力，同時提供 *接收者物件*。

在函式字面值的主體內部，傳遞給呼叫的接收者物件會成為一個 *隱式* `this`，因此你可以無需任何額外限定符地存取該接收者物件的成員，或使用[`this` 表達式](this-expressions.md)存取接收者物件。

這種行為類似於[擴充函式](extensions.md)，後者也允許你在函式主體內部存取接收者物件的成員。

這是一個帶接收者的函式字面值及其類型的範例，其中 `plus` 在接收者物件上被呼叫：

```kotlin
val sum: Int.(Int) -> Int = { other -> plus(other) }
```

匿名函式語法允許你直接指定函式字面值的接收者類型。如果你需要宣告一個帶接收者的函式類型變數，然後稍後使用它，這會很有用。

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

當接收者類型可以從上下文推斷時，Lambda 表達式可以用作帶接收者的函式字面值。它們用法中最重要的一個例子是[型別安全建構器](type-safe-builders.md)：

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()  // 建立接收者物件
    html.init()        // 將接收者物件傳遞給 Lambda
    return html
}

html {       // 帶接收者的 Lambda 從這裡開始
    body()   // 在接收者物件上呼叫方法
}
```