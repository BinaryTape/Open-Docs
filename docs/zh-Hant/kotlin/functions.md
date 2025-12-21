[//]: # (title: 函數)

要在 Kotlin 中宣告函數：
* 使用 `fun` 關鍵字。
* 在圓括號 `()` 中指定參數。
* 如果需要，包含 [返回型別](#return-types)。

例如：

```kotlin
//sampleStart
// 'double' 是函數名稱
// 'x' 是 Int 型別的參數
// 預期的返回值也是 Int 型別
fun double(x: Int): Int {
    return 2 * x
}
//sampleEnd

fun main() {
    println(double(5))
    // 10
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="kotlin-function-double"}

## 函數使用方式

函數呼叫使用標準方式：

```kotlin
val result = double(2)
```

要呼叫[成員](classes.md)或[擴充函數](extensions.md#extension-functions)，請使用點 `.`：

```kotlin
// 創建 Stream 類別的實例並呼叫 read()
Stream().read()
```

### 參數

使用帕斯卡標記法宣告函數參數：`名稱: 型別`。
您必須使用逗號分隔參數，並為每個參數明確指定型別：

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

在函數主體內部，接收到的引數是唯讀的（隱式宣告為 `val`）：

```kotlin
fun powerOf(number: Int, exponent: Int): Int {
    number = 2 // 錯誤：'val' 無法被重新賦值。
}
```

您可以在宣告函數參數時使用[尾隨逗號](coding-conventions.md#trailing-commas)：

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 尾隨逗號
) { /*...*/ }
```

尾隨逗號有助於重構和程式碼維護：
您可以在宣告內移動參數，而不必擔心哪個會是最後一個。

> Kotlin 函數可以接收其他函數作為參數 — 並作為引數傳遞。
> 有關更多資訊，請參閱 [](lambdas.md)。
>
{style="note"}

### 帶有預設值的參數 {id="parameters-with-default-values"}

您可以為函數參數指定預設值，使其成為可選。
當您呼叫函數時未提供與該參數對應的引數時，Kotlin 會使用該預設值。
帶有預設值的參數也稱為 _可選參數_。

可選參數減少了對多個重載的需求，因為您不必宣告函數的不同版本，
只為了允許跳過帶有合理預設值的參數。

透過在參數宣告後附加 `=` 來設定預設值：

```kotlin
fun read(
    b: ByteArray,
    // 'off' 的預設值為 0
    off: Int = 0,
    // 'len' 的預設值是根據 'b' 陣列的大小計算而來
    len: Int = b.size,
) { /*...*/ }
```

當您在沒有預設值的參數之前宣告一個**帶有**預設值的參數時，
您只能透過[命名引數](#named-arguments)來使用預設值：

```kotlin
fun greeting(
    userId: Int = 0,
    message: String,
) { /*...*/ }

fun main() {
    // 使用 0 作為 'userId' 的預設值
    greeting(message = "Hello!")
    
    // 錯誤：沒有為參數 'userId' 傳遞值
    greeting("Hello!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="default-before-ordinary"}

[尾隨 lambda](lambdas.md#passing-trailing-lambdas) 是此規則的例外，
因為最後一個參數必須對應傳遞的函數：

```kotlin
fun main () {
//sampleStart    
fun greeting(
    userId: Int = 0,
    message: () -> Unit,
)
{ println(userId)
  message() }
    
// 使用 'userId' 的預設值
greeting() { println ("Hello!") }
// 0
// Hello!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="default-before-trailing-lambda"}

[覆寫方法](inheritance.md#overriding-methods)總是使用基礎方法的預設參數值。
當您覆寫具有預設參數值的方法時，必須從簽章中省略預設參數值：

```kotlin
open class Shape {
    open fun draw(width: Int = 10, height: Int = 5) { /*...*/ }
}

class Rectangle : Shape() {
    // 不允許在此處指定預設值
    // 但此函數也預設使用 10 作為 'width'，5 作為 'height'。
    override fun draw(width: Int, height: Int) { /*...*/ }
}
```

#### 非常數表達式作為預設值

您可以為參數賦予一個非常數的預設值。
例如，預設值可以是函數呼叫的結果或使用其他引數值的計算結果，
就像此範例中的 `len` 參數一樣：

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

引用其他參數值的參數必須在宣告順序中稍後宣告。
在此範例中，`len` 必須在 `b` 之後宣告。

一般而言，您可以將任何表達式賦予為參數的預設值。
然而，預設值只有在呼叫函數時**沒有**對應的參數且需要賦予預設值時才被評估。
例如，此函數僅在呼叫時沒有 `print` 參數時才會印出一行：

```kotlin
fun main() {
//sampleStart
    fun read(
        b: Int,
        print: Unit? = println("沒有為 'print' 傳遞引數")
    ) { println(b) }
    
    // 印出 "沒有為 'print' 傳遞引數"，然後印出 "1"
    read(1)
    // 只印出 "1"
    read(1, null)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="non-constant-default"}

如果函數宣告中的最後一個參數是函數型別，
您可以將對應的 [lambda](lambdas.md#lambda-expression-syntax) 引數作為命名引數傳遞，或[在括號外部](lambdas.md#passing-trailing-lambdas)傳遞：

```kotlin
fun main() {
    //sampleStart
    fun log(
        level: Int = 0,
        code:  Int = 1,
        action: () -> Unit,
    ) { println (level)
        println (code)
        action() }
    
    // 為 'level' 傳遞 1，並使用 'code' 的預設值 1
    log(1) { println("連線已建立") }
    
    // 使用兩個預設值，'level' 為 0，'code' 為 1
    log(action = { println("連線已建立") })
    
    // 等同於前一個呼叫，使用兩個預設值
    log { println("連線已建立") }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="lambda-outside-parentheses"}

### 命名引數

呼叫函數時，您可以命名函數的一個或多個引數。
當函數呼叫有許多引數時，這會很有幫助。
在這種情況下，很難將值與引數關聯起來，特別是當它是 `null` 或布林值時。

當您在函數呼叫中使用命名引數時，您可以以任何順序列出它們。

考慮 `reformat()` 函數，它有 4 個帶有預設值的引數：

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

呼叫此函數時，您可以命名部分引數：

```kotlin
reformat(
    "String!",
    normalizeCase = false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

您可以省略所有帶有預設值的引數：

```kotlin
reformat("This is a long String!")
```

您也可以省略**部分**帶有預設值的引數，而不是全部省略。
然而，在第一個被省略的引數之後，您必須命名所有後續引數：

```kotlin
reformat(
    "This is a short String!",
    upperCaseFirstLetter = false,
    wordSeparator = '_'
)
```

您可以透過命名對應的引數來傳遞[可變數量引數](#variable-number-of-arguments-varargs) (`vararg`)。
在此範例中，它是一個陣列：

```kotlin
fun mergeStrings(vararg strings: String) { /*...*/ }

mergeStrings(strings = arrayOf("a", "b", "c"))
```

<!-- Rationale for named arguments interaction with varargs is here https://youtrack.jetbrains.com/issue/KT-52505#focus=Comments-27-6147916.0-0 -->

> 當在 JVM 上呼叫 Java 函數時，您不能使用命名引數語法，因為 Java 位元碼不總是
> 保留函數參數的名稱。
>
{style="note"}

### 返回型別

當您宣告一個帶有區塊主體（將指令放在花括號 `{}` 內）的函數時，
您必須始終明確指定返回型別。
唯一的例外是當它們返回 `Unit` 時，
[在這種情況下，指定返回型別是可選的](#unit-returning-functions)。

Kotlin 不會為帶有區塊主體的函數推斷返回型別。
它們的控制流可能很複雜，這使得返回型別對讀者（有時甚至對編譯器）來說不明確。
然而，如果未指定，Kotlin 可以為[單一表達式函數](#single-expression-functions)推斷返回型別。

### 單一表達式函數

當函數主體由單一表達式組成時，您可以省略花括號，並在 `=` 符號後指定主體：

```kotlin
fun double(x: Int): Int = x * 2
```

大多數時候，您不必明確宣告[返回型別](#return-types)：

```kotlin
// 編譯器推斷函數返回 Int
fun double(x: Int) = x * 2
```

編譯器有時在從單一表達式推斷返回型別時會遇到問題。
在這種情況下，您應該明確添加返回型別。
例如，遞歸或互遞歸（互相呼叫）的函數
以及像 `fun empty() = null` 這樣無型別表達式的函數總是需要返回型別。

當您使用推斷的返回型別時，
請務必檢查實際結果，因為編譯器可能會推斷出對您來說不太有用的型別。
在上面的範例中，如果您希望 `double()` 函數返回 `Number` 而不是 `Int`，
您必須明確宣告這一點。

### 返回 `Unit` 的函數

如果函數具有區塊主體（花括號 `{}` 內的指令）並且不返回任何有用值，
編譯器會假設其返回型別是 `Unit`。
`Unit` 是一種只有一個值 — `Unit` 的型別。

您不必將 `Unit` 指定為返回型別，除了函數型別參數。
您永遠不必明確返回 `Unit`。

例如，您可以宣告一個 `printHello()` 函數而不返回 `Unit`：

```kotlin
// 函數型別參數 ('action') 的宣告仍然需要明確的返回型別
fun printHello(name: String?, action: () -> Unit) {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")

    action()
}

fun main() {
    printHello("Kodee") {
        println("這會在問候語之後執行。")
    }
    // Hello Kodee
    // 這會在問候語之後執行。

    printHello(null) {
        println("未提供名稱，但動作仍然執行。")
    }
    // 未提供名稱，但動作仍然執行
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="return-unit-implicit"}

這等同於以下冗長的宣告：

```kotlin
//sampleStart
fun printHello(name: String?, action: () -> Unit): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")

    action()
    return Unit
}
//sampleEnd
fun main() {
    printHello("Kodee") {
        println("這會在問候語之後執行。")
    }
    // Hello Kodee
    // 這會在問候語之後執行。

    printHello(null) {
        println("未提供名稱，但動作仍然執行。")
    }
    // 未提供名稱，但動作仍然執行
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="return-unit-explicit"}

如果函數的返回型別有明確指定，您可以在表達式主體內部使用 `return` 語句：

```kotlin
fun getDisplayNameOrDefault(userId: String?): String =
    getDisplayName(userId ?: return "default")
```

### 可變數量引數 (varargs)

要向函數傳遞可變數量引數，您可以使用 `vararg` 修飾符標記其參數之一
（通常是最後一個）。
在函數內部，您可以將型別為 `T` 的 `vararg` 參數用作 `T` 的陣列：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts 是一個 Array
        result.add(t)
    return result
}
```

然後您可以向函數傳遞可變數量引數：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts 是一個 Array
        result.add(t)
    return result
}

fun main() {
    //sampleStart
    val list = asList(1, 2, 3)
    println(list)
    // [1, 2, 3]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="varargs-aslist"}

只有一個參數可以標記為 `vararg`。
如果您將 `vararg` 參數宣告在參數列表中的其他位置而不是最後，您必須使用命名引數語法傳遞後續參數的值。
如果參數具有函數型別，您也可以將其值放在括號外部傳遞 lambda。

當您呼叫 `vararg` 函數時，您可以單獨傳遞引數，如 `asList(1, 2, 3)` 範例所示。
如果您已經有一個陣列並希望將其內容作為 `vararg` 參數或其一部分傳遞給函數，
請使用[展開運算子](arrays.md#pass-variable-number-of-arguments-to-a-function)，在陣列名稱前加上 `*`：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts)
        result.add(t)
    return result
}

fun main() {
    //sampleStart
    val a = arrayOf(1, 2, 3)

    // 函數接收陣列 [-1, 0, 1, 2, 3, 4]
    val list = asList(-1, 0, *a, 4)

    println(list)
    // [-1, 0, 1, 2, 3, 4]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="varargs-aslist-with-array"}

如果您想將[基本型別陣列](arrays.md#primitive-type-arrays)
作為 `vararg` 傳遞，您需要使用 [`.toTypedArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-typed-array.html) 函數將其轉換為常規（型別化）陣列：

```kotlin
// 'a' 是一個 IntArray，它是一個基本型別陣列
val a = intArrayOf(1, 2, 3)
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 中綴標記法

您可以使用 `infix` 關鍵字宣告可以不帶括號或點呼叫的函數。
這有助於使程式碼中的簡單函數呼叫更容易閱讀。

```kotlin
infix fun Int.shl(x: Int): Int { /*...*/ }

// 使用通用標記法呼叫函數
1.shl(2)

// 使用中綴標記法呼叫函數
1 shl 2
```

中 infix 函數必須符合以下要求：

*   它們必須是類別的成員函數或[擴充函數](extensions.md)。
*   它們必須只有一個參數。
*   該參數不得[接受可變數量引數](#variable-number-of-arguments-varargs) (`vararg`)，且不得有[預設值](#parameters-with-default-values)。

> 中綴函數呼叫的優先級低於算術運算子、型別轉換和 `rangeTo` 運算子。
> 以下表達式是等價的：
> *   `1 shl 2 + 3` 等同於 `1 shl (2 + 3)`
> *   `0 until n * 2` 等同於 `0 until (n * 2)`
> *   `xs union ys as Set<*>` 等同於 `xs union (ys as Set<*>)`
>
> 另一方面，中綴函數呼叫的優先級高於布林運算子 `&&` 和 `||`、`is`- 和 `in`-檢查，以及其他一些運算子。這些表達式也等價：
> *   `a && b xor c` 等同於 `a && (b xor c)`
> *   `a xor b in c` 等同於 `(a xor b) in c`
>
{style="note"}

請注意，中綴函數總是需要指定接收者和參數。
當您使用中 infix 標記法在當前接收者上呼叫方法時，請明確使用 `this`。
這是為了確保明確的解析所必需的。

```kotlin
class MyStringCollection {
    val items = mutableListOf<String>()

    infix fun add(s: String) {
        println("Adding: $s")
        items += s
    }

    fun build() {
        add("first")      // 正確：一般函數呼叫
        this add "second" // 正確：帶有明確接收者的中綴呼叫
        // add "third"    // 編譯器錯誤：需要明確的接收者
    }

    fun printAll() = println("Items = $items")
}

fun main() {
    val myStrings = MyStringCollection()
    // 將 "first" 和 "second" 兩次添加到列表中
    myStrings.build()
      
    myStrings.printAll()
    // Adding: first
    // Adding: second
    // Items = [first, second]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="infix-notation-example"}

## 函數作用域

您可以將 Kotlin 函數宣告在檔案的頂層，這意味著您不需要創建一個類來包含函數。
函數也可以作為 _成員函數_ 或 _擴充函數_ 在局部宣告。

### 局部函數

Kotlin 支援局部函數，它們是宣告在其他函數內部的函數。
例如，以下程式碼實作了給定圖的深度優先搜尋演算法。
外部 `dfs()` 函數內部的局部 `dfs()` 函數用於隱藏實作並處理遞歸呼叫：

```kotlin
class Person(val name: String) {
    val friends = mutableListOf<Person>()
}
class SocialGraph(val people: List<Person>)
//sampleStart
fun dfs(graph: SocialGraph) {
    fun dfs(current: Person, visited: MutableSet<Person>) {
        if (!visited.add(current)) return
        println("Visited ${current.name}")
        for (friend in current.friends)
            dfs(friend, visited)
    }
    dfs(graph.people[0], HashSet())
}
//sampleEnd
fun main() {
    val alice = Person("Alice")
    val bob = Person("Bob")
    val charlie = Person("Charlie")
    alice.friends += bob
    bob.friends += charlie
    charlie.friends += alice
    val network = SocialGraph(listOf(alice, bob, charlie))
    dfs(network)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="local-functions-dfs"}

局部函數可以存取外部函數的局部變數（閉包）。
在上述情況中，`visited` 函數參數可以是一個局部變數：

```kotlin
class Person(val name: String) {
    val friends = mutableListOf<Person>()
}
class SocialGraph(val people: List<Person>)
//sampleStart
fun dfs(graph: SocialGraph) {
    val visited = HashSet<Person>()
    fun dfs(current: Person) {
        if (!visited.add(current)) return
        println("Visited ${current.name}")
        for (friend in current.friends)
            dfs(friend)
    }
    dfs(graph.people[0])
}
//sampleEnd
fun main() {
    val alice = Person("Alice")
    val bob = Person("Bob")
    val charlie = Person("Charlie")
    alice.friends += bob
    bob.friends += charlie
    charlie.friends += alice
    val network = SocialGraph(listOf(alice, bob, charlie))
    dfs(network)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="local-functions-dfs-with-local-variable"}

### 成員函數

成員函數是定義在類或物件內部的函數：

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

要呼叫成員函數，請寫下實例或物件名稱，然後加上 `.` 並寫下函數名稱：

```kotlin
// 創建 Stream 類別的實例並呼叫 read()
Stream().read()
```

有關類別和覆寫成員的更多資訊，請參閱[類別](classes.md)和[繼承](classes.md#inheritance)。

## 泛型函數

您可以在函數名稱前的尖括號 `<>` 中指定函數的泛型參數：

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

有關泛型函數的更多資訊，請參閱[泛型](generics.md)。

## 尾遞歸函數

Kotlin 支援一種稱為[尾遞歸](https://en.wikipedia.org/wiki/Tail_call)的函數式編程風格。
對於某些通常使用迴圈的演算法，您可以使用遞歸函數代替，而不會有堆疊溢出的風險。
當函數標記為 `tailrec` 修飾符並滿足所需的形式條件時，編譯器會優化掉遞歸，
轉而留下一個快速高效的基於迴圈的版本：

```kotlin
import kotlin.math.cos
import kotlin.math.abs

// 任意「足夠好」的精確度
val eps = 1E-10

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (abs(x - cos(x)) < eps) x else findFixPoint(cos(x))
```

此程式碼計算餘弦的不動點（一個數學常數）。
該函數從 `1.0` 開始重複呼叫 `cos()`，直到結果不再改變，
為指定的 `eps` 精確度產生 `0.7390851332151611` 的結果。
此程式碼等同於這種更傳統的風格：

```kotlin
import kotlin.math.cos
import kotlin.math.abs

// 任意「足夠好」的精確度
val eps = 1E-10

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = cos(x)
        if (abs(x - y) < eps) return x
        x = cos(x)
    }
}
```

您只能在函數將自身呼叫作為其執行的最後一個操作時，才能將 `tailrec` 修飾符應用於該函數。
當遞歸呼叫之後還有更多程式碼時，在 [`try`/`catch`/`finally` 區塊](exceptions.md#handle-exceptions-using-try-catch-blocks)內，
或當函數是[開放](inheritance.md)函數時，您不能使用尾遞歸。

**另請參閱**：
*   [內聯函數](inline-functions.md)
*   [擴充函數](extensions.md)
*   [高階函數和 lambda](lambdas.md)