---
title: 基本語法
---
這是一些帶有範例的基本語法元素集合。在每個章節的末尾，你都會找到一個連結，連到相關主題的詳細描述。

你還可以透過 JetBrains Academy 的免費 [Kotlin Core 課程](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)學習所有 Kotlin 的精華。

## 封包定義和引入 (Package definition and imports)

封包規範應位於原始檔的頂部：

```kotlin
package my.demo

import kotlin.text.*

// ...
```

目錄和封包不一定要匹配：原始檔可以任意放置在檔案系統中。

請參閱 [封包 (Packages)](packages)。

## 程式進入點 (Program entry point)

Kotlin 應用程式的進入點是 `main` 函式：

```kotlin
fun main() {
    println("Hello world!")
}
```

`main` 的另一種形式接受可變數量的 `String` 參數：

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```

## 列印到標準輸出 (Print to the standard output)

`print` 將其參數列印到標準輸出：

```kotlin
fun main() {

    print("Hello ")
    print("world!")

}
```

`println` 列印其參數並新增一個換行符，以便你列印的下一個內容出現在下一行：

```kotlin
fun main() {

    println("Hello world!")
    println(42)

}
```

## 從標準輸入讀取 (Read from the standard input)

`readln()` 函式從標準輸入讀取。此函式將使用者輸入的整行讀取為字串。

你可以一起使用 `println()`、`readln()` 和 `print()` 函式來列印請求和顯示使用者輸入的訊息：

```kotlin
// 列印訊息以請求輸入
println("Enter any word: ")

// 讀取並儲存使用者輸入。例如：Happiness
val yourWord = readln()

// 列印帶有輸入的訊息
print("You entered the word: ")
print(yourWord)
// You entered the word: Happiness
```

如需更多資訊，請參閱 [讀取標準輸入 (Read standard input)](read-standard-input)。

## 函式 (Functions)

一個帶有兩個 `Int` 參數和 `Int` 回傳類型的函式：

```kotlin

fun sum(a: Int, b: Int): Int {
    return a + b
}

fun main() {
    print("sum of 3 and 5 is ")
    println(sum(3, 5))
}
```

函式主體可以是一個運算式。它的回傳類型是推斷的：

```kotlin

fun sum(a: Int, b: Int) = a + b

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```

一個不回傳有意義值的函式：

```kotlin

fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}

fun main() {
    printSum(-1, 8)
}
```

`Unit` 回傳類型可以省略：

```kotlin

fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}

fun main() {
    printSum(-1, 8)
}
```

請參閱 [函式 (Functions)](functions)。

## 變數 (Variables)

在 Kotlin 中，你宣告一個以關鍵字 `val` 或 `var` 開頭的變數，後跟變數的名稱。

使用 `val` 關鍵字來宣告僅被賦值一次的變數。 這些是不可變的唯讀本機變數，在初始化後不能重新賦值：

```kotlin
fun main() {

    // 宣告變數 x 並將其初始化為 5
    val x: Int = 5
    // 5

    println(x)
}
```

使用 `var` 關鍵字來宣告可以重新賦值的變數。 這些是可變變數，你可以在初始化後更改它們的值：

```kotlin
fun main() {

    // 宣告變數 x 並將其初始化為 5
    var x: Int = 5
    // 將新值 6 重新賦值給變數 x
    x += 1
    // 6

    println(x)
}
```

Kotlin 支援類型推斷，並自動識別已宣告變數的資料類型。 宣告變數時，你可以省略變數名稱後的類型：

```kotlin
fun main() {

    // 宣告變數 x，其值為 5；推斷出 `Int` 類型
    val x = 5
    // 5

    println(x)
}
```

你只能在使用變數初始化後才能使用它們。 你可以在宣告時初始化變數，也可以先宣告變數，然後再初始化它。
在第二種情況下，你必須指定資料類型：

```kotlin
fun main() {

    // 在宣告時初始化變數 x；不需要類型
    val x = 5
    // 宣告未初始化的變數 c；需要類型
    val c: Int
    // 在宣告後初始化變數 c
    c = 3
    // 5 
    // 3

    println(x)
    println(c)
}
```

你可以在最上層宣告變數：

```kotlin

val PI = 3.14
var x = 0

fun incrementX() {
    x += 1
}
// x = 0; PI = 3.14
// incrementX()
// x = 1; PI = 3.14

fun main() {
    println("x = $x; PI = $PI")
    incrementX()
    println("incrementX()")
    println("x = $x; PI = $PI")
}
```

如需宣告屬性的相關資訊，請參閱 [屬性 (Properties)](properties)。

## 建立類別和實例 (Creating classes and instances)

若要定義類別，請使用 `class` 關鍵字：
```kotlin
class Shape
```

類別的屬性可以在其宣告或主體中列出：

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
```

類別宣告中列出參數的預設建構函式會自動提供：

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2 
}
fun main() {
    val rectangle = Rectangle(5.0, 2.0)
    println("The perimeter is ${rectangle.perimeter}")
}
```

類別之間的繼承用冒號 (`:`) 宣告。 類別預設為 `final`；若要使類別可繼承，請將其標記為 `open`：

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double): Shape() {
    val perimeter = (height + length) * 2 
}
```

如需建構函式和繼承的更多資訊，請參閱 [類別 (Classes)](classes) 和 [物件和實例 (Objects and instances)](object-declarations)。

## 註解 (Comments)

與大多數現代語言一樣，Kotlin 支援單行（或 _行尾_）和多行（_區塊_）註解：

```kotlin
// This is an end-of-line comment

/* This is a block comment
   on multiple lines. */
```

Kotlin 中的區塊註解可以巢狀：

```kotlin
/* The comment starts here
/* contains a nested comment */     
and ends here. */
```

有關文件註解語法的資訊，請參閱 [撰寫 Kotlin 程式碼文件 (Documenting Kotlin Code)](kotlin-doc)。

## 字串模板 (String templates)

```kotlin
fun main() {

    var a = 1
    // 模板中的簡單名稱：
    val s1 = "a is $a" 
    
    a = 2
    // 模板中的任意運算式：
    val s2 = "${s1.replace("is", "was")}, but now is $a"

    println(s2)
}
```

有關詳細資訊，請參閱 [字串模板 (String templates)](strings#string-templates)。

## 條件運算式 (Conditional expressions)

```kotlin

fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

在 Kotlin 中，`if` 也可以用作運算式：

```kotlin

fun maxOf(a: Int, b: Int) = if (a > b) a else b

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

請參閱 [`if`-運算式 (`if`-expression)](control-flow#if-expression)。

## for 迴圈 (for loop)

```kotlin
fun main() {

    val items = listOf("apple", "banana", "kiwifruit")
    for (item in items) {
        println(item)
    }

}
```

或：

```kotlin
fun main() {

    val items = listOf("apple", "banana", "kiwifruit")
    for (index in items.indices) {
        println("item at $index is ${items[index]}")
    }

}
```

請參閱 [for 迴圈 (for loop)](control-flow#for-loops)。

## while 迴圈 (while loop)

```kotlin
fun main() {

    val items = listOf("apple", "banana", "kiwifruit")
    var index = 0
    while (index < items.size) {
        println("item at $index is ${items[index]}")
        index++
    }

}
```

請參閱 [while 迴圈 (while loop)](control-flow#while-loops)。

## when 運算式 (when expression)

```kotlin

fun describe(obj: Any): String =
    when (obj) {
        1          `->` "One"
        "Hello"    `->` "Greeting"
        is Long    `->` "Long"
        !is String `->` "Not a string"
        else       `->` "Unknown"
    }

fun main() {
    println(describe(1))
    println(describe("Hello"))
    println(describe(1000L))
    println(describe(2))
    println(describe("other"))
}
```

請參閱 [when 運算式和陳述式 (when expressions and statements)](control-flow#when-expressions-and-statements)。

## 範圍 (Ranges)

使用 `in` 運算子檢查數字是否在範圍內：

```kotlin
fun main() {

    val x = 10
    val y = 9
    if (x in 1..y+1) {
        println("fits in range")
    }

}
```

檢查數字是否超出範圍：

```kotlin
fun main() {

    val list = listOf("a", "b", "c")
    
    if (-1 !in 0..list.lastIndex) {
        println("-1 is out of range")
    }
    if (list.size !in list.indices) {
        println("list size is out of valid list indices range, too")
    }

}
```

疊代範圍：

```kotlin
fun main() {

    for (x in 1..5) {
        print(x)
    }

}
```

或疊代進程：

```kotlin
fun main() {

    for (x in 1..10 step 2) {
        print(x)
    }
    println()
    for (x in 9 downTo 0 step 3) {
        print(x)
    }

}
```

請參閱 [範圍和進程 (Ranges and progressions)](ranges)。

## 集合 (Collections)

疊代集合：

```kotlin
fun main() {
    val items = listOf("apple", "banana", "kiwifruit")

    for (item in items) {
        println(item)
    }

}
```

使用 `in` 運算子檢查集合是否包含物件：

```kotlin
fun main() {
    val items = setOf("apple", "banana", "kiwifruit")

    when {
        "orange" in items `->` println("juicy")
        "apple" in items `->` println("apple is fine too")
    }

}
```

使用 [lambda 運算式 (lambda expressions)](lambdas) 來篩選和映射集合：

```kotlin
fun main() {

    val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
    fruits
      .filter { it.startsWith("a") }
      .sortedBy { it }
      .map { it.uppercase() }
      .forEach { println(it) }

}
```

請參閱 [集合概觀 (Collections overview)](collections-overview)。

## 可為空值和空值檢查 (Nullable values and null checks)

如果 `null` 值是可能的，則必須將參考明確標記為可為空值。 可為空值的類型名稱在結尾有 `?`。

如果 `str` 沒有整數，則回傳 `null`：

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

使用回傳可為空值的函式：

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // 使用 `x * y` 會產生錯誤，因為它們可能包含空值。
    if (x != null && y != null) {
        // 在空值檢查後，x 和 y 會自動轉換為不可為空值
        println(x * y)
    }
    else {
        println("'$arg1' or '$arg2' is not a number")
    }    
}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("a", "b")
}
```

或：

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // ...
    if (x == null) {
        println("Wrong number format in arg1: '$arg1'")
        return
    }
    if (y == null) {
        println("Wrong number format in arg2: '$arg2'")
        return
    }

    // 在空值檢查後，x 和 y 會自動轉換為不可為空值
    println(x * y)

}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("99", "b")
}
```

請參閱 [空值安全 (Null-safety)](null-safety)。

## 類型檢查和自動轉換 (Type checks and automatic casts)

`is` 運算子檢查運算式是否為某種類型的實例。
如果檢查不可變的本機變數或屬性是否為特定類型，則無需明確轉換它：

```kotlin

fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // 在此分支中，`obj` 會自動轉換為 `String`
        return obj.length
    }

    // 在類型檢查分支之外，`obj` 仍然是 `Any` 類型
    return null
}

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```

或：

```kotlin

fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // 在此分支中，`obj` 會自動轉換為 `String`
    return obj.length
}

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```

甚至：

```kotlin

fun getStringLength(obj: Any): Int? {
    // 在 `&&` 的右側，`obj` 會自動轉換為 `String`
    if (obj is String && obj.length > 0) {
        return obj.length
    }

    return null
}

fun main() {
    fun printLength(obj: Any) {
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
```

請參閱 [類別 (Classes)](classes) 和 [類型轉換 (Type casts)](typecasts)。