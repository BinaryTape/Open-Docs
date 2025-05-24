---
title: 條件和迴圈
---
## If 表達式

在 Kotlin 中，`if` 是一個表達式：它會返回一個值。
因此，沒有三元運算符（`condition ? then : else`），因為普通的 `if` 在這個角色中也能正常工作。

```kotlin
fun main() {
    val a = 2
    val b = 3

    var max = a
    if (a < b) max = b

    // With else
    if (a > b) {
      max = a
    } else {
      max = b
    }

    // As expression
    max = if (a > b) a else b

    // You can also use `else if` in expressions:
    val maxLimit = 1
    val maxOrLimit = if (maxLimit > a) maxLimit else if (a > b) a else b
  
    println("max is $max")
    // max is 3
    println("maxOrLimit is $maxOrLimit")
    // maxOrLimit is 3

}
```

`if` 表達式的分支可以是程式碼區塊（blocks）。在這種情況下，最後一個表達式是程式碼區塊的值：

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

如果你使用 `if` 作為一個表達式，例如，為了返回其值或將其賦值給一個變數，則 `else` 分支是強制性的。

## When 表達式和語句

`when` 是一個條件表達式，它根據多個可能的值或條件執行程式碼。它類似於 Java、C 和類似語言中的 `switch` 語句。例如：

```kotlin
fun main() {

    val x = 2
    when (x) {
        1 `->` print("x == 1")
        2 `->` print("x == 2")
        else `->` print("x is neither 1 nor 2")
    }
    // x == 2

}
```

`when` 依序將其參數與所有分支進行比對，直到滿足某個分支條件。

你可以用幾種不同的方式使用 `when`。首先，你可以將 `when` 用作**表達式**或**語句**。
作為一個表達式，`when` 返回一個值，以供稍後在你的程式碼中使用。作為一個語句，`when` 完成一個動作
而不會返回任何進一步使用的東西：
<table>
<tr>
<td>
表達式（Expression）
</td>
<td>
語句（Statement）
</td>
</tr>
<tr>
<td>

```kotlin
// Returns a string assigned to the 
// text variable
val text = when (x) {
    1 `->` "x == 1"
    2 `->` "x == 2"
    else `->` "x is neither 1 nor 2"
}
```
</td>
<td>

```kotlin
// Returns nothing but triggers a 
// print statement
when (x) {
    1 `->` print("x == 1")
    2 `->` print("x == 2")
    else `->` print("x is neither 1 nor 2")
}
```
</td>
</tr>
</table>

其次，你可以使用帶或不帶主體的 `when`。無論你是否使用帶有主體的 `when`，你的表達式或
語句的行為都是相同的。我們建議盡可能使用帶有主體的 `when`，因為它可以通過清楚地顯示你要檢查的內容，使你的程式碼更易於閱讀
和維護。
<table>
<tr>
<td>
帶主體 `x`（With subject `x`）
</td>
<td>
不帶主體（Without subject）
</td>
</tr>
<tr>
<td>

```kotlin
when(x) { ... }
```
</td>
<td>

```kotlin
when { ... }
```
</td>
</tr>
</table>

根據你如何使用 `when`，對於你是否需要在你的
分支中涵蓋所有可能的情況，有不同的要求。

如果你使用 `when` 作為一個語句，你不必涵蓋所有可能的情況。在這個例子中，有些情況沒有被涵蓋，
所以什麼也沒發生。但是，沒有發生錯誤：

```kotlin
fun main() {

    val x = 3
    when (x) {
        // Not all cases are covered
        1 `->` print("x == 1")
        2 `->` print("x == 2")
    }

}
```

在一個 `when` 語句中，個別分支的值會被忽略。就像 `if` 一樣，每個分支都可以是一個程式碼區塊（block），
而它的值是該區塊中最後一個表達式的值。

如果你使用 `when` 作為一個表達式，你必須涵蓋所有可能的情況。換句話說，它必須是_詳盡的（exhaustive）_。
第一個匹配的分支的值會變成整個表達式的值。如果你不涵蓋所有的情況，
編譯器會拋出一個錯誤。

如果你的 `when` 表達式有一個主體，你可以使用一個 `else` 分支來確保所有可能的情況都被涵蓋，但
這不是強制性的。例如，如果你的主體是一個 `Boolean`、[`enum` 類別](enum-classes)、[`sealed` 類別](sealed-classes)，
或它們的可空對應物之一，你可以涵蓋所有的情況而不需要一個 `else` 分支：

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
  // No else branch is needed because all cases are covered
    Bit.ZERO `->` 0
    Bit.ONE `->` 1
}
```

如果你的 `when` 表達式**沒有**一個主體，你**必須**有一個 `else` 分支，否則編譯器會拋出一個錯誤。
當沒有其他分支條件被滿足時，`else` 分支會被評估：

```kotlin
when {
    a > b `->` "a is greater than b"
    a < b `->` "a is less than b"
    else `->` "a is equal to b"
}
```

`when` 表達式和語句提供了不同的方式來簡化你的程式碼、處理多個條件，以及執行
類型檢查。

你可以通過用逗號在一行中組合它們的條件，來為多個情況定義一個共同的行為：

```kotlin
when (x) {
    0, 1 `->` print("x == 0 or x == 1")
    else `->` print("otherwise")
}
```

你可以使用任意的表達式（而不僅僅是常數）作為分支條件：

```kotlin
when (x) {
    s.toInt() `->` print("s encodes x")
    else `->` print("s does not encode x")
}
```

你也可以通過 `in` 或 `!in` 關鍵字來檢查一個值是否包含在一個[範圍](ranges)或集合中：

```kotlin
when (x) {
    in 1..10 `->` print("x is in the range")
    in validNumbers `->` print("x is valid")
    !in 10..20 `->` print("x is outside the range")
    else `->` print("none of the above")
}
```

此外，你可以通過 `is` 或 `!is` 關鍵字來檢查一個值是否是一個特定的類型。請注意，由於[智能轉換](typecasts#smart-casts)，你可以訪問該類型的成員函數和屬性，而不需要
任何額外的檢查。

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String `->` x.startsWith("prefix")
    else `->` false
}
```

你可以使用 `when` 來替代一個 `if`-`else` `if` 鏈。
如果沒有主體，分支條件就只是布林表達式。第一個具有 `true` 條件的分支會執行：

```kotlin
when {
    x.isOdd() `->` print("x is odd")
    y.isEven() `->` print("y is even")
    else `->` print("x+y is odd")
}
```

你可以使用以下語法在一個變數中捕獲主體：

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success `->` response.body
        is HttpError `->` throw HttpException(response.status)
    }
```

作為主體引入的變數的作用域僅限於 `when` 表達式或語句的主體。

### When 表達式中的 Guard 條件

:::note
Guard 條件是一個[實驗性功能](components-stability#stability-levels-explained)，可能隨時更改。
我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140/Guard-conditions-in-when-expressions-feedback) 中的反饋。

Guard 條件允許您在 `when` 表達式的分支中包含
多個條件，從而使複雜的控制流更加明確和簡潔。
您可以在帶有主體的 `when` 表達式或語句中使用 Guard 條件。

要在分支中包含 Guard 條件，請將其放在主要條件之後，並用 `if` 分隔：

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // Branch with only primary condition. Calls `feedDog()` when `Animal` is `Dog`
        is Animal.Dog `->` feedDog()
        // Branch with both primary and guard conditions. Calls `feedCat()` when `Animal` is `Cat` and is not `mouseHunter`
        is Animal.Cat if !animal.mouseHunter `->` feedCat()
        // Prints "Unknown animal" if none of the above conditions match
        else `->` println("Unknown animal")
    }
}
```

在單個 `when` 表達式中，您可以組合具有和不具有 Guard 條件的分支。
只有當主要條件和 Guard 條件的計算結果都為 true 時，才會運行具有 Guard 條件的分支中的程式碼。
如果主要條件不匹配，則不會評估 Guard 條件。

如果您在沒有 `else` 分支的 `when` 語句中使用 Guard 條件，並且沒有任何條件匹配，則不會執行任何分支。

否則，如果您在沒有 `else` 分支的 `when` 表達式中使用 Guard 條件，則編譯器會要求您聲明所有可能的情況，以避免運行時錯誤。

此外，Guard 條件支持 `else if`：

```kotlin
when (animal) {
    // Checks if `animal` is `Dog`
    is Animal.Dog `->` feedDog()
    // Guard condition that checks if `animal` is `Cat` and not `mouseHunter`
    is Animal.Cat if !animal.mouseHunter `->` feedCat()
    // Calls giveLettuce() if none of the above conditions match and animal.eatsPlants is true
    else if animal.eatsPlants `->` giveLettuce()
    // Prints "Unknown animal" if none of the above conditions match
    else `->` println("Unknown animal")
}
```

使用布林運算符 `&&`（AND）或 `||`（OR）在單個分支中組合多個 Guard 條件。
使用括號將布林表達式括起來，以[避免混淆](coding-conventions#guard-conditions-in-when-expression)：

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) `->` feedCat()
}
```

您可以在任何帶有主體的 `when` 表達式或語句中使用 Guard 條件，除非您有多個以逗號分隔的條件。
例如，`0, 1 `->` print("x == 0 or x == 1")`。

要在 CLI 中啟用 Guard 條件，請運行以下命令：

`kotlinc -Xwhen-guards main.kt`

要在 Gradle 中啟用 Guard 條件，請將以下行添加到 `build.gradle.kts` 文件中：

`kotlin.compilerOptions.freeCompilerArgs.add("-Xwhen-guards")`

:::

## For 迴圈

`for` 迴圈遍歷任何提供迭代器（iterator）的東西。這相當於 C# 等語言中的 `foreach` 迴圈。
`for` 的語法如下：

```kotlin
for (item in collection) print(item)
```

`for` 的主體可以是一個程式碼區塊（block）。

```kotlin
for (item: Int in ints) {
    // ...
}
```

如前所述，`for` 遍歷任何提供迭代器的東西。這表示它：

* 有一個成員或擴展函數 `iterator()`，它返回 `Iterator<>`，其中：
  * 有一個成員或擴展函數 `next()`
  * 有一個成員或擴展函數 `hasNext()`，它返回 `Boolean`。

這三個函數都需要標記為 `operator`。

要遍歷一個數字範圍，請使用一個[範圍表達式](ranges)：

```kotlin
fun main() {

    for (i in 1..3) {
        print(i)
    }
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // 1236420

}
```

一個遍歷範圍或數組的 `for` 迴圈會被編譯成一個基於索引的迴圈，它不會創建一個迭代器對象。

如果你想用索引遍歷一個數組或列表，你可以這樣做：

```kotlin
fun main() {
val array = arrayOf("a", "b", "c")

    for (i in array.indices) {
        print(array[i])
    }
    // abc

}
```

或者，你可以使用 `withIndex` 函式庫函數：

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")

    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
    // the element at 0 is a
    // the element at 1 is b
    // the element at 2 is c

}
```

## While 迴圈

`while` 和 `do-while` 迴圈在其條件被滿足時持續處理它們的主體。
它們之間的區別在於條件檢查的時間：
* `while` 檢查條件，如果它被滿足，則處理主體，然後返回到條件檢查。
* `do-while` 處理主體，然後檢查條件。如果它被滿足，則迴圈重複。所以，`do-while` 的主體
至少運行一次，而不管條件如何。

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

## 迴圈中的 Break 和 Continue

Kotlin 支持迴圈中的傳統 `break` 和 `continue` 運算符。請參閱[返回和跳轉](returns)。