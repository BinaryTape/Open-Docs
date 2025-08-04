[//]: # (title: 函數)

Kotlin 函數使用 `fun` 關鍵字宣告：

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```

## 函數使用方式

函數呼叫使用標準方式：

```kotlin
val result = double(2)
```

呼叫成員函數使用點標記法：

```kotlin
Stream().read() // create instance of class Stream and call read()
```

### 參數

函數參數使用帕斯卡標記法定義 - *名稱*: *型別*。參數之間使用逗號分隔，且每個參數都必須明確指定型別：

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

您可以宣告函數參數時使用[尾隨逗號](coding-conventions.md#trailing-commas)：

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // trailing comma
) { /*...*/ }
```

### 帶有預設值的參數

函數參數可以有預設值，當您省略對應的引數時會使用這些預設值。這減少了多載的數量：

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

此類參數也稱為「可選參數」。

預設值透過在型別後方附加 `=` 來設定。

覆寫方法總是使用基礎方法的預設參數值。當覆寫具有預設參數值的方法時，預設參數值必須從簽章中省略：

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // No default value is allowed.
}
```

如果具有預設值的參數位於沒有預設值的參數之前，則只能透過使用[命名引數](#named-arguments)呼叫函數來使用預設值：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // The default value bar = 0 is used
```

如果所有預設值參數之後的最後一個參數是函數型別，那麼您可以將對應的 [lambda](lambdas.md#lambda-expression-syntax) 引數作為命名引數傳遞，或[在括號外部](lambdas.md#passing-trailing-lambdas)傳遞：

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

### 命名引數

呼叫函數時，您可以命名函數的一個或多個引數。當函數有許多引數且難以將值與引數關聯起來時，這會很有幫助，特別是當它是布林值或 `null` 值時。

當您在函數呼叫中使用命名引數時，您可以自由改變它們列出的順序。如果您想使用它們的預設值，您可以完全省略這些引數。

考慮 `reformat()` 函數，它有 4 個帶有預設值的引數。

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

呼叫此函數時，您不必命名所有引數：

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

您可以省略所有帶有預設值的參數：

```kotlin
reformat("This is a long String!")
```

您也可以省略帶有預設值的特定引數，而不只是全部省略。但是，在第一個被省略的引數之後，您必須命名所有後續引數：

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

您可以使用「展開 (spread)」運算子（在陣列前加上 `*`）傳遞帶名稱的[可變數量引數 (`vararg`)](#variable-number-of-arguments-varargs)：

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

> 當在 JVM 上呼叫 Java 函數時，您不能使用命名引數語法，因為 Java 位元碼不總是保留函數參數的名稱。
>
{style="note"}

### 返回 `Unit` 的函數

如果函數不返回任何有用值，其返回型別是 `Unit`。`Unit` 是一種只有一個值 — `Unit` 的型別。這個值不必明確返回：

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` or `return` is optional
}
```

`Unit` 返回型別宣告也是可選的。上述程式碼等同於：

```kotlin
fun printHello(name: String?) { ... }
```

### 單一表達式函數

當函數主體由單一表達式組成時，花括號可以省略，並且主體在 `=` 符號後指定：

```kotlin
fun double(x: Int): Int = x * 2
```

當返回型別可以由編譯器推斷時，[明確宣告返回型別](#explicit-return-types)是可選的：

```kotlin
fun double(x: Int) = x * 2
```

### 明確返回型別

具有區塊主體的函數必須總是明確指定返回型別，除非它們旨在返回 `Unit`（[在這種情況下，指定返回型別是可選的](#unit-returning-functions)）。

Kotlin 不會為具有區塊主體的函數推斷返回型別，因為此類函數在主體中可能具有複雜的控制流，並且返回型別對讀者（有時甚至對編譯器）來說將不明顯。

### 可變數量引數 (varargs)

您可以將函數的一個參數（通常是最後一個）標記為 `vararg` 修飾符：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts is an Array
        result.add(t)
    return result
}
```

在這種情況下，您可以向函數傳遞可變數量引數：

```kotlin
val list = asList(1, 2, 3)
```

在函數內部，型別為 `T` 的 `vararg` 參數顯示為 `T` 的陣列，如上例所示，其中 `ts` 變數的型別為 `Array<out T>`。

只有一個參數可以標記為 `vararg`。如果 `vararg` 參數不是列表中的最後一個，則必須使用命名引數語法傳遞後續參數的值，或者，如果參數具有函數型別，則通過在括號外部傳遞 lambda。

當您呼叫 `vararg` 函數時，您可以單獨傳遞引數，例如 `asList(1, 2, 3)`。如果您已經有一個陣列並希望將其內容傳遞給函數，請使用展開運算子（在陣列前加上 `*`）：

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

如果您想將[基本型別陣列](arrays.md#primitive-type-arrays)傳遞給 `vararg`，您需要使用 `toTypedArray()` 函數將其轉換為常規（型別化）陣列：

```kotlin
val a = intArrayOf(1, 2, 3) // IntArray is a primitive type array
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 中綴標記法

用 `infix` 關鍵字標記的函數也可以使用中綴標記法呼叫（呼叫時省略點和括號）。中綴函數必須符合以下要求：

*   它們必須是[成員函數](extensions.md)或[擴充函數](extensions.md)。
*   它們必須只有一個參數。
*   該參數不得[接受可變數量引數](#variable-number-of-arguments-varargs)，且不得有[預設值](#parameters-with-default-values)。

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// calling the function using the infix notation
1 shl 2

// is the same as
1.shl(2)
```

> 中綴函數呼叫的優先級低於算術運算子、型別轉換和 `rangeTo` 運算子。以下表達式是等價的：
> *   `1 shl 2 + 3` 等同於 `1 shl (2 + 3)`
> *   `0 until n * 2` 等同於 `0 until (n * 2)`
> *   `xs union ys as Set<*>` 等同於 `xs union (ys as Set<*>)`
>
> 另一方面，中綴函數呼叫的優先級高於布林運算子 `&&` 和 `||`、`is`- 和 `in`-檢查，以及一些其他運算子。這些表達式也等價：
> *   `a && b xor c` 等同於 `a && (b xor c)`
> *   `a xor b in c` 等同於 `(a xor b) in c`
>
{style="note"}

請注意，中綴函數總是需要指定接收者和參數。當您使用中綴標記法在當前接收者上呼叫方法時，請明確使用 `this`。這是為了確保明確的解析所必需的。

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

## 函數作用域

Kotlin 函數可以在檔案的頂層宣告，這意味著您不需要像 Java、C# 和 Scala 等語言那樣創建一個類來包含函數（[頂層定義從 Scala 3 開始可用](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)）。除了頂層函數，Kotlin 函數還可以作為成員函數和擴充函數在局部宣告。

### 局部函數

Kotlin 支援局部函數，它們是函數內部的函數：

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

局部函數可以存取外部函數的局部變數（閉包）。在上述情況中，`visited` 可以是一個局部變數：

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

### 成員函數

成員函數是在類或物件內部定義的函數：

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

成員函數透過點標記法呼叫：

```kotlin
Sample().foo() // creates instance of class Sample and calls foo
```

有關類別和覆寫成員的更多資訊，請參閱[類別](classes.md)和[繼承](classes.md#inheritance)。

## 泛型函數

函數可以有泛型參數，這些參數在函數名稱前的尖括號中指定：

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

有關泛型函數的更多資訊，請參閱[泛型](generics.md)。

## 尾遞歸函數

Kotlin 支援一種稱為[尾遞歸](https://en.wikipedia.org/wiki/Tail_call)的函數式編程風格。對於某些通常使用迴圈的演算法，您可以使用遞歸函數代替，而不會有堆疊溢出的風險。當函數標記為 `tailrec` 修飾符並滿足所需的形式條件時，編譯器會優化掉遞歸，轉而留下一個快速高效的基於迴圈的版本：

```kotlin
val eps = 1E-10 // "good enough", could be 10^-15

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

此程式碼計算餘弦的 `fixpoint`（不動點），這是一個數學常數。它只是從 `1.0` 開始重複呼叫 `Math.cos`，直到結果不再改變，為指定的 `eps` 精確度產生 `0.7390851332151611` 的結果。產生的程式碼等同於這種更傳統的風格：

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

要符合 `tailrec` 修飾符的條件，函數必須將自身呼叫作為其執行的最後一個操作。當遞歸呼叫之後還有更多程式碼，或者在 `try`/`catch`/`finally` 區塊內，或者在開放函數上時，您不能使用尾遞歸。目前，Kotlin 的 JVM 和 Kotlin/Native 都支援尾遞歸。

**另請參閱**：
*   [內聯函數](inline-functions.md)
*   [擴充函數](extensions.md)
*   [高階函數和 lambda](lambdas.md)