[//]: # (title: 基本語法)

這是一個包含基本語法元素及範例的集合。在每個章節的末尾，您會找到指向相關主題詳細描述的連結。

您也可以透過 JetBrains Academy 的免費 [Kotlin 核心軌跡](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) 學習所有 Kotlin 的基礎知識。

## 套件定義與匯入

套件規範應位於原始碼檔案的頂部：

```kotlin
package my.demo

import kotlin.text.*

// ...
```

檔案目錄不需與套件名稱相符：原始碼檔案可以任意放置在檔案系統中。

請參閱 [套件](packages.md)。

## 程式進入點

Kotlin 應用程式的進入點是 `main` 函數：

```kotlin
fun main() {
    println("Hello world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-hello-world"}

`main` 的另一種形式接受可變數量的 `String` 引數：

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 列印到標準輸出

`print` 將其引數列印到標準輸出：

```kotlin
fun main() {
//sampleStart
    print("Hello ")
    print("world!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-print"}

`println` 列印其引數並新增一個換行符號，以便您列印的下一個內容出現在下一行：

```kotlin
fun main() {
//sampleStart
    println("Hello world!")
    println(42)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-println"}

## 從標準輸入讀取

`readln()` 函數從標準輸入讀取。此函數會將使用者輸入的整行內容讀取為字串。

您可以將 `println()`、`readln()` 和 `print()` 函數一起使用，以列印請求和顯示使用者輸入的訊息：

```kotlin
// Prints a message to request input
println("Enter any word: ")

// Reads and stores the user input. For example: Happiness
val yourWord = readln()

// Prints a message with the input
print("You entered the word: ")
print(yourWord)
// You entered the word: Happiness
```

更多資訊請參閱 [讀取標準輸入](read-standard-input.md)。

## 函數

一個具有兩個 `Int` 參數和 `Int` 回傳型別的函數：

```kotlin
//sampleStart
fun sum(a: Int, b: Int): Int {
    return a + b
}
//sampleEnd

fun main() {
    print("sum of 3 and 5 is ")
    println(sum(3, 5))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-return-int"}

函數主體可以是表達式。其回傳型別會被推斷 (inferred)：

```kotlin
//sampleStart
fun sum(a: Int, b: Int) = a + b
//sampleEnd

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-expression"}

一個不回傳有意義值的函數：

```kotlin
//sampleStart
fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-return-unit"}

`Unit` 回傳型別可以省略：

```kotlin
//sampleStart
fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-omit-unit"}

請參閱 [函數](functions.md)。

## 變數

在 Kotlin 中，您使用關鍵字 `val` 或 `var` 宣告變數，後跟變數名稱。

使用 `val` 關鍵字來宣告只被賦值一次的變數。這些是不可變的 (immutable)、唯讀的 (read-only) 局部變數，初始化後不能重新賦予不同的值：

```kotlin
fun main() {
//sampleStart
    // Declares the variable x and initializes it with the value of 5
    val x: Int = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-val"}

使用 `var` 關鍵字來宣告可以重新賦值的變數。這些是可變的 (mutable) 變數，您可以在初始化後更改其值：

```kotlin
fun main() {
//sampleStart
    // Declares the variable x and initializes it with the value of 5
    var x: Int = 5
    // Reassigns a new value of 6 to the variable x
    x += 1
    // 6
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-var"}

Kotlin 支援型別推斷 (type inference)，並自動識別已宣告變數的資料型別。宣告變數時，您可以在變數名稱後省略型別：

```kotlin
fun main() {
//sampleStart
    // Declares the variable x with the value of 5;`Int` type is inferred
    val x = 5
    // 5
//sampleEnd
    println(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-inference"}

您只能在初始化變數後使用它們。您可以選擇在宣告時初始化變數，或者先宣告變數，然後再進行初始化。在後一種情況下，您必須指定資料型別：

```kotlin
fun main() {
//sampleStart
    // Initializes the variable x at the moment of declaration; type is not required
    val x = 5
    // Declares the variable c without initialization; type is required
    val c: Int
    // Initializes the variable c after declaration 
    c = 3
    // 5 
    // 3
//sampleEnd
    println(x)
    println(c)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-initialize"}

您可以在頂層 (top level) 宣告變數：

```kotlin
//sampleStart
val PI = 3.14
var x = 0

fun incrementX() {
    x += 1
}
// x = 0; PI = 3.14
// incrementX()
// x = 1; PI = 3.14
//sampleEnd

fun main() {
    println("x = $x; PI = $PI")
    incrementX()
    println("incrementX()")
    println("x = $x; PI = $PI")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-variable-top-level"}

有關宣告屬性 (properties) 的資訊，請參閱 [屬性](properties.md)。

## 建立類別與實例

若要定義一個類別 (class)，請使用 `class` 關鍵字：
```kotlin
class Shape
```

類別的屬性 (properties) 可以在其宣告或主體中列出：

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
```

類別宣告中列出的預設建構函數 (constructor) 會自動可用：

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
fun main() {
    val rectangle = Rectangle(5.0, 2.0)
    println("The perimeter is ${rectangle.perimeter}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-class-constructor"}

類別之間的繼承 (inheritance) 以冒號 (`:`) 宣告。類別預設為 `final`；若要讓類別可繼承，請將其標記為 `open`：

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double): Shape() {
    val perimeter = (height + length) * 2 
}
```

更多有關建構函數和繼承的資訊，請參閱 [類別](classes.md) 和 [物件與實例](object-declarations.md)。

## 註解

就像大多數現代語言一樣，Kotlin 支援單行（或稱 *行尾*）和多行（*區塊*）註解：

```kotlin
// This is an end-of-line comment

/* This is a block comment
   on multiple lines. */
```

Kotlin 中的區塊註解可以巢狀 (nested) 存在：

```kotlin
/* The comment starts here
/* contains a nested comment */     
and ends here. */
```

有關文件註解語法 (documentation comment syntax) 的資訊，請參閱 [文件化 Kotlin 程式碼](kotlin-doc.md)。

## 字串樣板

```kotlin
fun main() {
//sampleStart
    var a = 1
    // simple name in template:
    val s1 = "a is $a" 
    
    a = 2
    // arbitrary expression in template:
    val s2 = "${s1.replace("is", "was")}, but now is $a"
//sampleEnd
    println(s2)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-string-templates"}

詳情請參閱 [字串樣板](strings.md#string-templates)。

## 條件表達式

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-conditional-expressions"}

在 Kotlin 中，`if` 也可以用作表達式：

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int) = if (a > b) a else b
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-if-expression"}

請參閱 [`if`-表達式](control-flow.md#if-expression)。

## for 迴圈

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (item in items) {
        println(item)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-for-loop"}

或：

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (index in items.indices) {
        println("item at $index is ${items[index]}")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-for-loop-indices"}

請參閱 [for 迴圈](control-flow.md#for-loops)。

## while 迴圈

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    var index = 0
    while (index < items.size) {
        println("item at $index is ${items[index]}")
        index++
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-while-loop"}

請參閱 [while 迴圈](control-flow.md#while-loops)。

## when 表達式

```kotlin
//sampleStart
fun describe(obj: Any): String =
    when (obj) {
        1          -> "One"
        "Hello"    -> "Greeting"
        is Long    -> "Long"
        !is String -> "Not a string"
        else       -> "Unknown"
    }
//sampleEnd

fun main() {
    println(describe(1))
    println(describe("Hello"))
    println(describe(1000L))
    println(describe(2))
    println(describe("other"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-when-expression"}

請參閱 [when 表達式和陳述式](control-flow.md#when-expressions-and-statements)。

## 範圍

使用 `in` 運算子檢查數字是否在範圍內：

```kotlin
fun main() {
//sampleStart
    val x = 10
    val y = 9
    if (x in 1..y+1) {
        println("fits in range")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-range-in"}

檢查數字是否超出範圍：

```kotlin
fun main() {
//sampleStart
    val list = listOf("a", "b", "c")
    
    if (-1 !in 0..list.lastIndex) {
        println("-1 is out of range")
    }
    if (list.size !in list.indices) {
        println("list size is out of valid list indices range, too")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-out-of-range"}

迭代 (iterate) 一個範圍：

```kotlin
fun main() {
//sampleStart
    for (x in 1..5) {
        print(x)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-range"}

或迭代一個序列 (progression)：

```kotlin
fun main() {
//sampleStart
    for (x in 1..10 step 2) {
        print(x)
    }
    println()
    for (x in 9 downTo 0 step 3) {
        print(x)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-progression"}

請參閱 [範圍與序列](ranges.md)。

## 集合

迭代 (iterate) 一個集合 (collection)：

```kotlin
fun main() {
    val items = listOf("apple", "banana", "kiwifruit")
//sampleStart
    for (item in items) {
        println(item)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-collection"}

使用 `in` 運算子檢查集合是否包含物件：

```kotlin
fun main() {
    val items = setOf("apple", "banana", "kiwifruit")
//sampleStart
    when {
        "orange" in items -> println("juicy")
        "apple" in items -> println("apple is fine too")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-collection-in"}

使用 [lambda 表達式](lambdas.md) 來過濾 (filter) 和映射 (map) 集合：

```kotlin
fun main() {
//sampleStart
    val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
    fruits
      .filter { it.startsWith("a") }
      .sortedBy { it }
      .map { it.uppercase() }
      .forEach { println(it) }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-collection-filter-map"}

請參閱 [集合概覽](collections-overview.md)。

## 可空值與空值檢查

當 `null` 值可能出現時，引用必須明確標記為可空 (nullable)。可空型別名稱末尾帶有 `?`。

如果 `str` 不包含整數，則回傳 `null`：

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

使用回傳可空值的函數：

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

//sampleStart
fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // Using `x * y` yields error because they may hold nulls.
    if (x != null && y != null) {
        // x and y are automatically cast to non-nullable after null check
        println(x * y)
    }
    else {
        println("'$arg1' or '$arg2' is not a number")
    }    
}
//sampleEnd

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("a", "b")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-nullable-value"}

或：

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)
    
//sampleStart
    // ...
    if (x == null) {
        println("Wrong number format in arg1: '$arg1'")
        return
    }
    if (y == null) {
        println("Wrong number format in arg2: '$arg2'")
        return
    }

    // x and y are automatically cast to non-nullable after null check
    println(x * y)
//sampleEnd
}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("99", "b")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-null-check"}

請參閱 [空值安全](null-safety.md)。

## 型別檢查與自動轉換

`is` 運算子檢查一個表達式是否是某種類型 (type) 的實例 (instance)。
如果一個不可變的局部變數或屬性被檢查是否為特定型別，則無需顯式地轉換 (cast) 它：

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // `obj` is automatically cast to `String` in this branch
        return obj.length
    }

    // `obj` is still of type `Any` outside of the type-checked branch
    return null
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator"}

或：

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // `obj` is automatically cast to `String` in this branch
    return obj.length
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator-expression"}

甚至：

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    // `obj` is automatically cast to `String` on the right-hand side of `&&`
    if (obj is String && obj.length > 0) {
        return obj.length
    }

    return null
}
//sampleEnd

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator-logic"}

請參閱 [類別](classes.md) 和 [型別轉換](typecasts.md)。