[//]: # (title: 高階函數與 Lambda 表達式)

Kotlin 函數是[一等公民](https://en.wikipedia.org/wiki/First-class_function)，這表示它們可以儲存在變數和資料結構中，並且可以作為引數傳遞給其他[高階函數](#higher-order-functions)或從中返回。您可以對函數執行任何適用於其他非函數值的操作。

為此，Kotlin 作為一種靜態類型程式語言，使用一系列[函數類型](#function-types)來表示函數，並提供一套專用的語言建構，例如[Lambda 表達式](#lambda-expressions-and-anonymous-functions)。

## 高階函數

高階函數是指將函數作為參數，或返回一個函數的函數。

一個很好的高階函數範例是集合的[函數式程式設計慣用法 `fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function))。它接受一個初始累加器值和一個組合函數，並透過將當前的累加器值與每個集合元素連續組合，每次替換累加器值來建立其返回值：

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

在上面的程式碼中，`combine` 參數具有[函數類型](#function-types) `(R, T) -> R`，因此它接受一個函數，該函數接受兩個類型為 `R` 和 `T` 的引數並返回類型為 `R` 的值。它在 `for` 迴圈中被[調用](#invoking-a-function-type-instance)，返回值隨後被賦予 `accumulator`。

要調用 `fold`，您需要將[函數類型的實例](#instantiating-a-function-type)作為引數傳遞給它，而 Lambda 表達式（[詳情如下所述](#lambda-expressions-and-anonymous-functions)）在此目的上被廣泛用於高階函數調用點：

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

## 函數類型

Kotlin 使用函數類型，例如 `(Int) -> String`，來處理函數的宣告：`val onClick: () -> Unit = ...`。

這些類型具有與函數簽名（它們的參數和返回值）相對應的特殊表示法：

*   所有函數類型都具有帶括號的參數類型列表和一個返回類型：`(A, B) -> C` 表示一種類型，代表接受兩個類型為 `A` 和 `B` 的引數並返回類型為 `C` 的值的函數。參數類型列表可以為空，如 `() -> A`。[`Unit` 返回類型](functions.md#unit-returning-functions)不能省略。

*   函數類型可以選擇性地具有一個額外的 *接收者* 類型，該類型在表示法中點號之前指定：類型 `A.(B) -> C` 表示可以針對接收者物件 `A` 調用、帶有參數 `B` 並返回值 `C` 的函數。[帶接收者的函數字面值](#function-literals-with-receiver)通常與這些類型一起使用。

*   [暫停函數](coroutines-basics.md#extract-function-refactoring) 屬於一種特殊函數類型，其表示法中帶有 *suspend* 修飾符，例如 `suspend () -> Unit` 或 `suspend A.(B) -> C`。

函數類型表示法可以選擇性地包含函數參數的名稱：`(x: Int, y: Int) -> Point`。這些名稱可用於記錄參數的含義。

若要指定函數類型[可為空](null-safety.md#nullable-types-and-non-nullable-types)，請使用括號，如下所示：`((Int, Int) -> Int)?`。

函數類型也可以使用括號組合：`(Int) -> ((Int) -> Unit)`。

> 箭頭表示法是右結合的，`(Int) -> (Int) -> Unit` 等價於上一個範例，但不等價於 `((Int) -> (Int)) -> Unit`。
>
{style="note"}

您也可以使用[類型別名](type-aliases.md)為函數類型提供一個替代名稱：

```kotlin
typealias ClickHandler = (Button, ClickEvent) -> Unit
```

### 實例化函數類型

有幾種方式可以獲取函數類型的實例：

*   使用函數字面值內的程式碼塊，形式如下：
    *   [Lambda 表達式](#lambda-expressions-and-anonymous-functions)：`{ a, b -> a + b }`
    *   [匿名函數](#anonymous-functions)：`fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

  [帶接收者的函數字面值](#function-literals-with-receiver)可以用作帶接收者的函數類型的值。

*   使用現有宣告的可呼叫引用：
    *   頂層、局部、成員或擴充[函數](reflection.md#function-references)：`::isOdd`、`String::toInt`
    *   頂層、成員或擴充[屬性](reflection.md#property-references)：`List<Int>::size`
    *   [建構子](reflection.md#constructor-references)：`::Regex`

  這些包括指向特定實例成員的[綁定可呼叫引用](reflection.md#bound-function-and-property-references)：`foo::toString`。

*   使用實現函數類型作為介面的自訂類別實例：

```kotlin
class IntTransformer: (Int) -> Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) -> Int = IntTransformer()
```

如果編譯器有足夠的資訊，可以推斷變數的函數類型：

```kotlin
val a = { i: Int -> i + 1 } // The inferred type is (Int) -> Int
```

帶接收者和不帶接收者的函數類型的*非字面值*是可互換的，因此接收者可以代替第一個參數，反之亦然。例如，類型為 `(A, B) -> C` 的值可以在預期類型為 `A.(B) -> C` 的地方傳遞或賦予，反之亦然：

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

> 預設情況下，即使變數是使用擴充函數的引用初始化的，也會推斷出無接收者的函數類型。
> 若要改變這一點，請明確指定變數類型。
>
{style="note"}

### 調用函數類型實例

函數類型的值可以使用其[`invoke(...)` 運算符](operator-overloading.md#invoke-operator)來調用：`f.invoke(x)` 或直接 `f(x)`。

如果該值具有接收者類型，則應將接收者物件作為第一個引數傳遞。調用帶接收者的函數類型值的另一種方式是在其前面加上接收者物件，就好像該值是[擴充函數](extensions.md)一樣：`1.foo(2)`。

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

### 內聯函數

有時，對高階函數使用[內聯函數](inline-functions.md)會很有益，它們提供靈活的控制流。

## Lambda 表達式和匿名函數

Lambda 表達式和匿名函數是*函數字面值*。函數字面值是指未宣告但立即作為表達式傳遞的函數。考慮以下範例：

```kotlin
max(strings, { a, b -> a.length < b.length })
```

函數 `max` 是一個高階函數，因為它將一個函數值作為其第二個引數。這第二個引數是一個本身就是函數的表達式，稱為函數字面值，它等價於以下具名函數：

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### Lambda 表達式語法

Lambda 表達式的完整語法形式如下：

```kotlin
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
```

*   Lambda 表達式總是圍繞在大括號中。
*   完整語法形式中的參數宣告位於大括號內，並具有可選的類型註解。
*   主體位於 `->` 之後。
*   如果 Lambda 的推斷返回類型不是 `Unit`，則 Lambda 主體內部的最後一個（或可能是單個）表達式被視為返回值。

如果您省略所有可選註解，剩下的看起來像這樣：

```kotlin
val sum = { x: Int, y: Int -> x + y }
```

### 傳遞尾隨 Lambda

根據 Kotlin 慣例，如果函數的最後一個參數是一個函數，那麼作為對應引數傳遞的 Lambda 表達式可以放在括號外面：

```kotlin
val product = items.fold(1) { acc, e -> acc * e }
```

這種語法亦稱為*尾隨 Lambda*。

如果 Lambda 是該調用中唯一的引數，則括號可以完全省略：

```kotlin
run { println("...") }
```

### it：單一參數的隱式名稱

Lambda 表達式只有一個參數的情況非常常見。

如果編譯器可以在不帶任何參數的情況下解析簽名，則不需要宣告參數，並且可以省略 `->`。該參數將以 `it` 的名稱隱式宣告：

```kotlin
ints.filter { it > 0 } // this literal is of type '(it: Int) -> Boolean'
```

### 從 Lambda 表達式返回值

您可以使用[限定返回](returns.md#return-to-labels)語法從 Lambda 明確返回值。否則，最後一個表達式的值將被隱式返回。

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

這種慣例，連同[將 Lambda 表達式放在括號外部傳遞](#passing-trailing-lambdas)，允許使用 [LINQ 風格](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/)的程式碼：

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 未使用變數的底線

如果 Lambda 參數未使用，您可以用底線代替其名稱：

```kotlin
map.forEach { (_, value) -> println("$value!") }
```

### Lambda 中的解構

Lambda 中的解構被描述為[解構宣告](destructuring-declarations.md#destructuring-in-lambdas)的一部分。

### 匿名函數

上述 Lambda 表達式語法缺少一項東西——指定函數返回類型的能力。在大多數情況下，這是不必要的，因為返回類型可以自動推斷。然而，如果您確實需要明確指定它，您可以使用一種替代語法：*匿名函數*。

```kotlin
fun(x: Int, y: Int): Int = x + y
```

匿名函數看起來非常像常規函數宣告，只是其名稱被省略。它的主體可以是表達式（如上所示）或塊：

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

參數和返回類型與常規函數的指定方式相同，只是如果可以從上下文推斷出參數類型，則可以省略它們：

```kotlin
ints.filter(fun(item) = item > 0)
```

匿名函數的返回類型推斷與普通函數的工作方式相同：對於帶有表達式主體的匿名函數，返回類型會自動推斷，但對於帶有塊主體的匿名函數，則必須明確指定（或假定為 `Unit`）。

> 將匿名函數作為參數傳遞時，請將它們放在括號內部。允許將函數放在括號外部的簡寫語法僅適用於 Lambda 表達式。
>
{style="note"}

Lambda 表達式和匿名函數之間的另一個區別是[非局部返回](inline-functions.md#returns)的行為。不帶標籤的 `return` 語句總是從用 `fun` 關鍵字宣告的函數返回。這意味著 Lambda 表達式內的 `return` 將從封閉函數返回，而匿名函數內的 `return` 將從匿名函數本身返回。

### 閉包

Lambda 表達式或匿名函數（以及[局部函數](functions.md#local-functions)和[物件表達式](object-declarations.md#object-expressions)）可以存取其*閉包*，其中包含在外部作用域中宣告的變數。閉包中捕獲的變數可以在 Lambda 中被修改：

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

### 帶接收者的函數字面值

帶接收者的[函數類型](#function-types)，例如 `A.(B) -> C`，可以使用一種特殊形式的函數字面值——帶接收者的函數字面值來實例化。

如上所述，Kotlin 提供了在提供*接收者物件*的同時[調用帶接收者的函數類型實例](#invoking-a-function-type-instance)的能力。

在函數字面值的主體內部，傳遞給調用的接收者物件會成為一個*隱式* `this`，因此您可以不帶任何額外限定符地存取該接收者物件的成員，或者使用[`this` 表達式](this-expressions.md)存取接收者物件。

這種行為類似於[擴充函數](extensions.md)的行為，擴充函數也允許您在函數主體內部存取接收者物件的成員。

這裡是一個帶接收者的函數字面值及其類型的範例，其中 `plus` 在接收者物件上被調用：

```kotlin
val sum: Int.(Int) -> Int = { other -> plus(other) }
```

匿名函數語法允許您直接指定函數字面值的接收者類型。如果您需要宣告一個帶接收者的函數類型變數，然後稍後使用它，這會很有用。

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

當接收者類型可以從上下文推斷時，Lambda 表達式可以用作帶接收者的函數字面值。它們用法中最重要的一個範例是[類型安全建構器](type-safe-builders.md)：

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()  // create the receiver object
    html.init()        // pass the receiver object to the lambda
    return html
}

html {       // lambda with receiver begins here
    body()   // calling a method on the receiver object
}
```