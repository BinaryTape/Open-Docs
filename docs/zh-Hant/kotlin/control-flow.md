[//]: # (title: 條件與迴圈)

## If 表達式

在 Kotlin 中，`if` 是一個表達式：它會回傳一個值。
因此，沒有三元運算子（`condition ? then : else`），因為一般的 `if` 就可以很好地扮演這個角色。

```kotlin
fun main() {
    val a = 2
    val b = 3

    //sampleStart
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
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-if-kotlin"}

`if` 表達式的分支可以是程式區塊 (block)。在這種情況下，最後一個表達式就是該區塊的值：

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

如果你將 `if` 用作表達式，例如，為了回傳它的值或將它賦值給變數，那麼 `else` 分支是強制性的。

## When 表達式與陳述式

`when` 是一個條件表達式，它根據多個可能的值或條件執行程式碼。它類似於 Java、C 和其他類似語言中的 `switch` 陳述式。例如：

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

`when` 會將其引數與所有分支依序匹配，直到某個分支條件被滿足。

你可以用幾種不同的方式使用 `when`。首先，你可以將 `when` 用作**表達式**或**陳述式**。
作為表達式，`when` 回傳一個值供你的程式碼後續使用。作為陳述式，`when` 完成一個動作，而不回傳任何進一步使用的東西：

<table>
   <tr>
       <td>表達式</td>
       <td>陳述式</td>
   </tr>
   <tr>
<td>

```kotlin
// Returns a string assigned to the 
// text variable
val text = when (x) {
    1 -> "x == 1"
    2 -> "x == 2"
    else -> "x is neither 1 nor 2"
}
```

</td>
<td>

```kotlin
// Returns nothing but triggers a 
// print statement
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> print("x is neither 1 nor 2")
}
```

</td>
</tr>
</table>

其次，你可以在 `when` 中使用或不使用主體 (subject)。無論你是否在 `when` 中使用主體，你的表達式或
陳述式行為都相同。我們建議盡可能在 `when` 中使用主體，因為它透過清楚地顯示你正在檢查什麼，使你的程式碼更容易閱讀和維護。

<table>
   <tr>
       <td>帶有主體 <code>x</code></td>
       <td>不帶主體</td>
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

如果你將 `when` 用作陳述式，你不必涵蓋所有可能的情況。在此範例中，有些情況未被涵蓋，
因此什麼也沒有發生。然而，不會發生錯誤：

```kotlin
fun main() {
    //sampleStart
    val x = 3
    when (x) {
        // Not all cases are covered
        1 -> print("x == 1")
        2 -> print("x == 2")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

在 `when` 陳述式中，個別分支的值會被忽略。就像 `if` 一樣，每個分支都可以是一個區塊，
其值是區塊中最後一個表達式的值。

如果你將 `when` 用作表達式，你必須涵蓋所有可能的情況。換句話說，它必須是 _窮盡的_ (exhaustive)。
第一個匹配分支的值成為整個表達式的值。如果你沒有涵蓋所有情況，編譯器將會拋出錯誤。

如果你的 `when` 表達式有一個主體，你可以使用 `else` 分支來確保涵蓋所有可能的情況，但
這不是強制性的。例如，如果你的主體是一個 `Boolean`、[`enum` 類別](enum-classes.md)、[`sealed` 類別](sealed-classes.md)，
或它們的可空對應項，你可以在沒有 `else` 分支的情況下涵蓋所有情況：

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
    // No else branch is needed because all cases are covered
    Bit.ZERO -> 0
    Bit.ONE -> 1
}
```

如果你的 `when` 表達式**沒有**主體，你**必須**有一個 `else` 分支，否則編譯器會拋出錯誤。
當沒有其他分支條件被滿足時，`else` 分支會被求值：

```kotlin
val message = when {
    a > b -> "a is greater than b"
    a < b -> "a is less than b"
    else -> "a is equal to b"
}
```

`when` 表達式和陳述式提供了不同的方式來簡化你的程式碼，處理多個條件，並執行
類型檢查。

你可以透過將多個條件用逗號組合在一行中，為多個情況定義通用行為：

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

你可以使用任意表達式（不僅是常數）作為分支條件：

```kotlin
when (x) {
    s.toInt() -> print("s encodes x")
    else -> print("s does not encode x")
}
```

你還可以透過 `in` 或 `!in` 關鍵字檢查一個值是否包含在[範圍](ranges.md)或集合中：

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

此外，你還可以透過 `is` 或 `!is` 關鍵字檢查一個值是否為特定類型。請注意，
由於[智慧型轉型](typecasts.md#smart-casts)，你可以存取該類型成員函式和屬性，而無需任何額外的檢查。

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

你可以使用 `when` 來替代 `if`-`else if` 鏈。
如果沒有主體，分支條件就只是布林表達式。第一個條件為 `true` 的分支會執行：

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is odd")
}
```

你可以使用以下語法將主體捕獲到變數中：

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success -> response.body
        is HttpError -> throw HttpException(response.status)
    }
```

作為主體引入的變數作用域僅限於 `when` 表達式或陳述式的主體。

### When 表達式中的守衛條件 (Guard conditions)

> 守衛條件是[實驗性功能](components-stability.md#stability-levels-explained)，隨時可能更改。
> 我們非常感謝你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140/Guard-conditions-in-when-expressions-feedback) 中提供意見回饋。
>
{style="warning"}

守衛條件允許你在 `when` 表達式的分支中包含
多個條件，使複雜的控制流程更明確和簡潔。
你可以在帶有主體的 `when` 表達式或陳述式中使用守衛條件。

要在分支中包含守衛條件，請將其放在主要條件之後，並以 `if` 分隔：

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // Branch with only primary condition. Calls `feedDog()` when `animal` is `Dog`
        is Animal.Dog -> feedDog()
        // Branch with both primary and guard conditions. Calls `feedCat()` when `animal` is `Cat` and not `mouseHunter`
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // Prints "Unknown animal" if none of the above conditions match
        else -> println("Unknown animal")
    }
}
```

在單個 `when` 表達式中，你可以組合帶有和不帶守衛條件的分支。
帶有守衛條件的分支中的程式碼僅在主要條件和守衛條件都評估為 true 時才會執行。
如果主要條件不匹配，則守衛條件不會被評估。

如果你在不帶 `else` 分支的 `when` 陳述式中使用守衛條件，並且沒有條件匹配，則沒有任何分支會被執行。

否則，如果你在不帶 `else` 分支的 `when` 表達式中使用守衛條件，編譯器會要求你宣告所有可能的情況，以避免執行時錯誤。

此外，守衛條件支援 `else if`：

```kotlin
when (animal) {
    // Checks if `animal` is `Dog`
    is Animal.Dog -> feedDog()
    // Guard condition that checks if `animal` is `Cat` and not `mouseHunter`
    is Animal.Cat if !animal.mouseHunter -> feedCat()
    // Calls giveLettuce() if none of the above conditions match and animal.eatsPlants is true
    else if animal.eatsPlants -> giveLettuce()
    // Prints "Unknown animal" if none of the above conditions match
    else -> println("Unknown animal")
}
```

使用布林運算子 `&&` (AND) 或 `||` (OR) 在單個分支中組合多個守衛條件。
在布林表達式周圍使用括號以[避免混淆](coding-conventions.md#guard-conditions-in-when-expression)：

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

你可以在任何帶有主體的 `when` 表達式或陳述式中使用守衛條件，除了當你有多個條件用逗號分隔的情況。
例如，`0, 1 -> print("x == 0 or x == 1")`。

> 若要在命令列介面 (CLI) 中啟用守衛條件，請執行以下命令：
>
> `kotlinc -Xwhen-guards main.kt`
>
> 若要在 Gradle 中啟用守衛條件，請在 `build.gradle.kts` 檔案中加入以下行：
>
> `kotlin.compilerOptions.freeCompilerArgs.add("-Xwhen-guards")`
>
{style="note"}

## For 迴圈

`for` 迴圈會迭代任何提供迭代器 (iterator) 的東西。這等同於 C# 等語言中的 `foreach` 迴圈。
`for` 的語法如下：

```kotlin
for (item in collection) print(item)
```

`for` 的主體可以是區塊 (block)。

```kotlin
for (item: Int in ints) {
    // ...
}
```

如前所述，`for` 會迭代任何提供迭代器的東西。這表示它：

* 有一個成員或擴充函式 `iterator()`，它回傳 `Iterator<>()`，而這個 `Iterator<>()`：
  * 有一個成員或擴充函式 `next()`
  * 有一個成員或擴充函式 `hasNext()`，它回傳 `Boolean`。

所有這三個函式都需要被標記為 `operator`。

要迭代數字範圍，請使用[範圍表達式](ranges.md)：

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

對範圍或陣列的 `for` 迴圈會被編譯為基於索引的迴圈，這不會建立迭代器物件。

如果你想透過索引迭代陣列或列表 (list)，你可以這樣做：

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

或者，你可以使用 `withIndex` 函式庫函式：

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

`while` 和 `do-while` 迴圈在條件滿足時持續處理其主體。
它們之間的差異在於條件檢查的時間：
* `while` 檢查條件，如果滿足，則處理主體，然後返回到條件檢查。
* `do-while` 處理主體，然後檢查條件。如果滿足，迴圈會重複。因此，無論條件如何，`do-while` 的主體至少會執行一次。

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

## 迴圈中的 Break 與 Continue

Kotlin 支援迴圈中傳統的 `break` 和 `continue` 運算子。請參閱[回傳與跳轉](returns.md)。