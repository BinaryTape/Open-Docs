[//]: # (title: 條件與迴圈)

## If 表達式

在 Kotlin 中，`if` 是一個表達式：它會回傳一個值。
因此，沒有三元運算子 (`condition ? then : else`)，因為普通的 `if` 在此角色中運作良好。

```kotlin
fun main() {
    val a = 2
    val b = 3

    //sampleStart
    var max = a
    if (a < b) max = b

    // 帶有 else
    if (a > b) {
      max = a
    } else {
      max = b
    }

    // 作為表達式
    max = if (a > b) a else b

    // 你也可以在表達式中使用 `else if`：
    val maxLimit = 1
    val maxOrLimit = if (maxLimit > a) maxLimit else if (a > b) a else b
  
    println("max is $max")
    // max is 3
    println("maxOrLimit is $maxOrLimit")
    // maxOrLimit is 3
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-if-kotlin"}

`if` 表達式的分支可以是區塊。在這種情況下，最後一個表達式就是該區塊的值：

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

如果你將 `if` 作為表達式使用，例如用於回傳其值或將其賦予變數，則 `else` 分支是強制性的。

## When 表達式與語句

`when` 是一個條件表達式，它根據多個可能的值或條件來執行程式碼。它類似於 Java、C 及類似語言中的 `switch` 語句。例如：

```kotlin
fun main() {
    //sampleStart
    val x = 2
    when (x) {
        1 -> print("x == 1")
        2 -> print("x == 2")
        else -> print("x is neither 1 nor 2")
    }
    // x == 2
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-conditions-when-statement"}

`when` 會將其引數與所有分支依序比對，直到某個分支條件滿足為止。

你可以用幾種不同的方式使用 `when`。首先，你可以將 `when` 作為 **表達式** 或 **語句** 使用。
作為表達式，`when` 會回傳一個值以供後續在程式碼中使用。作為語句，`when` 會完成一個動作而不回傳任何進一步有用的東西：

<table>
   <tr>
       <td>表達式</td>
       <td>語句</td>
   </tr>
   <tr>
<td>

```kotlin
// 回傳一個賦予 text 變數的字串
val text = when (x) {
    1 -> "x == 1"
    2 -> "x == 2"
    else -> "x is neither 1 nor 2"
}
```

</td>
<td>

```kotlin
// 不回傳任何東西，但會觸發一個 print 語句
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> print("x is neither 1 nor 2")
}
```

</td>
</tr>
</table>

其次，你可以使用帶有或不帶有主題的 `when`。無論你是否在 `when` 中使用主題，你的表達式或語句行為都相同。我們建議在可能的情況下使用帶有主題的 `when`，因為它能清楚地顯示你正在檢查的內容，使你的程式碼更易於閱讀和維護。

<table>
   <tr>
       <td>帶有主題 `x`</td>
       <td>不帶主題</td>
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

根據你使用 `when` 的方式，對於是否需要在分支中涵蓋所有可能的情況有不同的要求。

如果你將 `when` 作為語句使用，你不需要涵蓋所有可能的情況。在此範例中，有些情況未被涵蓋，因此什麼都不會發生。然而，不會發生錯誤：

```kotlin
fun main() {
    //sampleStart
    val x = 3
    when (x) {
        // 並非所有情況都涵蓋
        1 -> print("x == 1")
        2 -> print("x == 2")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

在 `when` 語句中，各個分支的值會被忽略。就像 `if` 一樣，每個分支都可以是一個區塊，其值是區塊中最後一個表達式的值。

如果你將 `when` 作為表達式使用，你必須涵蓋所有可能的情況。換句話說，它必須是 _詳盡的_。
第一個匹配分支的值會成為整個表達式的值。如果你沒有涵蓋所有情況，編譯器會拋出錯誤。

如果你的 `when` 表達式有主題，你可以使用 `else` 分支來確保所有可能的情況都被涵蓋，但這並非強制性的。例如，如果你的主題是 `Boolean`、[`enum` 類別](enum-classes.md)、[`sealed` 類別](sealed-classes.md)，或它們的可空對應類型之一，你可以在沒有 `else` 分支的情況下涵蓋所有情況：

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
    // 不需要 else 分支，因為所有情況都已被涵蓋
    Bit.ZERO -> 0
    Bit.ONE -> 1
}
```

> 為了簡化 `when` 表達式並減少重複，請嘗試上下文相關解析 (目前為預覽版)。
> 如果已知預期的類型，此功能允許你在 `when` 表達式中使用 enum 條目或 sealed class 成員時省略類型名稱。
> 
> 欲了解更多資訊，請參閱 [上下文相關解析的預覽](whatsnew22.md#preview-of-context-sensitive-resolution) 或相關的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)。
> 
{style="tip"}

如果你的 `when` 表達式**沒有**主題，你**必須**有一個 `else` 分支，否則編譯器會拋出錯誤。
當所有其他分支條件都不滿足時，`else` 分支會被求值：

```kotlin
val message = when {
    a > b -> "a is greater than b"
    a < b -> "a is less than b"
    else -> "a is equal to b"
}
```

`when` 表達式和語句提供了不同的方式來簡化你的程式碼、處理多個條件並執行類型檢查。

你可以透過用逗號將多個情況的條件組合在一行中，來為它們定義共同的行為： 

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

你可以使用任意表達式 (不僅是常數) 作為分支條件：

```kotlin
when (x) {
    s.toInt() -> print("s encodes x")
    else -> print("s does not encode x")
}
```

你還可以透過 `in` 或 `!in` 關鍵字檢查一個值是否包含在 [範圍](ranges.md) 或集合中：

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

此外，你可以透過 `is` 或 `!is` 關鍵字檢查一個值是否為特定類型。請注意，由於 [智慧型轉型](typecasts.md#smart-casts)，你可以無需任何額外檢查即可存取該類型的成員函數和屬性。

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

你可以使用 `when` 來取代 `if`-`else if` 鏈。
如果沒有主題，分支條件就只是布林表達式。第一個條件為 `true` 的分支會執行：

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is odd")
}
```

你可以使用以下語法將主題捕獲到一個變數中：

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success -> response.body
        is HttpError -> throw HttpException(response.status)
    }
```

作為主題引入的變數其作用域僅限於 `when` 表達式或語句的本體。

### When 表達式中的防護條件

防護條件允許你在 `when` 表達式的分支中包含一個以上的條件，使複雜的控制流更加明確和簡潔。
你可以在帶有主題的 `when` 表達式或語句中使用防護條件。

要在分支中包含防護條件，請將其放置在主要條件之後，並以 `if` 分隔：

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // 僅包含主要條件的分支。當 `animal` 為 `Dog` 時呼叫 `feedDog()`。
        is Animal.Dog -> feedDog()
        // 包含主要條件和防護條件的分支。當 `animal` 為 `Cat` 且不是 `mouseHunter` 時呼叫 `feedCat()`。
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // 如果以上條件都不匹配，則印出 "Unknown animal"
        else -> println("Unknown animal")
    }
}
```

在單個 `when` 表達式中，你可以組合帶有和不帶防護條件的分支。
帶有防護條件的分支中的程式碼只有在主要條件和防護條件都評估為 true 時才會執行。
如果主要條件不匹配，則防護條件不會被求值。

如果你在不帶 `else` 分支的 `when` 語句中使用防護條件，並且沒有任何條件匹配，則沒有任何分支會被執行。

否則，如果你在不帶 `else` 分支的 `when` 表達式中使用防護條件，編譯器會要求你宣告所有可能的情況，以避免執行時錯誤。

此外，防護條件也支援 `else if`：

```kotlin
when (animal) {
    // 檢查 `animal` 是否為 `Dog`
    is Animal.Dog -> feedDog()
    // 防護條件，檢查 `animal` 是否為 `Cat` 且不是 `mouseHunter`
    is Animal.Cat if !animal.mouseHunter -> feedCat()
    // 如果以上條件都不匹配且 animal.eatsPlants 為 true，則呼叫 giveLettuce()
    else if animal.eatsPlants -> giveLettuce()
    // 如果以上條件都不匹配，則印出 "Unknown animal"
    else -> println("Unknown animal")
}
```

可以在單一分支內使用布林運算子 `&&` (AND) 或 `||` (OR) 組合多個防護條件。
使用圓括號將布林表達式括起來，以 [避免混淆](coding-conventions.md#guard-conditions-in-when-expression)：

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

你可以在任何帶有主題的 `when` 表達式或語句中使用防護條件，但不能用於有多個條件以逗號分隔的情況。
例如，`0, 1 -> print("x == 0 or x == 1")`。

## For 迴圈

`for` 迴圈會迭代任何提供迭代器 (iterator) 的東西。這等同於 C# 等語言中的 `foreach` 迴圈。
`for` 的語法如下：

```kotlin
for (item in collection) print(item)
```

`for` 的本體可以是區塊。

```kotlin
for (item: Int in ints) {
    // ...
}
```

如前所述，`for` 會迭代任何提供迭代器的東西。這表示它：

* 具有一個成員或擴充函數 `iterator()`，它會回傳 `Iterator<T>`，且該 `Iterator<T>`：
  * 具有一個成員或擴充函數 `next()`
  * 具有一個成員或擴充函數 `hasNext()`，它會回傳 `Boolean`。

這三個函數都需要被標記為 `operator`。

要迭代一個數字範圍，請使用 [範圍表達式](ranges.md)：

```kotlin
fun main() {
//sampleStart
    for (i in 1..3) {
        print(i)
    }
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // 1236420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

對範圍或陣列進行的 `for` 迴圈會被編譯成一個基於索引的迴圈，它不會建立迭代器物件。

如果你想透過索引迭代陣列或列表，你可以這樣做：

```kotlin
fun main() {
val array = arrayOf("a", "b", "c")
//sampleStart
    for (i in array.indices) {
        print(array[i])
    }
    // abc
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

或者，你可以使用 `withIndex` 庫函數：

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")
//sampleStart
    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
    // the element at 0 is a
    // the element at 1 is b
    // the element at 2 is c
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## While 迴圈

`while` 和 `do-while` 迴圈會在其條件滿足時持續處理其本體。
它們之間的區別在於條件檢查的時間：
* `while` 會檢查條件，如果條件滿足，則處理本體，然後返回到條件檢查。
* `do-while` 會處理本體，然後檢查條件。如果條件滿足，則迴圈重複。因此，無論條件如何，`do-while` 的本體至少會執行一次。

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y 在這裡可見！
```

## 迴圈中的 Break 和 Continue

Kotlin 支援迴圈中的傳統 `break` 和 `continue` 運算子。參閱 [回傳與跳轉](returns.md)。