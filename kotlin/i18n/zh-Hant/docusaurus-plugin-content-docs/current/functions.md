---
title: "函數 (Functions)"
---
Kotlin 函式是使用 `fun` 關鍵字宣告：

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```

## 函式用法

函式使用標準方式呼叫：

```kotlin
val result = double(2)
```

呼叫成員函式使用點表示法：

```kotlin
Stream().read() // 建立 Stream 類別的實例並呼叫 read()
```

### 參數

函式參數使用 Pascal 表示法定義 - *名稱*: *類型*。參數之間用逗號分隔，並且每個
參數都必須明確指定類型：

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

宣告函式參數時，可以使用[結尾逗號](coding-conventions#trailing-commas)：

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 結尾逗號
) { /*...*/ }
```

### 預設引數 (Default arguments)

函式參數可以有預設值，當您跳過相應的引數時，會使用這些預設值。這減少了多載的數量：

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

透過將 `=` 附加到類型來設定預設值。

覆寫方法總是使用基底方法的預設參數值。
當覆寫具有預設參數值的方法時，預設參數值必須從簽章中省略：

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // 不允許預設值。
}
```

如果預設參數位於沒有預設值的參數之前，則只能透過使用[具名引數](#named-arguments)呼叫函式來使用預設值：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // 使用預設值 bar = 0
```

如果預設參數之後的最後一個引數是 [lambda](lambdas#lambda-expression-syntax)，
您可以將它作為具名引數傳遞，或者[在括號之外傳遞](lambdas#passing-trailing-lambdas)：

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int = 1,
    qux: () `->` Unit,
) { /*...*/ }

foo(1) { println("hello") }     // 使用預設值 baz = 1
foo(qux = { println("hello") }) // 同時使用預設值 bar = 0 和 baz = 1
foo { println("hello") }        // 同時使用預設值 bar = 0 和 baz = 1
```

### 具名引數 (Named arguments)

您可以在呼叫函式時，命名函式的一個或多個引數。當函式有很多引數，並且難以將值與引數關聯時，這會很有幫助，尤其是在它是布林值或 `null` 值時。

當您在函式呼叫中使用具名引數時，您可以自由變更它們在其中列出的順序。如果您想要使用它們的預設值，您可以完全省略這些引數。

考慮具有 4 個具有預設值的引數的 `reformat()` 函式。

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

呼叫此函式時，您不必命名它的所有引數：

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

您也可以跳過具有預設值的特定引數，而不是省略所有引數。但是，在第一個
跳過的引數之後，您必須命名所有後續引數：

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

您可以使用 `spread` 運算子，透過名稱傳遞[可變數量的引數 (`vararg`)](#variable-number-of-arguments-varargs)：

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

:::note
在 JVM 上呼叫 Java 函式時，您無法使用具名引數語法，因為 Java 位元碼並不
總是保留函式參數的名稱。

:::

### Unit 回傳函式 (Unit-returning functions)

如果函式沒有回傳有用的值，則其回傳類型為 `Unit`。`Unit` 是一種只有一個值的類型 - `Unit`。
此值不必明確回傳：

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` 或 `return` 是可選的
}
```

`Unit` 回傳類型宣告也是可選的。上述程式碼等效於：

```kotlin
fun printHello(name: String?) { ... }
```

### 單一表達式函式 (Single-expression functions)

當函式主體由單一表達式組成時，可以省略花括號，並在 `=` 符號後指定主體：

```kotlin
fun double(x: Int): Int = x * 2
```

當編譯器可以推斷時，明確宣告回傳類型是[可選的](#explicit-return-types)：

```kotlin
fun double(x: Int) = x * 2
```

### 明確回傳類型 (Explicit return types)

具有程式碼區塊主體的函式必須始終明確指定回傳類型，除非它們旨在回傳 `Unit`，
[在這種情況下，指定回傳類型是可選的](#unit-returning-functions)。

Kotlin 不會推斷具有程式碼區塊主體的函式的回傳類型，因為此類函式可能在主體中具有複雜的控制流程，
並且回傳類型對於讀者（有時甚至對於編譯器）來說是不明顯的。

### 可變數量的引數 (varargs)

您可以使用 `vararg` 修飾符標記函式的參數（通常是最後一個）：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts 是一個陣列
        result.add(t)
    return result
}
```

在這種情況下，您可以將可變數量的引數傳遞給函式：

```kotlin
val list = asList(1, 2, 3)
```

在函式內部，類型 `T` 的 `vararg` 參數顯示為 `T` 的陣列，如上面的範例所示，其中 `ts`
變數的類型為 `Array<out T>`。

只有一個參數可以標記為 `vararg`。如果 `vararg` 參數不是清單中的最後一個，則可以使用具名引數語法傳遞後續參數的值，或者，如果參數具有函式類型，則可以透過在括號之外傳遞 lambda 來傳遞。

當您呼叫 `vararg` 函式時，您可以個別傳遞引數，例如 `asList(1, 2, 3)`。如果您已經有
一個陣列，並且想要將其內容傳遞給函式，請使用 *spread* 運算子（在陣列前面加上 `*`）：

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

如果您想將 [基本類型陣列](arrays#primitive-type-arrays)
傳遞到 `vararg` 中，您需要使用 `toTypedArray()` 函式將其轉換為常規（類型化）陣列：

```kotlin
val a = intArrayOf(1, 2, 3) // IntArray 是一個基本類型陣列
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 中綴表示法 (Infix notation)

使用 `infix` 關鍵字標記的函式也可以使用中綴表示法呼叫（省略呼叫的點和括號）。中綴函式必須滿足以下要求：

* 它們必須是成員函式或[擴充函式](extensions)。
* 它們必須只有一個參數。
* 參數不得[接受可變數量的引數](#variable-number-of-arguments-varargs)並且必須沒有[預設值](#default-arguments)。

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// 使用中綴表示法呼叫函式
1 shl 2

// 與以下相同
1.shl(2)
```

:::note
中綴函式呼叫的優先順序低於算術運算子、類型轉換和 `rangeTo` 運算子。
以下表達式是等效的：
* `1 shl 2 + 3` 等效於 `1 shl (2 + 3)`
* `0 until n * 2` 等效於 `0 until (n * 2)`
* `xs union ys as Set<*>` 等效於 `xs union (ys as Set<*>)`

另一方面，中綴函式呼叫的優先順序高於布林運算子 `&&` 和 `||`、`is`-
和 `in`-checks 以及其他一些運算子。這些表達式也是等效的：
* `a && b xor c` 等效於 `a && (b xor c)`
* `a xor b in c` 等效於 `(a xor b) in c`

:::

請注意，中綴函式始終需要指定接收器和參數。當您
使用中綴表示法在目前的接收器上呼叫方法時，請明確使用 `this`。這是確保
明確解析所必需的。

```kotlin
class MyStringCollection {
    infix fun add(s: String) { /*...*/ }
    
    fun build() {
        this add "abc"   // 正確
        add("abc")       // 正確
        //add "abc"        // 不正確：必須指定接收器
    }
}
```

## 函式作用域 (Function scope)

Kotlin 函式可以在檔案的頂層宣告，這表示您不需要建立一個類別來保存函式，
您需要在 Java、C# 和 Scala 等語言中執行此操作（[自 Scala 3 以來，頂層定義可用](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)）。除了頂層函式之外，Kotlin 函式也可以在本地宣告為成員函式和擴充函式。

### 區域函式 (Local functions)

Kotlin 支援區域函式，即其他函式內部的函式：

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

區域函式可以存取外部函式的區域變數（閉包）。在上面的範例中，`visited` 可以是一個區域變數：

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

### 成員函式 (Member functions)

成員函式是在類別或物件內部定義的函式：

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

成員函式使用點表示法呼叫：

```kotlin
Sample().foo() // 建立 Sample 類別的實例並呼叫 foo
```

有關類別和覆寫成員的更多資訊，請參閱 [類別](classes) 和 [繼承](classes#inheritance)。

## 泛型函式 (Generic functions)

函式可以具有泛型參數，這些參數在使用函式名稱之前的角括號中指定：

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

有關泛型函式的更多資訊，請參閱 [泛型](generics)。

## 尾遞迴函式 (Tail recursive functions)

Kotlin 支援一種稱為[尾遞迴](https://en.wikipedia.org/wiki/Tail_call)的函數式程式設計風格。
對於某些通常會使用迴圈的演算法，您可以改為使用遞迴函式，而沒有堆疊溢位的風險。
當一個函式使用 `tailrec` 修飾符標記，並且滿足所需的正式條件時，編譯器會最佳化掉
遞迴，而是留下一個快速且有效率的基於迴圈的版本：

```kotlin
val eps = 1E-10 // "夠好"，可能是 10^-15

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

此程式碼計算餘弦的 `fixpoint`，這是一個數學常數。它只是從 `1.0` 開始重複呼叫 `Math.cos`
，直到結果不再變更為止，對於指定的 `eps` 精度，產生 `0.7390851332151611` 的結果。產生的程式碼等效於這種更傳統的風格：

```kotlin
val eps = 1E-10 // "夠好"，可能是 10^-15

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```

要符合 `tailrec` 修飾符的資格，函式必須呼叫自身作為其執行的最後一個操作。您不能使用
尾遞迴，如果在遞迴呼叫之後有更多程式碼，在 `try`/`catch`/`finally` 程式碼區塊中，或者在 open 函式上。
目前，Kotlin 對於 JVM 和 Kotlin/Native 支援尾遞迴。

**另請參閱**:
* [內聯函式](inline-functions)
* [擴充函式](extensions)
* [高階函式和 lambda](lambdas)