[//]: # (title: 函式)

Kotlin 函式使用 `fun` 關鍵字宣告：

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```

## 函式使用

函式以標準方式呼叫：

```kotlin
val result = double(2)
```

呼叫成員函式使用點符號：

```kotlin
Stream().read() // create instance of class Stream and call read()
```

### 參數

函式參數使用 Pascal 表示法定義 - *名稱*: *類型*。參數之間以逗號分隔，且每個參數都必須明確指定類型：

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

宣告函式參數時，您可以使用[結尾逗號](coding-conventions.md#trailing-commas)：

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // trailing comma
) { /*...*/ }
```

### 預設引數

函式參數可以有預設值，當您省略對應的引數時會使用這些預設值。這減少了[多載](https://zh.wikipedia.org/wiki/%E5%87%BD%E6%95%B0%E5%A4%9A%E8%BD%BD)的數量：

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

預設值透過在類型後附加 `=` 來設定。

覆寫方法始終使用基礎方法的預設參數值。
當覆寫一個具有預設參數值的方法時，預設參數值必須從簽章中省略：

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // No default value is allowed.
}
```

如果一個預設參數位於沒有預設值的參數之前，那麼預設值只能透過使用[具名引數](#named-arguments)呼叫函式來使用：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // The default value bar = 0 is used
```

如果預設參數後的最後一個引數是 [lambda 運算式](lambdas.md#lambda-expression-syntax)，您可以將其作為具名引數傳遞，或[放在括號外](lambdas.md#passing-trailing-lambdas)傳遞：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int = 1,
    qux: () -> Unit,
) { /*...*/ }

foo(1) { println("hello") }     // Uses the default value baz = 1
foo(qux = { println("hello") }) // Uses both default values bar = 0 and baz = 1
foo { println("hello") }        // Uses both default values bar = 0 and baz = 1
```

### 具名引數

您可以在呼叫函式時為其一個或多個引數命名。當函式有許多引數且難以將值與引數關聯時，這會很有幫助，尤其是當它是布林值或 `null` 值時。

當您在函式呼叫中使用具名引數時，您可以自由更改其列出的順序。如果您想使用它們的預設值，您可以完全省略這些引數。

考慮 `reformat()` 函式，它有 4 個具有預設值的引數。

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

呼叫此函式時，您不必為所有引數命名：

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

您可以跳過所有具有預設值的引數：

```kotlin
reformat("This is a long String!")
```

您也可以跳過特定具有預設值的引數，而不是全部省略。但是，在第一個跳過的引數之後，您必須為所有後續引數命名：

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

您可以使用*展開運算子*（在陣列前加上 `*`）傳遞[可變數量引數（`vararg`）](#variable-number-of-arguments-varargs)與名稱：

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

> 當在 JVM 上呼叫 Java 函式時，您不能使用具名引數語法，因為 Java 位元碼 (bytecode) 不總是保留函式參數的名稱。
>
{style="note"}

### 回傳 Unit 的函式

如果一個函式不回傳有用的值，其回傳類型是 `Unit`。`Unit` 是一種只有一個值 — `Unit` — 的類型。此值不必明確回傳：

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` 或 `return` 是可選的
}
```

`Unit` 回傳類型的宣告也是可選的。上述程式碼等同於：

```kotlin
fun printHello(name: String?) { ... }
```

### 單一表達式函式

當函式主體僅由一個表達式組成時，可以省略大括號，並在 `=` 符號後指定主體：

```kotlin
fun double(x: Int): Int = x * 2
```

當編譯器可以推斷回傳類型時，明確宣告回傳類型是[可選的](#explicit-return-types)：

```kotlin
fun double(x: Int) = x * 2
```

### 明確的回傳類型

具有區塊主體的函式必須始終明確指定回傳類型，除非它們旨在回傳 `Unit`，[在這種情況下指定回傳類型是可選的](#unit-returning-functions)。

Kotlin 不會為具有區塊主體的函式推斷回傳類型，因為此類函式的主體中可能存在複雜的控制流程，並且回傳類型對讀者（有時甚至對編譯器）而言並不顯而易見。

### 可變數量引數 (varargs)

您可以將函式的一個參數（通常是最後一個）標記為 `vararg` 修飾子：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts is an Array
        result.add(t)
    return result
}
```

在這種情況下，您可以向函式傳遞可變數量的引數：

```kotlin
val list = asList(1, 2, 3)
```

在函式內部，類型為 `T` 的 `vararg` 參數會顯示為 `T` 的陣列，如上述範例所示，其中 `ts` 變數的類型為 `Array<out T>`。

只有一個參數可以被標記為 `vararg`。如果 `vararg` 參數不是列表中的最後一個，則後續參數的值必須使用具名引數語法傳遞，或者，如果參數具有函式類型，則透過在括號外傳遞 lambda 運算式。

當您呼叫 `vararg` 函式時，您可以單獨傳遞引數，例如 `asList(1, 2, 3)`。如果您已經有一個陣列並想將其內容傳遞給函式，請使用展開運算子（在陣列前加上 `*`）：

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

如果您想將[基本型別陣列](arrays.md#primitive-type-arrays)傳遞給 `vararg`，您需要使用 `toTypedArray()` 函式將其轉換為常規（型別化）陣列：

```kotlin
val a = intArrayOf(1, 2, 3) // IntArray is a primitive type array
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 中綴表示法

標記有 `infix` 關鍵字的函式也可以使用中綴表示法呼叫（省略呼叫的點和括號）。中綴函式必須滿足以下要求：

*   它們必須是成員函式或[擴充函式](extensions.md)。
*   它們必須只有一個參數。
*   參數不得[接受可變數量引數](#variable-number-of-arguments-varargs)且不得有[預設值](#default-arguments)。

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// calling the function using the infix notation
1 shl 2

// is the same as
1.shl(2)
```

> 中綴函式呼叫的優先順序低於算術運算子、型別轉換和 `rangeTo` 運算子。
> 以下表達式是等效的：
> *   `1 shl 2 + 3` 等效於 `1 shl (2 + 3)`
> *   `0 until n * 2` 等效於 `0 until (n * 2)`
> *   `xs union ys as Set<*>` 等效於 `xs union (ys as Set<*>)`
>
> 另一方面，中綴函式呼叫的優先順序高於布林運算子 `&&` 和 `||`、`is`- 和 `in`-檢查，以及一些其他運算子。這些表達式也是等效的：
> *   `a && b xor c` 等效於 `a && (b xor c)`
> *   `a xor b in c` 等效於 `(a xor b) in c`
>
{style="note"}

請注意，中綴函式始終要求指定接收者和參數。當您使用中綴表示法呼叫當前接收者上的方法時，請明確使用 `this`。這是為了確保無歧義的解析。

```kotlin
class MyStringCollection {
    infix fun add(s: String) { /*...*/ }
    
    fun build() {
        this add "abc"   // Correct
        add("abc")       // Correct
        //add "abc"        // Incorrect: the receiver must be specified
    }
}
```

## 函式作用域

Kotlin 函式可以宣告在檔案的頂層，這意味著您不需要建立一個類別來容納一個函式，這在 Java、C# 和 Scala 等語言中是必需的（[頂層定義自 Scala 3 起可用](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)）。除了頂層函式，Kotlin 函式也可以作為成員函式和擴充函式在局部宣告。

### 局部函式

Kotlin 支援局部函式，即在其他函式內部的函式：

```kotlin
fun dfs(graph: Graph) {
    fun dfs(current: Vertex, visited: MutableSet<Vertex>) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v, visited)
    }

    dfs(graph.vertices[0], HashSet())
}
```

局部函式可以存取外部函式的局部變數（[閉包](https://zh.wikipedia.org/zh-tw/%E9%97%AD%E5%8C%85_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6))）。在上述情況下，`visited` 可以是局部變數：

```kotlin
fun dfs(graph: Graph) {
    val visited = HashSet<Vertex>()
    fun dfs(current: Vertex) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v)
    }

    dfs(graph.vertices[0])
}
```

### 成員函式

成員函式是在類別或物件內部定義的函式：

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

成員函式使用點符號呼叫：

```kotlin
Sample().foo() // creates instance of class Sample and calls foo
```

有關類別和覆寫成員的更多資訊，請參閱[類別](classes.md)和[繼承](classes.md#inheritance)。

## 泛型函式

函式可以有泛型參數，這些參數使用尖括號在函式名稱之前指定：

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

有關泛型函式的更多資訊，請參閱[泛型](generics.md)。

## 尾遞迴函式

Kotlin 支援一種稱為[尾遞迴](https://zh.wikipedia.org/wiki/%E5%B0%BE%E8%B0%83%E7%94%A8)的函數式程式設計風格。對於一些通常會使用迴圈的演算法，您可以使用遞迴函式，而不會有堆疊溢位的風險。當函式被標記為 `tailrec` 修飾子並符合所需的正式條件時，編譯器會優化遞迴，轉而留下一個快速高效的基於迴圈的版本：

```kotlin
val eps = 1E-10 // "good enough", could be 10^-15

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

這段程式碼計算了餘弦的[不動點](https://zh.wikipedia.org/wiki/%E4%B8%8D%E5%8B%95%E9%BB%9E_(%E6%95%B0%E5%AD%A6))，這是一個數學常數。它只是重複呼叫 `Math.cos` 從 `1.0` 開始，直到結果不再改變為止，對於指定的 `eps` 精確度，產生 `0.7390851332151611` 的結果。結果程式碼等同於這種更傳統的風格：

```kotlin
val eps = 1E-10 // "good enough", could be 10^-15

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```

為了符合 `tailrec` 修飾子的資格，函式必須將自身呼叫作為其執行的最後一個操作。當遞迴呼叫之後還有更多程式碼、在 `try`/`catch`/`finally` 區塊內，或在開放函式上時，您不能使用尾遞迴。目前，Kotlin 的 JVM 和 Kotlin/Native 都支援尾遞迴。

**另請參閱**：
*   [內聯函式](inline-functions.md)
*   [擴充函式](extensions.md)
*   [高階函式和 Lambda 運算式](lambdas.md)